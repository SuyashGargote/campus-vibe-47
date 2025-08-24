import { useEffect, useState } from 'react';
import { Plus, MessageSquare, ThumbsUp, ThumbsDown, Search, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDiscussions, addDiscussion, initializeSampleData } from '@/lib/storage';
import { Discussion } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Discussions = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as Discussion['category'],
    tags: '',
  });

  useEffect(() => {
    initializeSampleData();
    const discussionsData = getDiscussions();
    setDiscussions(discussionsData);
    setFilteredDiscussions(discussionsData);
  }, []);

  useEffect(() => {
    let filtered = discussions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(discussion =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(discussion => discussion.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredDiscussions(filtered);
  }, [discussions, searchTerm, categoryFilter, sortBy]);

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDiscussion = addDiscussion({
      ...formData,
      author: 'Current User', // In a real app, this would come from auth
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });

    setDiscussions([newDiscussion, ...discussions]);
    setIsCreateDialogOpen(false);
    setFormData({
      title: '',
      content: '',
      category: 'general',
      tags: '',
    });

    toast({
      title: "Discussion Created!",
      description: "Your discussion has been posted successfully.",
    });
  };

  const categoryColors = {
    academic: 'bg-primary text-primary-foreground',
    general: 'bg-secondary text-secondary-foreground',
    tech: 'bg-accent text-accent-foreground',
    help: 'bg-destructive text-destructive-foreground',
    announcements: 'bg-muted text-muted-foreground',
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-secondary" />
                <span>Campus Discussions</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Ask questions, share knowledge, and connect with your peers
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary-light text-secondary-foreground shadow-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDiscussion} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Discussion Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="What would you like to discuss?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: Discussion['category']) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="help">Help</SelectItem>
                        <SelectItem value="announcements">Announcements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Share your thoughts, ask a question, or start a conversation..."
                      required
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="e.g., study-tips, programming, help-needed"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-secondary hover:bg-secondary-light">
                      Post Discussion
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="animate-slide-up flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
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
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="help">Help</SelectItem>
                <SelectItem value="announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value: 'recent' | 'popular') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Discussions List */}
        <div className="animate-slide-up space-y-4" style={{ animationDelay: '0.1s' }}>
          {filteredDiscussions.length > 0 ? (
            filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-hover transition-all duration-300 border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground hover:text-primary transition-colors cursor-pointer">
                        {discussion.title}
                      </CardTitle>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge className={`${categoryColors[discussion.category]} capitalize`}>
                          {discussion.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by {discussion.author} • {formatTimeAgo(discussion.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {discussion.content}
                  </p>
                  
                  {/* Tags */}
                  {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:text-primary">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{discussion.upvotes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:text-destructive">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{discussion.downvotes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:text-secondary">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.replies.length} replies</span>
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                      View Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No discussions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to start a discussion!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discussions;