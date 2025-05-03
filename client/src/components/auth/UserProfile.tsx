import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Save, X, UserCircle, FileText, GraduationCap, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [isLoading, setIsLoading] = useState(false);

  // Define comment type
  interface UserComment {
    id: string;
    articleSlug: string;
    articleTitle: string;
    content: string;
    createdAt: string;
  }

  // Query to fetch user's comments
  const { data: userComments = [] as UserComment[], isLoading: commentsLoading } = useQuery<UserComment[]>({
    queryKey: ['/api/user/comments'],
    enabled: !!user, // Only run if user is authenticated
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({ fullName, profileImage });
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(user?.fullName || '');
    setProfileImage(user?.profileImage || '');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <UserCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Not Logged In</h3>
            <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">My Profile</CardTitle>
        <CardDescription>
          Manage your account information and view saved content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="saved-content">Saved Content</TabsTrigger>
            <TabsTrigger value="comments">My Comments</TabsTrigger>
          </TabsList>
          
          {/* Profile Info Tab */}
          <TabsContent value="profile">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={user.profileImage} alt={user.fullName || 'User'} />
                  <AvatarFallback className="text-xl bg-primary-100 text-primary-800">
                    {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  // Edit Mode
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Profile Image URL</label>
                      <Input 
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="https://example.com/your-image.jpg" 
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a URL to an image. For best results, use a square image.
                      </p>
                    </div>
                    
                    <div className="pt-4 flex space-x-2">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg font-medium">{user.fullName}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                      <div>
                        <Badge variant="outline" className="bg-primary-50 text-primary-700">
                          Active Member
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Saved Content Tab */}
          <TabsContent value="saved-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-500" />
                    Saved Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.savedArticles && user.savedArticles.length > 0 ? (
                    <ul className="space-y-2">
                      {user.savedArticles.map((article: string) => (
                        <li key={article} className="p-2 hover:bg-slate-50 rounded-md">
                          <Link href={`/articles/${article}`}>
                            <a className="text-primary-600 hover:underline">{article}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>No saved articles yet</p>
                      <Link href="/articles">
                        <Button variant="link" className="mt-2">Browse Articles</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-primary-500" />
                    Saved Scholarships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.savedScholarships && user.savedScholarships.length > 0 ? (
                    <ul className="space-y-2">
                      {user.savedScholarships.map((scholarship: string) => (
                        <li key={scholarship} className="p-2 hover:bg-slate-50 rounded-md">
                          <Link href={`/scholarships/${scholarship}`}>
                            <a className="text-primary-600 hover:underline">{scholarship}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>No saved scholarships yet</p>
                      <Link href="/scholarships">
                        <Button variant="link" className="mt-2">Browse Scholarships</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Comments Tab */}
          <TabsContent value="comments">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary-500" />
                  My Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {commentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  </div>
                ) : userComments.length > 0 ? (
                  <ul className="space-y-4">
                    {userComments.map((comment) => (
                      <li key={comment.id} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between mb-1">
                          <Link href={`/articles/${comment.articleSlug}`}>
                            <span className="text-sm font-medium text-primary-600 hover:underline">
                              {comment.articleTitle}
                            </span>
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>You haven't made any comments yet</p>
                    <Link href="/articles">
                      <Button variant="link" className="mt-2">Browse Articles</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Member since {new Date().toLocaleDateString()}
        </p>
        <Link href="/">
          <Button variant="ghost">
            Back to Home
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;