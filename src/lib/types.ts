export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'workshop' | 'seminar' | 'fest' | 'competition' | 'social';
  organizer: string;
  tags: string[];
  attendees: number;
  maxAttendees: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'academic' | 'general' | 'tech' | 'help' | 'announcements';
  tags: string[];
  upvotes: number;
  downvotes: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  parentId?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'cultural' | 'sports' | 'academic' | 'social' | 'other';
  contact: {
    email: string;
    phone?: string;
    social?: string;
  };
  members: number;
  imageUrl?: string;
  activities: string[];
  upcomingEvents: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  joinedAt: string;
}