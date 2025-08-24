import { Event, Discussion, Club, User, Reply } from './types';

// Storage keys
const STORAGE_KEYS = {
  EVENTS: 'campus_connect_events',
  DISCUSSIONS: 'campus_connect_discussions',
  CLUBS: 'campus_connect_clubs',
  USER: 'campus_connect_user',
  USER_INTERACTIONS: 'campus_connect_user_interactions',
} as const;

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Events
export function getEvents(): Event[] {
  return getFromStorage(STORAGE_KEYS.EVENTS, []);
}

export function saveEvents(events: Event[]): void {
  saveToStorage(STORAGE_KEYS.EVENTS, events);
}

export function addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
  const events = getEvents();
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
  saveEvents(events);
  return events[index];
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length === events.length) return false;
  
  saveEvents(filtered);
  return true;
}

// Discussions
export function getDiscussions(): Discussion[] {
  return getFromStorage(STORAGE_KEYS.DISCUSSIONS, []);
}

export function saveDiscussions(discussions: Discussion[]): void {
  saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
}

export function addDiscussion(discussion: Omit<Discussion, 'id' | 'upvotes' | 'downvotes' | 'replies' | 'createdAt' | 'updatedAt'>): Discussion {
  const discussions = getDiscussions();
  const newDiscussion: Discussion = {
    ...discussion,
    id: crypto.randomUUID(),
    upvotes: 0,
    downvotes: 0,
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  discussions.push(newDiscussion);
  saveDiscussions(discussions);
  return newDiscussion;
}

export function deleteDiscussion(id: string): boolean {
  const discussions = getDiscussions();
  const filtered = discussions.filter(d => d.id !== id);
  if (filtered.length === discussions.length) return false;
  
  saveDiscussions(filtered);
  return true;
}

// Clubs
export function getClubs(): Club[] {
  return getFromStorage(STORAGE_KEYS.CLUBS, []);
}

export function saveClubs(clubs: Club[]): void {
  saveToStorage(STORAGE_KEYS.CLUBS, clubs);
}

export function addClub(club: Omit<Club, 'id' | 'createdAt'>): Club {
  const clubs = getClubs();
  const newClub: Club = {
    ...club,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  clubs.push(newClub);
  saveClubs(clubs);
  return newClub;
}

// Initialize with sample data
export function initializeSampleData(): void {
  const events = getEvents();
  const discussions = getDiscussions();
  const clubs = getClubs();

  if (events.length === 0) {
    const sampleEvents: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Tech Symposium 2024',
        description: 'Annual technology symposium featuring latest trends in AI, Web3, and Cloud Computing',
        date: '2024-09-15',
        time: '09:00',
        location: 'Main Auditorium',
        category: 'seminar',
        organizer: 'Computer Science Department',
        tags: ['AI', 'Technology', 'Innovation'],
        attendees: 45,
        maxAttendees: 200,
      },
      {
        title: 'Cultural Fest Opening',
        description: 'Grand opening ceremony for the annual cultural festival with performances and competitions',
        date: '2024-09-20',
        time: '18:00',
        location: 'Campus Grounds',
        category: 'fest',
        organizer: 'Cultural Committee',
        tags: ['Culture', 'Music', 'Dance'],
        attendees: 120,
        maxAttendees: 500,
      }
    ];
    
    sampleEvents.forEach(addEvent);
  }

  if (discussions.length === 0) {
    const sampleDiscussions: Omit<Discussion, 'id' | 'upvotes' | 'downvotes' | 'replies' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Best study spots on campus?',
        content: 'Looking for quiet places to study during finals. Any recommendations?',
        author: 'Sarah Chen',
        category: 'general',
        tags: ['study', 'campus', 'finals'],
      },
      {
        title: 'React vs Vue for final project',
        content: 'Need to choose a frontend framework for my final year project. What are your experiences?',
        author: 'Alex Kumar',
        category: 'tech',
        tags: ['React', 'Vue', 'frontend', 'project'],
      }
    ];
    
    sampleDiscussions.forEach(addDiscussion);
  }

  if (clubs.length === 0) {
    const sampleClubs: Omit<Club, 'id' | 'createdAt'>[] = [
      {
        name: 'Coding Club',
        description: 'A community for programming enthusiasts to learn, share, and build amazing projects together.',
        category: 'technical',
        contact: { email: 'codingclub@campus.edu', social: '@campus_coding' },
        members: 156,
        activities: ['Weekly coding sessions', 'Hackathons', 'Tech talks', 'Open source contributions'],
        upcomingEvents: ['Hackathon 2024', 'JavaScript Workshop'],
      },
      {
        name: 'Photography Society',
        description: 'Capture the beauty of campus life and beyond. Learn photography techniques and share your work.',
        category: 'cultural',
        contact: { email: 'photography@campus.edu', phone: '+1-555-0123' },
        members: 89,
        activities: ['Photo walks', 'Workshops', 'Exhibitions', 'Photo competitions'],
        upcomingEvents: ['Campus Photo Walk', 'Portrait Workshop'],
      }
    ];
    
    sampleClubs.forEach(addClub);
  }
}

// User interactions tracking
interface UserInteractions {
  [discussionId: string]: {
    upvoted: boolean;
    downvoted: boolean;
  };
}

function getUserInteractions(): UserInteractions {
  return getFromStorage(STORAGE_KEYS.USER_INTERACTIONS, {});
}

function saveUserInteractions(interactions: UserInteractions): void {
  saveToStorage(STORAGE_KEYS.USER_INTERACTIONS, interactions);
}

// Discussion voting functions
export function upvoteDiscussion(discussionId: string): boolean {
  const discussions = getDiscussions();
  const interactions = getUserInteractions();
  const discussionIndex = discussions.findIndex(d => d.id === discussionId);
  
  if (discussionIndex === -1) return false;
  
  const discussion = discussions[discussionIndex];
  const userInteraction = interactions[discussionId] || { upvoted: false, downvoted: false };
  
  // If user already upvoted, remove the upvote
  if (userInteraction.upvoted) {
    discussion.upvotes--;
    userInteraction.upvoted = false;
  } else {
    // If user downvoted before, remove downvote and add upvote
    if (userInteraction.downvoted) {
      discussion.downvotes--;
      userInteraction.downvoted = false;
    }
    discussion.upvotes++;
    userInteraction.upvoted = true;
  }
  
  discussion.updatedAt = new Date().toISOString();
  discussions[discussionIndex] = discussion;
  
  interactions[discussionId] = userInteraction;
  
  saveDiscussions(discussions);
  saveUserInteractions(interactions);
  return true;
}

export function downvoteDiscussion(discussionId: string): boolean {
  const discussions = getDiscussions();
  const interactions = getUserInteractions();
  const discussionIndex = discussions.findIndex(d => d.id === discussionId);
  
  if (discussionIndex === -1) return false;
  
  const discussion = discussions[discussionIndex];
  const userInteraction = interactions[discussionId] || { upvoted: false, downvoted: false };
  
  // If user already downvoted, remove the downvote
  if (userInteraction.downvoted) {
    discussion.downvotes--;
    userInteraction.downvoted = false;
  } else {
    // If user upvoted before, remove upvote and add downvote
    if (userInteraction.upvoted) {
      discussion.upvotes--;
      userInteraction.upvoted = false;
    }
    discussion.downvotes++;
    userInteraction.downvoted = true;
  }
  
  discussion.updatedAt = new Date().toISOString();
  discussions[discussionIndex] = discussion;
  
  interactions[discussionId] = userInteraction;
  
  saveDiscussions(discussions);
  saveUserInteractions(interactions);
  return true;
}

export function addReplyToDiscussion(discussionId: string, reply: Omit<Reply, 'id' | 'createdAt'>): Reply | null {
  const discussions = getDiscussions();
  const discussionIndex = discussions.findIndex(d => d.id === discussionId);
  
  if (discussionIndex === -1) return null;
  
  const newReply: Reply = {
    ...reply,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  discussions[discussionIndex].replies.push(newReply);
  discussions[discussionIndex].updatedAt = new Date().toISOString();
  
  saveDiscussions(discussions);
  return newReply;
}

export function deleteReplyFromDiscussion(discussionId: string, replyId: string): boolean {
  const discussions = getDiscussions();
  const discussionIndex = discussions.findIndex(d => d.id === discussionId);
  
  if (discussionIndex === -1) return false;
  
  const discussion = discussions[discussionIndex];
  const replyIndex = discussion.replies.findIndex(r => r.id === replyId);
  
  if (replyIndex === -1) return false;
  
  discussion.replies.splice(replyIndex, 1);
  discussion.updatedAt = new Date().toISOString();
  
  discussions[discussionIndex] = discussion;
  saveDiscussions(discussions);
  return true;
}

export function getUserInteractionStatus(discussionId: string): { upvoted: boolean; downvoted: boolean } {
  const interactions = getUserInteractions();
  return interactions[discussionId] || { upvoted: false, downvoted: false };
}