import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const TRIPS_API_URL = 'https://functions.poehali.dev/d15d65b4-83cc-4aac-8f33-08d2fc50d90f';

interface Trip {
  id: number;
  from_city: string;
  to_city: string;
  travel_date: string;
  train_number?: string;
  carriage?: number;
  seat?: number;
  status: string;
  rating?: number;
}

export default function Trips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      loadTrips(parseInt(userId));
    } else {
      setLoading(false);
    }
  }, []);

  const loadTrips = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${TRIPS_API_URL}?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips || []);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const activeTrips = trips.filter(trip => 
    trip.status === 'pending' || trip.status === 'confirmed'
  );
  
  const pastTrips = trips.filter(trip => 
    trip.status === 'completed' || trip.status === 'cancelled'
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <span className="text-2xl">🚂</span>
            <span>Рандом Купе</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              Главная
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              Профиль
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-20 px-4 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              Назад
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="text-7xl">🎫</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Мои поездки</h1>
              <p className="text-muted-foreground">
                История путешествий и предстоящие поездки
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="active">
                  Активные ({activeTrips.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  История ({pastTrips.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6 space-y-4">
                {activeTrips.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">У вас пока нет активных поездок</p>
                      <Button onClick={() => navigate('/')}>
                        Найти попутчиков
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  activeTrips.map((trip) => (
                    <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-semibold">
                                {trip.from_city} → {trip.to_city}
                              </h3>
                              <Badge variant={trip.status === 'confirmed' ? 'default' : 'secondary'}>
                            {trip.status === 'confirmed' ? 'Подтверждено' : 'Ожидание'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} />
                                <span>{formatDate(trip.travel_date)}</span>
                              </div>
                              {trip.train_number && (
                                <div className="flex items-center gap-2">
                                  <Icon name="Train" size={16} />
                                  <span>Поезд {trip.train_number}</span>
                                </div>
                              )}
                              {trip.carriage && trip.seat && (
                                <div className="flex items-center gap-2">
                                  <Icon name="Armchair" size={16} />
                                  <span>Вагон {trip.carriage}, место {trip.seat}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-6 space-y-4">
                {pastTrips.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">У вас пока нет завершённых поездок</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastTrips.map((trip) => (
                    <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-semibold">
                                {trip.from_city} → {trip.to_city}
                              </h3>
                              {trip.rating && (
                                <div className="flex items-center gap-1">
                                  {renderStars(trip.rating)}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} />
                                <span>{formatDate(trip.travel_date)}</span>
                              </div>
                              {trip.train_number && (
                                <div className="flex items-center gap-2">
                                  <Icon name="Train" size={16} />
                                  <span>Поезд {trip.train_number}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}

