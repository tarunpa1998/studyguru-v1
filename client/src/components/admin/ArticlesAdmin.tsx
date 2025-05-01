import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Search, FileText, LayoutGrid } from "lucide-react";

// Article interface based on the MongoDB model
interface Article {
  id: string;
  _id?: string;  // Support both formats
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
  isFeatured: boolean;
  relatedArticles: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  views: number;
  readingTime: string;
  helpful: {
    yes: number;
    no: number;
  };
  tableOfContents: {
    id: string;
    title: string;
    level: number;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Initial empty article for creating new articles
const emptyArticle: Omit<Article, 'id' | '_id'> = {
  title: "",
  content: "",
  summary: "",
  slug: "",
  publishDate: new Date().toISOString(),
  author: "",
  authorTitle: "",
  authorImage: "",
  image: "",
  category: "",
  isFeatured: false,
  relatedArticles: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  },
  views: 0,
  readingTime: "",
  helpful: {
    yes: 0,
    no: 0
  },
  tableOfContents: [],
  faqs: []
};

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<Article, 'id' | '_id'>>(emptyArticle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error fetching articles',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyArticle);
    setCurrentArticle(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = (article: Article) => {
    setIsEditing(true);
    setEditForm(article);
    setCurrentArticle(article);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Update the UI by removing the deleted article
      setArticles(articles.filter(article => 
        (article._id !== articleId && article.id !== articleId)
      ));
      
      toast({
        title: 'Article deleted',
        description: 'The article has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error deleting article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Make sure we have required fields
      if (!editForm.title || !editForm.content || !editForm.summary) {
        throw new Error('Title, content, and summary are required');
      }

      // Use the appropriate ID field (supporting both formats)
      const articleId = currentArticle?.id || currentArticle?._id;
      const url = isEditing
        ? `/api/admin/articles/${articleId}`
        : '/api/admin/articles';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save article');
      }

      const savedArticle = await response.json();
      
      if (isEditing) {
        // Update existing article in the list
        setArticles(articles.map(article => {
          // Handle both ID formats by comparing with both
          const matchesId = article.id === savedArticle.id || article._id === savedArticle._id;
          return matchesId ? savedArticle : article;
        }));
      } else {
        // Add new article to the list
        setArticles([...articles, savedArticle]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'Article updated' : 'Article created',
        description: isEditing 
          ? 'The article has been updated successfully' 
          : 'A new article has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error saving article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditForm({
        ...editForm,
        [parent]: {
          ...editForm[parent as keyof typeof editForm],
          [child]: value
        }
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm({
      ...editForm,
      [name]: checked
    });
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
          <p className="text-slate-500 mt-2">
            Manage all your articles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                          No articles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArticles.map((article) => (
                        <TableRow key={article.id || article._id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>{article.author}</TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>
                            {new Date(article.publishDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {article.isFeatured ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                No
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(article)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(article.id || article._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No articles found
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <Card key={article._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap" title={article.title}>
                        {article.title}
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{article.author}</span>
                        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {article.summary}
                      </p>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {article.isFeatured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(article.id || article._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Article Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Article" : "Create New Article"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the article"
                : "Add a new article to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    placeholder="Article title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={editForm.summary}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the article"
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={editForm.author}
                      onChange={handleInputChange}
                      placeholder="Author name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorTitle">Author Title</Label>
                    <Input
                      id="authorTitle"
                      name="authorTitle"
                      value={editForm.authorTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Editor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={editForm.category}
                      onChange={handleInputChange}
                      placeholder="Article category"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="date"
                      value={editForm.publishDate.split('T')[0]}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={editForm.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={editForm.isFeatured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('isFeatured', checked as boolean)
                    }
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Feature this article
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={editForm.content}
                  onChange={handleInputChange}
                  placeholder="Article content"
                  required
                  rows={15}
                />
                <p className="text-xs text-slate-500">
                  Supports Markdown formatting
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readingTime">Reading Time</Label>
                <Input
                  id="readingTime"
                  name="readingTime"
                  value={editForm.readingTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 5 min read"
                />
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo.metaTitle">Meta Title</Label>
                <Input
                  id="seo.metaTitle"
                  name="seo.metaTitle"
                  value={editForm.seo.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO meta title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaDescription">Meta Description</Label>
                <Textarea
                  id="seo.metaDescription"
                  name="seo.metaDescription"
                  value={editForm.seo.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  placeholder="article-url-slug"
                />
                <p className="text-xs text-slate-500">
                  Will be generated automatically if left blank
                </p>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label>Related Articles</Label>
                <p className="text-xs text-slate-500 mb-2">
                  This feature requires additional implementation
                </p>
                <Input
                  disabled
                  placeholder="Feature not implemented yet"
                />
              </div>

              <div className="space-y-2">
                <Label>FAQs</Label>
                <p className="text-xs text-slate-500 mb-2">
                  This feature requires additional implementation
                </p>
                <Input
                  disabled
                  placeholder="Feature not implemented yet"
                />
              </div>

              <div className="space-y-2">
                <Label>Table of Contents</Label>
                <p className="text-xs text-slate-500 mb-2">
                  This feature requires additional implementation
                </p>
                <Input
                  disabled
                  placeholder="Feature not implemented yet"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Article" : "Create Article"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticlesAdmin;