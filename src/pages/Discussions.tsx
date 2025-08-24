import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDiscussions,
  addDiscussion,
  deleteDiscussion,
  initializeSampleData,
  upvoteDiscussion,
  downvoteDiscussion,
  addReplyToDiscussion,
  deleteReplyFromDiscussion,
  getUserInteractionStatus,
} from "@/lib/storage";
import { Discussion, Reply } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Discussions = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discussionToDelete, setDiscussionToDelete] = useState<string | null>(
    null
  );
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [commentText, setCommentText] = useState("");
  const [viewDiscussionOpen, setViewDiscussionOpen] = useState(false);
  const [userInteractions, setUserInteractions] = useState<{
    [key: string]: { upvoted: boolean; downvoted: boolean };
  }>({});
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general" as Discussion["category"],
    tags: "",
  });

  useEffect(() => {
    initializeSampleData();
    const discussionsData = getDiscussions();
    setDiscussions(discussionsData);
    setFilteredDiscussions(discussionsData);

    // Load user interactions for all discussions
    const interactions: {
      [key: string]: { upvoted: boolean; downvoted: boolean };
    } = {};
    discussionsData.forEach((discussion) => {
      interactions[discussion.id] = getUserInteractionStatus(discussion.id);
    });
    setUserInteractions(interactions);
  }, []);

  useEffect(() => {
    let filtered = discussions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (discussion) =>
          discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discussion.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (discussion) => discussion.category === categoryFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "popular") {
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredDiscussions(filtered);
  }, [discussions, searchTerm, categoryFilter, sortBy]);

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();

    const newDiscussion = addDiscussion({
      ...formData,
      author: "Current User", // In a real app, this would come from auth
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setDiscussions([newDiscussion, ...discussions]);
    setIsCreateDialogOpen(false);
    setFormData({
      title: "",
      content: "",
      category: "general",
      tags: "",
    });

    toast({
      title: "Discussion Created!",
      description: "Your discussion has been posted successfully.",
    });
  };

  const handleDeleteDiscussion = (id: string) => {
    setDiscussionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!discussionToDelete) return;

    const success = deleteDiscussion(discussionToDelete);
    if (success) {
      setDiscussions(discussions.filter((d) => d.id !== discussionToDelete));
      toast({
        title: "Discussion Deleted!",
        description: "The discussion has been removed successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the discussion. Please try again.",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setDiscussionToDelete(null);
  };

  const handleUpvote = (discussionId: string) => {
    const success = upvoteDiscussion(discussionId);
    if (success) {
      // Update local state
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === discussionId) {
          const interaction = userInteractions[discussionId] || {
            upvoted: false,
            downvoted: false,
          };
          if (interaction.upvoted) {
            return { ...discussion, upvotes: discussion.upvotes - 1 };
          } else {
            let newUpvotes = discussion.upvotes + 1;
            if (interaction.downvoted) {
              newUpvotes = discussion.upvotes + 1;
              return {
                ...discussion,
                upvotes: newUpvotes,
                downvotes: discussion.downvotes - 1,
              };
            }
            return { ...discussion, upvotes: newUpvotes };
          }
        }
        return discussion;
      });

      setDiscussions(updatedDiscussions);

      // Update user interactions
      const currentInteraction = userInteractions[discussionId] || {
        upvoted: false,
        downvoted: false,
      };
      const newInteraction = {
        upvoted: !currentInteraction.upvoted,
        downvoted:
          currentInteraction.downvoted && !currentInteraction.upvoted
            ? false
            : currentInteraction.downvoted,
      };

      setUserInteractions({
        ...userInteractions,
        [discussionId]: newInteraction,
      });

      toast({
        title: newInteraction.upvoted ? "Upvoted!" : "Upvote removed",
        description: newInteraction.upvoted
          ? "Your upvote has been recorded."
          : "Your upvote has been removed.",
      });
    }
  };

  const handleDownvote = (discussionId: string) => {
    const success = downvoteDiscussion(discussionId);
    if (success) {
      // Update local state
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === discussionId) {
          const interaction = userInteractions[discussionId] || {
            upvoted: false,
            downvoted: false,
          };
          if (interaction.downvoted) {
            return { ...discussion, downvotes: discussion.downvotes - 1 };
          } else {
            let newDownvotes = discussion.downvotes + 1;
            if (interaction.upvoted) {
              newDownvotes = discussion.downvotes + 1;
              return {
                ...discussion,
                downvotes: newDownvotes,
                upvotes: discussion.upvotes - 1,
              };
            }
            return { ...discussion, downvotes: newDownvotes };
          }
        }
        return discussion;
      });

      setDiscussions(updatedDiscussions);

      // Update user interactions
      const currentInteraction = userInteractions[discussionId] || {
        upvoted: false,
        downvoted: false,
      };
      const newInteraction = {
        downvoted: !currentInteraction.downvoted,
        upvoted:
          currentInteraction.upvoted && !currentInteraction.downvoted
            ? false
            : currentInteraction.upvoted,
      };

      setUserInteractions({
        ...userInteractions,
        [discussionId]: newInteraction,
      });

      toast({
        title: newInteraction.downvoted ? "Downvoted!" : "Downvote removed",
        description: newInteraction.downvoted
          ? "Your downvote has been recorded."
          : "Your downvote has been removed.",
      });
    }
  };

  const handleViewDiscussion = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setViewDiscussionOpen(true);
  };

  const handleComment = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setCommentDialogOpen(true);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscussion || !commentText.trim()) return;

    const newReply = addReplyToDiscussion(selectedDiscussion.id, {
      content: commentText.trim(),
      author: "Current User", // In a real app, this would come from auth
      upvotes: 0,
      downvotes: 0,
    });

    if (newReply) {
      // Update local state
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === selectedDiscussion.id) {
          return {
            ...discussion,
            replies: [...discussion.replies, newReply],
          };
        }
        return discussion;
      });

      setDiscussions(updatedDiscussions);

      // Update the selected discussion for the view dialog
      const updatedSelectedDiscussion = updatedDiscussions.find(
        (d) => d.id === selectedDiscussion.id
      );
      if (updatedSelectedDiscussion) {
        setSelectedDiscussion(updatedSelectedDiscussion);
      }

      setCommentText("");
      setCommentDialogOpen(false);

      toast({
        title: "Comment Posted!",
        description: "Your comment has been added to the discussion.",
      });
    }
  };

  const handleDeleteReply = (discussionId: string, replyId: string) => {
    const success = deleteReplyFromDiscussion(discussionId, replyId);
    if (success) {
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === discussionId) {
          return {
            ...discussion,
            replies: discussion.replies.filter((reply) => reply.id !== replyId),
          };
        }
        return discussion;
      });
      setDiscussions(updatedDiscussions);
      toast({
        title: "Comment Deleted!",
        description: "The comment has been removed successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categoryColors = {
    academic: "bg-primary text-primary-foreground",
    general: "bg-secondary text-secondary-foreground",
    tech: "bg-accent text-accent-foreground",
    help: "bg-destructive text-destructive-foreground",
    announcements: "bg-muted text-muted-foreground",
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

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

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
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
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="What would you like to discuss?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: Discussion["category"]) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="help">Help</SelectItem>
                        <SelectItem value="announcements">
                          Announcements
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
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
                    <Button
                      type="submit"
                      className="bg-secondary hover:bg-secondary-light"
                    >
                      Post Discussion
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Are you sure you want to delete this discussion? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
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
            <Select
              value={sortBy}
              onValueChange={(value: "recent" | "popular") => setSortBy(value)}
            >
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
        <div
          className="animate-slide-up space-y-4"
          style={{ animationDelay: "0.1s" }}
        >
          {filteredDiscussions.length > 0 ? (
            filteredDiscussions.map((discussion) => {
              const userInteraction = userInteractions[discussion.id] || {
                upvoted: false,
                downvoted: false,
              };

              return (
                <Card
                  key={discussion.id}
                  className="hover:shadow-hover transition-all duration-300 border-border"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-foreground hover:text-primary transition-colors cursor-pointer">
                          {discussion.title}
                        </CardTitle>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge
                            className={`${
                              categoryColors[discussion.category]
                            } capitalize`}
                          >
                            {discussion.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            by {discussion.author} •{" "}
                            {formatTimeAgo(discussion.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDiscussion(discussion.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete discussion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(discussion.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            userInteraction.upvoted
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{discussion.upvotes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownvote(discussion.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            userInteraction.downvoted
                              ? "text-destructive bg-destructive/10"
                              : "text-muted-foreground hover:text-destructive"
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{discussion.downvotes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComment(discussion)}
                          className="flex items-center space-x-1 text-muted-foreground hover:text-secondary"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{discussion.replies.length} replies</span>
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDiscussion(discussion)}
                        className="border-border hover:bg-muted"
                      >
                        View Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No discussions found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to start a discussion!"}
              </p>
            </div>
          )}
        </div>

        {/* View Discussion Dialog */}
        <Dialog open={viewDiscussionOpen} onOpenChange={setViewDiscussionOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Discussion</DialogTitle>
            </DialogHeader>
            {selectedDiscussion && (
              <div className="space-y-6">
                {/* Discussion Header */}
                <div className="border-b border-border pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {selectedDiscussion.title}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={`${
                            categoryColors[selectedDiscussion.category]
                          } capitalize`}
                        >
                          {selectedDiscussion.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by {selectedDiscussion.author} •{" "}
                          {formatTimeAgo(selectedDiscussion.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvote(selectedDiscussion.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          userInteractions[selectedDiscussion.id]?.upvoted
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{selectedDiscussion.upvotes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownvote(selectedDiscussion.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          userInteractions[selectedDiscussion.id]?.downvoted
                            ? "text-destructive bg-destructive/10"
                            : "text-muted-foreground hover:text-destructive"
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{selectedDiscussion.downvotes}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Discussion Content */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed">
                      {selectedDiscussion.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedDiscussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedDiscussion.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Comments ({selectedDiscussion.replies.length})
                    </h3>
                    <Button
                      onClick={() => {
                        setViewDiscussionOpen(false);
                        setCommentDialogOpen(true);
                      }}
                      size="sm"
                      className="bg-secondary hover:bg-secondary-light text-secondary-foreground"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>

                  {selectedDiscussion.replies.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDiscussion.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-muted/50 rounded-lg p-4 border border-border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-foreground">
                                {reply.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(reply.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span className="text-xs ml-1">
                                  {reply.upvotes}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span className="text-xs ml-1">
                                  {reply.downvotes}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteReply(
                                    selectedDiscussion.id,
                                    reply.id
                                  )
                                }
                                className="text-muted-foreground hover:text-destructive"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-border rounded-lg">
                      <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No comments yet. Be the first to comment!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Comment Dialog */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add a Comment</DialogTitle>
            </DialogHeader>
            {selectedDiscussion && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    {selectedDiscussion.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDiscussion.content}
                  </p>
                </div>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Your Comment</Label>
                    <Textarea
                      id="comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts on this discussion..."
                      required
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCommentDialogOpen(false);
                        setSelectedDiscussion(null);
                        setCommentText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!commentText.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Discussions;
