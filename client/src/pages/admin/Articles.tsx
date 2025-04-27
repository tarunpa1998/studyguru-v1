import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import AdminLayout from '@/components/admin/Layout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { Edit, Trash, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Interface for Article
interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
}

export default function AdminArticles() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Fetch articles
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      return apiRequest(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: 'Article deleted',
        description: 'The article has been successfully deleted',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete article',
      });
    },
  });

  // Confirm delete
  const handleDelete = (article: Article) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  // Delete the article
  const confirmDelete = () => {
    if (selectedArticle) {
      deleteMutation.mutate(selectedArticle.id);
    }
  };

  // Edit article
  const handleEdit = (article: Article) => {
    navigate(`/admin/articles/edit/${article.id}`);
  };

  // Create new article
  const handleCreate = () => {
    navigate('/admin/articles/create');
  };

  if (error) {
    return (
      <AdminLayout title="Articles">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading articles</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{(error as Error).message || 'An error occurred while fetching articles'}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Articles">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Articles</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Article
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading articles...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles && articles.length > 0 ? (
                articles.map((article: Article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{formatDate(article.publishDate)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(article)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No articles found. Create your first article.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the article "{selectedArticle?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}