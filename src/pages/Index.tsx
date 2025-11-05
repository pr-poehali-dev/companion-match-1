import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const INTERESTS = [
  'Книги', 'Путешествия', 'Музыка', 'Спорт', 'Бизнес',
  'Технологии', 'Искусство', 'Кино', 'Фотография', 'Кулинария'
];

const MOCK_COMPANIONS = [
  {
    id: 1,
    name: 'Анна',
    age: 28,
    from: 'Москва',
    to: 'Санкт-Петербург',
    date: '15 ноября',
    interests: ['Книги', 'Путешествия', 'Музыка'],
    avatar: '👩‍💼',
    match: 85
  },
  {
    id: 2,
    name: 'Дмитрий',
    age: 32,
    from: 'Москва',
    to: 'Санкт-Петербург',
    date: '15 ноября',
    interests: ['Технологии', 'Бизнес', 'Спорт'],
    avatar: '👨‍💻',
    match: 75
  },
  {
    id: 3,
    name: 'Мария',
    age: 25,
    from: 'Москва',
    to: 'Санкт-Петербург',
    date: '16 ноября',
    interests: ['Искусство', 'Кино', 'Фотография'],
    avatar: '👩‍🎨',
    match: 70
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<'hero' | 'search'>('hero');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
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
            <Button variant="ghost" size="sm">
              Мои поездки
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              Профиль
            </Button>
          </div>
        </div>
      </nav>

      {activeStep === 'hero' && (
        <section className="pt-32 pb-20 px-4 animate-fade-in">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="text-6xl mb-6 animate-scale-in">🚂✨</div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight">
              Путешествуйте<br />с единомышленниками
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Находите попутчиков по интересам для поездок на поезде.
              Делайте путешествие интереснее через общение.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => setActiveStep('search')}
            >
              Найти попутчиков
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>

          <div className="container mx-auto max-w-6xl mt-24 px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              Как это работает
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="text-4xl mb-4">1️⃣</div>
                  <h3 className="text-xl font-semibold mb-3">
                    Укажите маршрут
                  </h3>
                  <p className="text-muted-foreground">
                    Выберите город отправления, прибытия и даты поездки
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="text-4xl mb-4">2️⃣</div>
                  <h3 className="text-xl font-semibold mb-3">
                    Выберите интересы
                  </h3>
                  <p className="text-muted-foreground">
                    Укажите темы, которые вам интересны для общения
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="text-4xl mb-4">3️⃣</div>
                  <h3 className="text-xl font-semibold mb-3">
                    Найдите попутчиков
                  </h3>
                  <p className="text-muted-foreground">
                    Получите список людей с похожими интересами в вашем поезде
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeStep === 'search' && (
        <section className="pt-24 pb-20 px-4 animate-fade-in">
          <div className="container mx-auto max-w-6xl">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => setActiveStep('hero')}
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              Назад
            </Button>

            <h1 className="text-4xl font-bold mb-8">Поиск попутчиков</h1>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Откуда
                    </label>
                    <Input
                      placeholder="Москва"
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Куда
                    </label>
                    <Input
                      placeholder="Санкт-Петербург"
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Дата поездки
                  </label>
                  <Input type="date" className="h-12 max-w-xs" />
                </div>

                <Separator className="my-6" />

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Ваши интересы
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto mt-6">
                  <Icon name="Search" className="mr-2" size={18} />
                  Найти
                </Button>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Найдено попутчиков: {MOCK_COMPANIONS.length}
              </h2>

              <div className="space-y-4">
                {MOCK_COMPANIONS.map((companion) => (
                  <Card key={companion.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="text-5xl">{companion.avatar}</div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">
                                {companion.name}, {companion.age}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Icon name="MapPin" size={16} />
                                <span>{companion.from} → {companion.to}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-base px-3 py-1">
                              {companion.match}% совпадение
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                            <Icon name="Calendar" size={16} />
                            <span>{companion.date}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {companion.interests.map((interest) => (
                              <Badge key={interest} variant="outline">
                                {interest}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-3">
                            <Button size="sm" className="flex-1 md:flex-none">
                              <Icon name="MessageCircle" className="mr-2" size={16} />
                              Написать
                            </Button>
                            <Button size="sm" variant="outline">
                              <Icon name="User" className="mr-2" size={16} />
                              Профиль
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}