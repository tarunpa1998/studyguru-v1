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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { Edit, Trash, Plus } from 'lucide-react';

// Interface for University
interface University {
  id: string;
  name: string;
  description: string;
  country: string;
  ranking?: number;
  image?: string;
  slug: string;
  features?: string[];
}

export default function AdminUniversities() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  // Fetch universities
  const { data: universities, isLoading, error } = useQuery({
    queryKey: ['/api/universities'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Delete university mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      return apiRequest(`/api/universities/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
      toast({
        title: 'University deleted',
        description: 'The university has been successfully deleted',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete university',
      });
    },
  });

  // Confirm delete
  const handleDelete = (university: University) => {
    setSelectedUniversity(university);
    setIsDeleteDialogOpen(true);
  };

  // Delete the university
  const confirmDelete = () => {
    if (selectedUniversity) {
      deleteMutation.mutate(selectedUniversity.id);
    }
  };

  // Edit university
  const handleEdit = (university: University) => {
    navigate(`/admin/universities/edit/${university.id}`);
  };

  // Create new university
  const handleCreate = () => {
    navigate('/admin/universities/create');
  };

  if (error) {
    return (
      <AdminLayout title="Universities">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading universities</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{(error as Error).message || 'An error occurred while fetching universities'}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Universities">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Universities</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add University
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading universities...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Ranking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities && universities.length > 0 ? (
                universities.map((university: University) => (
                  <TableRow key={university.id}>
                    <TableCell className="font-medium">{university.name}</TableCell>
                    <TableCell>{university.country}</TableCell>
                    <TableCell>{university.ranking || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(university)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(university)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No universities found. Add your first university.
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
              Are you sure you want to delete the university "{selectedUniversity?.name}"? This action cannot be undone.
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