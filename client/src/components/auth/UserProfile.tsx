import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../lib/authApi';

// Form validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  profileImage: z.string().url().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      profileImage: user?.profileImage || '',
    },
  });

  // Fetch user's saved articles
  const { data: userComments, isLoading: commentsLoading } = useQuery({
    queryKey: ['userComments'],
    queryFn: () => authApi.getUserComments(),
    enabled: !!user,
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateProfile(data);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="comments">My Comments</TabsTrigger>
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profileImage} alt={user.fullName} />
                  <AvatarFallback>
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">{user.fullName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    {...register('fullName')} 
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input 
                    id="profileImage" 
                    placeholder="https://example.com/image.jpg" 
                    {...register('profileImage')} 
                  />
                  {errors.profileImage && (
                    <p className="text-sm text-red-500">{errors.profileImage.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={logout}>
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>My Comments</CardTitle>
              <CardDescription>Comments you've made on articles</CardDescription>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : userComments && userComments.length > 0 ? (
                <div className="space-y-4">
                  {userComments.map((comment: any) => (
                    <div key={comment.commentId} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">On article: {comment.articleTitle}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4">You haven't made any comments yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Items</CardTitle>
              <CardDescription>Articles and scholarships you've saved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Saved Articles</h3>
                  {user.savedArticles && user.savedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Article cards would go here */}
                      <p>This feature will be implemented in future iterations.</p>
                    </div>
                  ) : (
                    <p className="text-center py-2">You haven't saved any articles yet.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Saved Scholarships</h3>
                  {user.savedScholarships && user.savedScholarships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Scholarship cards would go here */}
                      <p>This feature will be implemented in future iterations.</p>
                    </div>
                  ) : (
                    <p className="text-center py-2">You haven't saved any scholarships yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;