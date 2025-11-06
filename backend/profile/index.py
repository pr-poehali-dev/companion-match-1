'''
Business: API для управления профилем пользователя - создание, чтение, обновление данных и интересов
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с attributes: request_id, function_name
Returns: HTTP response dict с данными профиля
'''

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    SELECT id, name, age, bio, avatar, 
                           passport_series, passport_number, passport_issued_date, passport_issued_by,
                           notifications_enabled, share_contacts, created_at, updated_at
                    FROM users WHERE id = %s
                ''', (user_id,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('''
                    SELECT i.name 
                    FROM user_interests ui
                    JOIN interests i ON ui.interest_id = i.id
                    WHERE ui.user_id = %s
                ''', (user_id,))
                interests = [row['name'] for row in cur.fetchall()]
                
                user_dict = dict(user)
                user_dict['interests'] = interests
                user_dict['created_at'] = user_dict['created_at'].isoformat() if user_dict['created_at'] else None
                user_dict['updated_at'] = user_dict['updated_at'].isoformat() if user_dict['updated_at'] else None
                user_dict['passport_issued_date'] = user_dict['passport_issued_date'].isoformat() if user_dict['passport_issued_date'] else None
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(user_dict),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name')
            age = body_data.get('age')
            bio = body_data.get('bio', '')
            avatar = body_data.get('avatar', '👤')
            interests = body_data.get('interests', [])
            
            if not name or not age:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'name and age are required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    INSERT INTO users (name, age, bio, avatar)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, name, age, bio, avatar, created_at
                ''', (name, age, bio, avatar))
                user = cur.fetchone()
                user_id = user['id']
                
                for interest_name in interests:
                    cur.execute('''
                        INSERT INTO user_interests (user_id, interest_id)
                        SELECT %s, id FROM interests WHERE name = %s
                        ON CONFLICT (user_id, interest_id) DO NOTHING
                    ''', (user_id, interest_name))
                
                conn.commit()
                
                user_dict = dict(user)
                user_dict['interests'] = interests
                user_dict['created_at'] = user_dict['created_at'].isoformat() if user_dict['created_at'] else None
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps(user_dict),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            user_id = body_data.get('user_id')
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                update_fields = []
                update_values = []
                
                if 'name' in body_data:
                    update_fields.append('name = %s')
                    update_values.append(body_data['name'])
                if 'age' in body_data:
                    update_fields.append('age = %s')
                    update_values.append(body_data['age'])
                if 'bio' in body_data:
                    update_fields.append('bio = %s')
                    update_values.append(body_data['bio'])
                if 'avatar' in body_data:
                    update_fields.append('avatar = %s')
                    update_values.append(body_data['avatar'])
                if 'passport_series' in body_data:
                    update_fields.append('passport_series = %s')
                    update_values.append(body_data['passport_series'])
                if 'passport_number' in body_data:
                    update_fields.append('passport_number = %s')
                    update_values.append(body_data['passport_number'])
                if 'passport_issued_date' in body_data:
                    update_fields.append('passport_issued_date = %s')
                    update_values.append(body_data['passport_issued_date'])
                if 'passport_issued_by' in body_data:
                    update_fields.append('passport_issued_by = %s')
                    update_values.append(body_data['passport_issued_by'])
                if 'notifications_enabled' in body_data:
                    update_fields.append('notifications_enabled = %s')
                    update_values.append(body_data['notifications_enabled'])
                if 'share_contacts' in body_data:
                    update_fields.append('share_contacts = %s')
                    update_values.append(body_data['share_contacts'])
                
                update_fields.append('updated_at = CURRENT_TIMESTAMP')
                
                if update_fields:
                    update_query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
                    update_values.append(user_id)
                    cur.execute(update_query, update_values)
                    user = cur.fetchone()
                    
                    if not user:
                        return {
                            'statusCode': 404,
                            'headers': headers,
                            'body': json.dumps({'error': 'User not found'}),
                            'isBase64Encoded': False
                        }
                
                if 'interests' in body_data:
                    cur.execute('SELECT 1 FROM users WHERE id = %s', (user_id,))
                    if not cur.fetchone():
                        return {
                            'statusCode': 404,
                            'headers': headers,
                            'body': json.dumps({'error': 'User not found'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute('''
                        SELECT i.name 
                        FROM user_interests ui
                        JOIN interests i ON ui.interest_id = i.id
                        WHERE ui.user_id = %s
                    ''', (user_id,))
                    existing_interests = {row['name'] for row in cur.fetchall()}
                    new_interests = set(body_data['interests'])
                    
                    to_remove = existing_interests - new_interests
                    to_add = new_interests - existing_interests
                    
                    for interest_name in to_remove:
                        cur.execute('''
                            SELECT ui.id FROM user_interests ui
                            JOIN interests i ON ui.interest_id = i.id
                            WHERE ui.user_id = %s AND i.name = %s
                        ''', (user_id, interest_name))
                        row = cur.fetchone()
                        if row:
                            cur.execute('UPDATE user_interests SET interest_id = NULL WHERE id = %s', (row['id'],))
                    
                    for interest_name in to_add:
                        cur.execute('''
                            INSERT INTO user_interests (user_id, interest_id)
                            SELECT %s, id FROM interests WHERE name = %s
                            ON CONFLICT (user_id, interest_id) DO NOTHING
                        ''', (user_id, interest_name))
                
                conn.commit()
                
                cur.execute('''
                    SELECT id, name, age, bio, avatar,
                           passport_series, passport_number, passport_issued_date, passport_issued_by,
                           notifications_enabled, share_contacts, created_at, updated_at
                    FROM users WHERE id = %s
                ''', (user_id,))
                user = cur.fetchone()
                
                cur.execute('''
                    SELECT interest FROM user_interests WHERE user_id = %s AND interest IS NOT NULL
                ''', (user_id,))
                interests = [row['interest'] for row in cur.fetchall()]
                
                user_dict = dict(user)
                user_dict['interests'] = interests
                user_dict['created_at'] = user_dict['created_at'].isoformat() if user_dict['created_at'] else None
                user_dict['updated_at'] = user_dict['updated_at'].isoformat() if user_dict['updated_at'] else None
                user_dict['passport_issued_date'] = user_dict['passport_issued_date'].isoformat() if user_dict['passport_issued_date'] else None
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(user_dict),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()