'''
Business: API для управления поездками - создание, просмотр, обновление и удаление поездок пользователя
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с attributes: request_id, function_name
Returns: HTTP response dict с данными поездок
'''

import json
import os
from typing import Dict, Any
from datetime import datetime, date
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def serialize_dates(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            trip_id = params.get('trip_id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if trip_id:
                    cur.execute('''
                        SELECT id, user_id, from_city, to_city, travel_date, 
                               train_number, carriage, seat, status, rating,
                               created_at, updated_at
                        FROM trips WHERE id = %s
                    ''', (trip_id,))
                    trip = cur.fetchone()
                    
                    if not trip:
                        return {
                            'statusCode': 404,
                            'headers': headers,
                            'body': json.dumps({'error': 'Trip not found'}),
                            'isBase64Encoded': False
                        }
                    
                    trip_dict = dict(trip)
                    for key in trip_dict:
                        trip_dict[key] = serialize_dates(trip_dict[key])
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(trip_dict),
                        'isBase64Encoded': False
                    }
                
                elif user_id:
                    cur.execute('''
                        SELECT id, user_id, from_city, to_city, travel_date, 
                               train_number, carriage, seat, status, rating,
                               created_at, updated_at
                        FROM trips WHERE user_id = %s
                        ORDER BY travel_date DESC, created_at DESC
                    ''', (user_id,))
                    trips = cur.fetchall()
                    
                    trips_list = []
                    for trip in trips:
                        trip_dict = dict(trip)
                        for key in trip_dict:
                            trip_dict[key] = serialize_dates(trip_dict[key])
                        trips_list.append(trip_dict)
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({'trips': trips_list}),
                        'isBase64Encoded': False
                    }
                
                else:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'user_id or trip_id is required'}),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            user_id = body_data.get('user_id')
            from_city = body_data.get('from_city')
            to_city = body_data.get('to_city')
            travel_date = body_data.get('travel_date')
            train_number = body_data.get('train_number')
            carriage = body_data.get('carriage')
            seat = body_data.get('seat')
            
            if not all([user_id, from_city, to_city, travel_date]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id, from_city, to_city, and travel_date are required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    INSERT INTO trips (user_id, from_city, to_city, travel_date, 
                                     train_number, carriage, seat, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, user_id, from_city, to_city, travel_date, 
                              train_number, carriage, seat, status, created_at
                ''', (user_id, from_city, to_city, travel_date, 
                      train_number, carriage, seat, 'pending'))
                trip = cur.fetchone()
                
                conn.commit()
                
                trip_dict = dict(trip)
                for key in trip_dict:
                    trip_dict[key] = serialize_dates(trip_dict[key])
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps(trip_dict),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            trip_id = body_data.get('trip_id')
            if not trip_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'trip_id is required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                update_fields = []
                update_values = []
                
                if 'from_city' in body_data:
                    update_fields.append('from_city = %s')
                    update_values.append(body_data['from_city'])
                if 'to_city' in body_data:
                    update_fields.append('to_city = %s')
                    update_values.append(body_data['to_city'])
                if 'travel_date' in body_data:
                    update_fields.append('travel_date = %s')
                    update_values.append(body_data['travel_date'])
                if 'train_number' in body_data:
                    update_fields.append('train_number = %s')
                    update_values.append(body_data['train_number'])
                if 'carriage' in body_data:
                    update_fields.append('carriage = %s')
                    update_values.append(body_data['carriage'])
                if 'seat' in body_data:
                    update_fields.append('seat = %s')
                    update_values.append(body_data['seat'])
                if 'status' in body_data:
                    update_fields.append('status = %s')
                    update_values.append(body_data['status'])
                if 'rating' in body_data:
                    update_fields.append('rating = %s')
                    update_values.append(body_data['rating'])
                
                update_fields.append('updated_at = CURRENT_TIMESTAMP')
                
                if update_fields:
                    update_query = f"UPDATE trips SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
                    update_values.append(trip_id)
                    cur.execute(update_query, update_values)
                    trip = cur.fetchone()
                    
                    if not trip:
                        return {
                            'statusCode': 404,
                            'headers': headers,
                            'body': json.dumps({'error': 'Trip not found'}),
                            'isBase64Encoded': False
                        }
                    
                    conn.commit()
                    
                    trip_dict = dict(trip)
                    for key in trip_dict:
                        trip_dict[key] = serialize_dates(trip_dict[key])
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(trip_dict),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            trip_id = params.get('trip_id')
            
            if not trip_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'trip_id is required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute('UPDATE trips SET status = %s WHERE id = %s', ('cancelled', trip_id))
                
                if cur.rowcount == 0:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Trip not found'}),
                        'isBase64Encoded': False
                    }
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Trip cancelled successfully'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        conn.close()
