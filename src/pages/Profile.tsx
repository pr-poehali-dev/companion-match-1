import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const INTERESTS = [
  'Книги', 'Путешествия', 'Музыка', 'Спорт', 'Бизнес',
  'Технологии', 'Искусство', 'Кино', 'Фотография', 'Кулинария',
  'Наука', 'Мода', 'Психология', 'Автомобили', 'Игры'
];

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('Александр');
  const [age, setAge] = useState('30');
  const [bio, setBio] = useState('Люблю путешествовать и знакомиться с интересными людьми');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Книги', 'Путешествия', 'Технологии'
  ]);
  const [notifications, setNotifications] = useState(true);
  const [shareContacts, setShareContacts] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    console.log('Saving profile...');
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
            <Button variant="ghost" size="sm">
              Мои поездки
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-20 px-4 animate-fade-in">
        <div className="container mx-auto max-w-4xl">
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
            <div className="text-7xl">👤</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Профиль</h1>
              <p className="text-muted-foreground">
                Управляйте своими данными и настройками
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Имя
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите имя"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Возраст
                    </label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Введите возраст"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    О себе
                  </label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Расскажите о себе..."
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Эта информация будет видна вашим попутчикам
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Интересы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Выберите темы, которые вам интересны. Это поможет найти подходящих попутчиков.
                </p>
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
                <p className="text-xs text-muted-foreground mt-4">
                  Выбрано: {selectedInterests.length} из {INTERESTS.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Паспортные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Серия и номер
                    </label>
                    <Input placeholder="0000 000000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Дата выдачи
                    </label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Кем выдан
                  </label>
                  <Input placeholder="Кем выдан паспорт" />
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Icon name="Lock" size={18} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Данные защищены и используются только для покупки билетов
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Уведомления</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления о новых попутчиках
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Делиться контактами</p>
                    <p className="text-sm text-muted-foreground">
                      Показывать знакомых, которые едут в том же поезде
                    </p>
                  </div>
                  <Switch
                    checked={shareContacts}
                    onCheckedChange={setShareContacts}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button size="lg" onClick={handleSave}>
                <Icon name="Save" className="mr-2" size={18} />
                Сохранить изменения
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
