import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const ACTIVE_TRIPS = [
  {
    id: 1,
    from: 'Москва',
    to: 'Санкт-Петербург',
    date: '15 ноября 2025',
    trainNumber: '020А',
    carriage: 5,
    seat: 12,
    status: 'confirmed',
    companions: [
      { name: 'Анна', avatar: '👩‍💼', interests: ['Книги', 'Музыка'] },
      { name: 'Дмитрий', avatar: '👨‍💻', interests: ['Технологии', 'Бизнес'] }
    ]
  },
  {
    id: 2,
    from: 'Санкт-Петербург',
    to: 'Москва',
    date: '20 ноября 2025',
    trainNumber: '026А',
    carriage: 3,
    seat: 8,
    status: 'pending',
    companions: []
  }
];

const PAST_TRIPS = [
  {
    id: 3,
    from: 'Москва',
    to: 'Казань',
    date: '1 октября 2025',
    trainNumber: '044А',
    rating: 5,
    companions: [
      {
        name: 'Елена',
        avatar: '👩‍🎨',
        rating: 5,
        review: 'Отличная компания! Время пролетело незаметно',
        interests: ['Искусство', 'Путешествия']
      },
      {
        name: 'Сергей',
        avatar: '👨‍🔬',
        rating: 4,
        review: 'Интересный собеседник',
        interests: ['Наука', 'Книги']
      }
    ]
  },
  {
    id: 4,
    from: 'Москва',
    to: 'Екатеринбург',
    date: '15 сентября 2025',
    trainNumber: '068У',
    rating: 4,
    companions: [
      {
        name: 'Ольга',
        avatar: '👩‍💼',
        rating: 5,
        review: 'Прекрасное путешествие!',
        interests: ['Бизнес', 'Спорт']
      }
    ]
  }
];

export default function Trips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active">
                Активные ({ACTIVE_TRIPS.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                История ({PAST_TRIPS.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6 space-y-4">
              {ACTIVE_TRIPS.map((trip) => (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-semibold">
                            {trip.from} → {trip.to}
                          </h3>
                          <Badge variant={trip.status === 'confirmed' ? 'default' : 'secondary'}>
                            {trip.status === 'confirmed' ? 'Подтверждено' : 'Ожидание'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={16} />
                            <span>{trip.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Train" size={16} />
                            <span>Поезд {trip.trainNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Armchair" size={16} />
                            <span>Вагон {trip.carriage}, место {trip.seat}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Icon name="Users" size={18} />
                        Попутчики ({trip.companions.length})
                      </h4>
                      {trip.companions.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-3">
                          {trip.companions.map((companion, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                            >
                              <div className="text-3xl">{companion.avatar}</div>
                              <div className="flex-1">
                                <p className="font-medium">{companion.name}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {companion.interests.map((interest) => (
                                    <Badge key={interest} variant="outline" className="text-xs">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Попутчики пока не найдены
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button size="sm">
                        <Icon name="MessageCircle" className="mr-2" size={16} />
                        Чат купе
                      </Button>
                      <Button size="sm" variant="outline">
                        <Icon name="Info" className="mr-2" size={16} />
                        Детали
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="mt-6 space-y-4">
              {PAST_TRIPS.map((trip) => (
                <Card key={trip.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {trip.from} → {trip.to}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={16} />
                            <span>{trip.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Train" size={16} />
                            <span>Поезд {trip.trainNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(trip.rating)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Icon name="Users" size={18} />
                      Попутчики
                    </h4>
                    <div className="space-y-3">
                      {trip.companions.map((companion, idx) => (
                        <div key={idx} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{companion.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-lg">{companion.name}</p>
                                <div className="flex items-center gap-1">
                                  {renderStars(companion.rating)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {companion.interests.map((interest) => (
                                  <Badge key={interest} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground italic">
                                "{companion.review}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
