import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onEdit?: (event: Event) => void;
  isRegistered?: boolean;
}

const categoryColors = {
  workshop: "bg-secondary text-secondary-foreground",
  seminar: "bg-primary text-primary-foreground",
  fest: "bg-accent text-accent-foreground",
  competition: "bg-destructive text-destructive-foreground",
  social: "bg-muted text-muted-foreground",
};

const EventCard = ({
  event,
  onRegister,
  onEdit,
  isRegistered = false,
}: EventCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const spotsLeft = event.maxAttendees - event.attendees;
  const isAlmostFull = spotsLeft <= 10;
  const isFull = spotsLeft <= 0;

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 animate-scale-in border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {event.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          </div>
          <Badge
            className={`ml-2 ${categoryColors[event.category]} capitalize`}
          >
            {event.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground col-span-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Attendance Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {event.attendees}/{event.maxAttendees} registered
            </span>
          </div>
          {isAlmostFull && (
            <Badge variant="destructive" className="text-xs">
              {spotsLeft} spots left
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAlmostFull ? "bg-destructive" : "bg-primary"
            }`}
            style={{
              width: `${(event.attendees / event.maxAttendees) * 100}%`,
            }}
          />
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Organizer */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          Organized by{" "}
          <span className="font-medium text-foreground">{event.organizer}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {onRegister && (
            <Button
              onClick={() => onRegister(event.id)}
              className={`flex-1 ${
                isRegistered
                  ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  : "bg-primary hover:bg-primary-dark text-primary-foreground"
              }`}
              disabled={isFull && !isRegistered}
            >
              {isFull && !isRegistered
                ? "Full"
                : isRegistered
                ? "Registered"
                : "Register"}
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(event)}
              className="border-border hover:bg-muted"
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
