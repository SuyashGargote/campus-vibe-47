import { useEffect, useState } from 'react';
import { Plus, Users, Search, Filter, Mail, Phone, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getClubs, addClub, initializeSampleData } from '@/lib/storage';
import { Club } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'technical' as Club['category'],
    email: '',
    phone: '',
    social: '',
    activities: '',
  });

  useEffect(() => {
    initializeSampleData();
    const clubsData = getClubs();
    setClubs(clubsData);
    setFilteredClubs(clubsData);
  }, []);

  useEffect(() => {
    let filtered = clubs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(club => club.category === categoryFilter);
    }

    // Sort by member count (most popular first)
    filtered.sort((a, b) => b.members - a.members);

    setFilteredClubs(filtered);
  }, [clubs, searchTerm, categoryFilter]);

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClub = addClub({
      ...formData,
      contact: {
        email: formData.email,
        phone: formData.phone || undefined,
        social: formData.social || undefined,
      },
      members: 1, // Creator is the first member
      activities: formData.activities.split(',').map(activity => activity.trim()).filter(Boolean),
      upcomingEvents: [],
    });

    setClubs([newClub, ...clubs]);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      category: 'technical',
      email: '',
      phone: '',
      social: '',
      activities: '',
    });

    toast({
      title: "Club Created!",
      description: "Your club has been successfully created.",
    });
  };

  const handleJoinClub = (clubId: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Joined Club!",
      description: "You have successfully joined the club.",
    });
  };

  const categoryColors = {
    technical: 'bg-primary text-primary-foreground',
    cultural: 'bg-accent text-accent-foreground',
    sports: 'bg-secondary text-secondary-foreground',
    academic: 'bg-muted text-muted-foreground',
    social: 'bg-destructive text-destructive-foreground',
    other: 'bg-border text-foreground',
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center space-x-3">
                <Users className="w-8 h-8 text-accent" />
                <span>Student Clubs</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Discover and join communities that match your interests
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent-light text-accent-foreground shadow-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Club
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Club</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateClub} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Club Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: Club['category']) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={3}
                      placeholder="Describe your club's mission and activities..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="activities">Activities (comma-separated)</Label>
                    <Textarea
                      id="activities"
                      value={formData.activities}
                      onChange={(e) => setFormData({...formData, activities: e.target.value})}
                      required
                      rows={2}
                      placeholder="e.g., Weekly meetings, Workshops, Competitions"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Contact Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm">Phone (optional)</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="social" className="text-sm">Social Media (optional)</Label>
                      <Input
                        id="social"
                        value={formData.social}
                        onChange={(e) => setFormData({...formData, social: e.target.value})}
                        placeholder="@club_handle or website URL"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-accent hover:bg-accent-light">
                      Create Club
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <Card key={club.id} className="hover:shadow-hover transition-all duration-300 border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl text-foreground">{club.name}</CardTitle>
                      <Badge className={`${categoryColors[club.category]} capitalize`}>
                        {club.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {club.description}
                    </p>

                    {/* Member Count */}
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {club.members} members
                      </span>
                    </div>

                    {/* Activities */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Activities:</h4>
                      <div className="space-y-1">
                        {club.activities.slice(0, 3).map((activity, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {activity}
                          </div>
                        ))}
                        {club.activities.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{club.activities.length - 3} more activities
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t border-border pt-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{club.contact.email}</span>
                        </div>
                        {club.contact.phone && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{club.contact.phone}</span>
                          </div>
                        )}
                        {club.contact.social && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <ExternalLink className="w-3 h-3" />
                            <span>{club.contact.social}</span>
                          </div>
                        )}
                      </div>

                      {/* Upcoming Events */}
                      {club.upcomingEvents.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-3 h-3 text-secondary" />
                            <span className="text-xs font-medium text-foreground">Upcoming Events:</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {club.upcomingEvents.slice(0, 2).join(', ')}
                            {club.upcomingEvents.length > 2 && ' +more'}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleJoinClub(club.id)}
                        className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
                      >
                        Join Club
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No clubs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to create a club!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clubs;