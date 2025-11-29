import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isLivePlaying, setIsLivePlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState('Подключение...');
  const [songRequest, setSongRequest] = useState({ name: '', song: '', message: '' });
  const audioRef = useRef<HTMLAudioElement>(null);

  const RADIO_STREAM_URL = 'http://176.108.192.17:8000/stream';
  const LOGO_URL = 'https://sun9-46.userapi.com/s/v1/ig2/1rB2hR5T6YsFflKnT3VzfcGvBUAajW-M3dDzEKLbo1Tb4RR5cgmPgt0xP-UVmiIDecAU5H_AKLjgScIjX35zi3CY.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&from=bu&cs=720x0';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch('http://176.108.192.17:8000/status-json.xsl');
        const data = await response.json();
        if (data.icestats?.source) {
          const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
          setCurrentTrack(source.title || 'Прямой эфир');
        }
      } catch (error) {
        setCurrentTrack('Прямой эфир');
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleLiveRadio = () => {
    if (audioRef.current) {
      if (isLivePlaying) {
        audioRef.current.pause();
        setIsLivePlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing radio:', err);
        });
        setIsLivePlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSongRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Song request:', songRequest);
    setSongRequest({ name: '', song: '', message: '' });
    alert('Ваш заказ отправлен! Спасибо!');
  };

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'radio', label: 'Радио', icon: 'Radio' },
    { id: 'requests', label: 'Заказать песню', icon: 'Music' },
    { id: 'about', label: 'О медиа-группе', icon: 'Info' },
    { id: 'team', label: 'Команда', icon: 'Users' },
    { id: 'archive', label: 'Архив', icon: 'Archive' },
  ];

  const teamMembers = [
    { name: 'Анна Петрова', role: 'Главный редактор', image: '👩‍💼' },
    { name: 'Дмитрий Иванов', role: 'Ведущий радиошоу', image: '👨‍🎤' },
    { name: 'Мария Сидорова', role: 'Журналист', image: '👩‍💻' },
    { name: 'Алексей Смирнов', role: 'Звукорежиссёр', image: '👨‍🎧' },
  ];

  const podcasts = [
    {
      id: 1,
      title: 'Новости недели',
      date: '15 ноября 2025',
      duration: '25:30',
      description: 'Обзор главных событий школьной жизни за неделю',
    },
    {
      id: 2,
      title: 'Интервью с выпускником',
      date: '8 ноября 2025',
      duration: '18:45',
      description: 'Беседа с успешным выпускником о карьере в IT',
    },
    {
      id: 3,
      title: 'Музыкальная перемена',
      date: '1 ноября 2025',
      duration: '30:00',
      description: 'Популярная музыка и обсуждение новинок',
    },
    {
      id: 4,
      title: 'Подготовка к экзаменам',
      date: '25 октября 2025',
      duration: '22:15',
      description: 'Советы и лайфхаки для успешной сдачи экзаменов',
    },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const togglePlay = (id: number) => {
    setCurrentlyPlaying(currentlyPlaying === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Логотип ЧТД" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">Медиа-группа ЧТД</h1>
                <p className="text-xs text-muted-foreground">Центр творческого развития</p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="gap-2"
                >
                  <Icon name={item.icon as any} size={16} />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <Badge className="mb-4 text-sm px-4 py-1.5" variant="secondary">
              Школьное медиа с 2015 года
            </Badge>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Медиа-группа ЧТД
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Создаём качественный контент, освещаем школьные события и развиваем медиакультуру среди учащихся
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => scrollToSection('radio')} className="gap-2">
                <Icon name="Radio" size={20} />
                Слушать радио
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('archive')} className="gap-2">
                <Icon name="Archive" size={20} />
                Архив передач
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="radio" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-slide-up">
            <h3 className="text-4xl font-heading font-bold mb-4">Радио ЧТД</h3>
            <p className="text-muted-foreground text-lg">Прямой эфир школьного радио</p>
          </div>
          
          <Card className="overflow-hidden shadow-lg animate-scale-in">
            <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <Icon name="Radio" size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-heading font-bold">В эфире сейчас</h4>
                    <p className="text-white/80 animate-fade-in">{currentTrack}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="animate-pulse">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  LIVE
                </Badge>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <audio ref={audioRef} src={RADIO_STREAM_URL} preload="none" />
                <div className="flex items-center gap-4 mb-4">
                  <Button 
                    size="lg" 
                    className="rounded-full w-16 h-16 bg-white text-primary hover:bg-white/90"
                    onClick={toggleLiveRadio}
                  >
                    <Icon name={isLivePlaying ? 'Pause' : 'Play'} size={32} />
                  </Button>
                  <div className="flex-1">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className={`h-full bg-white rounded-full w-1/3 ${isLivePlaying ? 'animate-pulse' : ''}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Volume2" size={20} className="text-white" />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Прямой эфир</span>
                  <span>Радио ЧТД · 176.108.192.17:8000</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h5 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <Icon name="Calendar" size={20} />
                Расписание эфиров на сегодня
              </h5>
              <div className="space-y-3">
                {[
                  { time: '09:00 - 09:15', title: 'Музыкальная перемена' },
                  { time: '12:00 - 12:30', title: 'Новости дня' },
                  { time: '15:00 - 15:45', title: 'Познавательный час' },
                  { time: '17:00 - 18:00', title: 'Вечерний микс' },
                ].map((show, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-muted rounded-lg hover:bg-muted/60 transition-colors">
                    <Icon name="Clock" size={16} className="text-primary" />
                    <span className="font-medium">{show.time}</span>
                    <span className="text-muted-foreground">{show.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="requests" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 animate-slide-up">
            <h3 className="text-4xl font-heading font-bold mb-4">Стол заказов</h3>
            <p className="text-muted-foreground text-lg">Закажите свою любимую песню в эфир!</p>
          </div>
          
          <Card className="shadow-lg animate-scale-in">
            <CardContent className="p-8">
              <form onSubmit={handleSongRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <input
                    type="text"
                    value={songRequest.name}
                    onChange={(e) => setSongRequest({...songRequest, name: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Как к вам обращаться?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Название песни и исполнитель</label>
                  <input
                    type="text"
                    value={songRequest.song}
                    onChange={(e) => setSongRequest({...songRequest, song: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Например: Би-2 - Полковнику никто не пишет"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение в эфир (необязательно)</label>
                  <textarea
                    value={songRequest.message}
                    onChange={(e) => setSongRequest({...songRequest, message: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                    placeholder="Поздравление, пожелание или посвящение..."
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full gap-2">
                  <Icon name="Music" size={20} />
                  Отправить заказ
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
                  <span>Ваш заказ будет рассмотрен ведущим. Песни ставятся в порядке очереди с учётом формата эфира.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h3 className="text-4xl font-heading font-bold mb-6">О медиа-группе</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Медиа-группа ЧТД работает с 2015 года и объединяет талантливых учащихся, увлечённых журналистикой, радиовещанием и мультимедиа-проектами.
              </p>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Мы создаём качественный контент, освещаем школьные события, проводим интервью с интересными людьми и развиваем медиакультуру среди учащихся.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="gap-2">
                  <Icon name="Mail" size={20} />
                  Связаться с нами
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-heading font-bold text-primary mb-2">10+</div>
                <p className="text-muted-foreground">Лет работы</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-heading font-bold text-secondary mb-2">50+</div>
                <p className="text-muted-foreground">Участников</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-heading font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground">Выпусков</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-heading font-bold text-secondary mb-2">15+</div>
                <p className="text-muted-foreground">Наград</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-slide-up">
            <h3 className="text-4xl font-heading font-bold mb-4">Наша команда</h3>
            <p className="text-muted-foreground text-lg">Знакомьтесь с редакцией медиа-группы ЧТД</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-all hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h4 className="font-heading font-semibold text-lg mb-2">{member.name}</h4>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="archive" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-slide-up">
            <h3 className="text-4xl font-heading font-bold mb-4">Архив передач</h3>
            <p className="text-muted-foreground text-lg">Слушайте записи наших подкастов и радиопередач</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {podcasts.map((podcast) => (
              <Card key={podcast.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Button
                      size="icon"
                      className="rounded-full shrink-0 w-12 h-12"
                      onClick={() => togglePlay(podcast.id)}
                    >
                      <Icon name={currentlyPlaying === podcast.id ? 'Pause' : 'Play'} size={20} />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-semibold mb-2 text-lg">{podcast.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{podcast.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {podcast.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {podcast.duration}
                        </span>
                      </div>
                      
                      {currentlyPlaying === podcast.id && (
                        <div className="mt-4 animate-fade-in">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-1/3 transition-all"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="Plus" size={20} />
              Загрузить ещё
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-heading font-bold text-lg mb-4">Медиа-группа ЧТД</h4>
              <p className="text-white/70">Школьное радио и медиапроекты с 2015 года</p>
            </div>
            
            <div>
              <h4 className="font-heading font-bold text-lg mb-4">Контакты</h4>
              <div className="space-y-2 text-white/70">
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  media@chtd.school
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-bold text-lg mb-4">Следите за нами</h4>
              <div className="flex gap-3">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                  <Icon name="Share2" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                  <Icon name="MessageCircle" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                  <Icon name="Music" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
            © 2025 Медиа-группа ЧТД. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;