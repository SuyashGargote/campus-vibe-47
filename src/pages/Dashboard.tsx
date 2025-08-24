import { useEffect, useState } from "react";
import {
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Star,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventCard from "@/components/cards/EventCard";
import {
  getEvents,
  getDiscussions,
  getClubs,
  initializeSampleData,
  registerForEvent,
  unregisterFromEvent,
  isUserRegisteredForEvent,
} from "@/lib/storage";
import { Event, Discussion, Club } from "@/lib/types";
import { Link } from "react-router-dom";
import campusHero from "@/assets/campus-hero.jpg";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [viewClubOpen, setViewClubOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<{
    [key: string]: boolean;
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    initializeSampleData();
    const eventsData = getEvents();
    const discussionsData = getDiscussions();
    const clubsData = getClubs();

    setEvents(eventsData);
    setDiscussions(discussionsData);
    setClubs(clubsData);

    // Load user registrations
    const registrations: { [key: string]: boolean } = {};
    eventsData.forEach((event) => {
      registrations[event.id] = isUserRegisteredForEvent(event.id);
    });
    setUserRegistrations(registrations);
  }, []);

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const trendingDiscussions = discussions
    .sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
    .slice(0, 3);

  const featuredClubs = clubs.sort((a, b) => b.members - a.members).slice(0, 3);

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Discussions",
      value: discussions.length,
      icon: MessageSquare,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Student Clubs",
      value: clubs.length,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Members",
      value: clubs.reduce((sum, club) => sum + club.members, 0),
      icon: TrendingUp,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  const handleViewClub = (club: Club) => {
    setSelectedClub(club);
    setViewClubOpen(true);
  };

  const handleJoinClub = (clubId: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Joined Club!",
      description: "You have successfully joined the club.",
    });
  };

  const handleEventRegister = (eventId: string) => {
    const isRegistered = userRegistrations[eventId];

    if (isRegistered) {
      // Unregister
      if (unregisterFromEvent(eventId)) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? { ...event, attendees: event.attendees - 1 }
              : event
          )
        );
        setUserRegistrations((prev) => ({ ...prev, [eventId]: false }));
        toast({
          title: "Registration Cancelled!",
          description: "You have been unregistered from this event.",
        });
      }
    } else {
      // Register
      if (registerForEvent(eventId)) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? { ...event, attendees: event.attendees + 1 }
              : event
          )
        );
        setUserRegistrations((prev) => ({ ...prev, [eventId]: true }));
        toast({
          title: "Registration Successful!",
          description: "You have been registered for this event.",
        });
      } else {
        toast({
          title: "Registration Failed!",
          description: "This event is full or no longer available.",
          variant: "destructive",
        });
      }
    }
  };

  const categoryColors = {
    technical: "bg-primary text-primary-foreground",
    cultural: "bg-accent text-accent-foreground",
    sports: "bg-secondary text-secondary-foreground",
    academic: "bg-muted text-muted-foreground",
    social: "bg-destructive text-destructive-foreground",
    other: "bg-border text-foreground",
  };

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
              Your hub for campus events, discussions, and communities. Connect,
              engage, and make the most of your student life.
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
              <Card
                key={stat.title}
                className="hover:shadow-hover transition-all duration-300 border-border"
              >
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
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Clock className="w-6 h-6 text-primary" />
              <span>Upcoming Events</span>
            </h2>
            <Link to="/events">
              <Button
                variant="outline"
                className="border-border hover:bg-muted"
              >
                View All Events
              </Button>
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={() => handleEventRegister(event.id)}
                  isRegistered={userRegistrations[event.id]}
                />
              ))}
            </div>
          ) : (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No upcoming events at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trending Discussions */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-secondary" />
              <span>Trending Discussions</span>
            </h2>
            <Link to="/discussions">
              <Button
                variant="outline"
                className="border-border hover:bg-muted"
              >
                View All Discussions
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {trendingDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="hover:shadow-hover transition-all duration-300 border-border"
              >
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
                    <span className="text-muted-foreground">
                      by {discussion.author}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">
                        ↑ {discussion.upvotes}
                      </span>
                      <span className="text-muted-foreground">
                        {discussion.replies.length} replies
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Clubs */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Star className="w-6 h-6 text-accent" />
              <span>Featured Clubs</span>
            </h2>
            <Link to="/clubs">
              <Button
                variant="outline"
                className="border-border hover:bg-muted"
              >
                View All Clubs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <Card
                key={club.id}
                className="hover:shadow-hover transition-all duration-300 border-border"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-foreground">
                      {club.name}
                    </CardTitle>
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
                    <Button
                      onClick={() => handleViewClub(club)}
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-muted"
                    >
                      View Club
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* View Club Dialog */}
      <Dialog open={viewClubOpen} onOpenChange={setViewClubOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedClub && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {selectedClub.name}
                    </DialogTitle>
                    <p className="text-muted-foreground mt-2">
                      {selectedClub.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={`${
                        categoryColors[selectedClub.category]
                      } capitalize`}
                    >
                      {selectedClub.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleJoinClub(selectedClub.id)}
                  className="bg-accent hover:bg-accent-light text-accent-foreground"
                >
                  Join Club
                </Button>
              </DialogHeader>

              <div className="space-y-6">
                {/* Club Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      Members
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {selectedClub.members} members
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      Activities
                    </h3>
                    <div className="space-y-1">
                      {selectedClub.activities
                        .slice(0, 3)
                        .map((activity, index) => (
                          <div
                            key={index}
                            className="text-sm text-muted-foreground flex items-center"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {activity}
                          </div>
                        ))}
                      {selectedClub.activities.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{selectedClub.activities.length - 3} more activities
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          Email
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedClub.contact.email}
                      </p>
                    </div>
                    {selectedClub.contact.phone && (
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">
                            Phone
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedClub.contact.phone}
                        </p>
                      </div>
                    )}
                    {selectedClub.contact.social && (
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                          <ExternalLink className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">
                            Social Media
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedClub.contact.social}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Club Section */}
                <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Interested in joining this club? Click the button above to
                      become a member!
                    </p>
                    <Button
                      onClick={() => handleJoinClub(selectedClub.id)}
                      className="bg-accent hover:bg-accent-light text-accent-foreground"
                    >
                      Join Club
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
