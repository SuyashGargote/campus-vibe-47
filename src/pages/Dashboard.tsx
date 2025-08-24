import { useEffect, useState } from 'react';
import { Calendar, MessageSquare, Users, TrendingUp, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/cards/EventCard';
import { getEvents, getDiscussions, getClubs, initializeSampleData } from '@/lib/storage';
import { Event, Discussion, Club } from '@/lib/types';
import { Link } from 'react-router-dom';
import campusHero from '@/assets/campus-hero.jpg';

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    initializeSampleData();
    setEvents(getEvents());
    setDiscussions(getDiscussions());
    setClubs(getClubs());
  }, []);

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const trendingDiscussions = discussions
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 3);

  const featuredClubs = clubs
    .sort((a, b) => b.members - a.members)
    .slice(0, 3);

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Discussions',
      value: discussions.length,
      icon: MessageSquare,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Student Clubs',
      value: clubs.length,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Members',
      value: clubs.reduce((sum, club) => sum + club.members, 0),
      icon: TrendingUp,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={campusHero} 
          alt="Campus Connect Portal" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Campus Connect
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your hub for campus events, discussions, and communities. 
              Connect, engage, and make the most of your student life.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-hover transition-all duration-300 border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Clock className="w-6 h-6 text-primary" />
              <span>Upcoming Events</span>
            </h2>
            <Link to="/events">
              <Button variant="outline" className="border-border hover:bg-muted">
                View All Events
              </Button>
            </Link>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming events at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trending Discussions */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-secondary" />
              <span>Trending Discussions</span>
            </h2>
            <Link to="/discussions">
              <Button variant="outline" className="border-border hover:bg-muted">
                View All Discussions
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {trendingDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-hover transition-all duration-300 border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 text-foreground">
                      {discussion.title}
                    </CardTitle>
                    <Badge className="ml-2 bg-secondary text-secondary-foreground capitalize">
                      {discussion.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {discussion.content}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">by {discussion.author}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">↑ {discussion.upvotes}</span>
                      <span className="text-muted-foreground">{discussion.replies.length} replies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Clubs */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Star className="w-6 h-6 text-accent" />
              <span>Featured Clubs</span>
            </h2>
            <Link to="/clubs">
              <Button variant="outline" className="border-border hover:bg-muted">
                View All Clubs
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <Card key={club.id} className="hover:shadow-hover transition-all duration-300 border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-foreground">{club.name}</CardTitle>
                    <Badge className="bg-accent text-accent-foreground capitalize">
                      {club.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {club.members} members
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                      View Club
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;