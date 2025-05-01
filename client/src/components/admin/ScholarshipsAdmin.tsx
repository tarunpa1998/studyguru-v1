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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Pencil, Trash2, Search, BookOpen, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Scholarship interface based on the MongoDB model
interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  overview: string;
  description: string;
  highlights: string[];
  amount: string;
  deadline: string;
  duration: string;
  level: string;
  fieldsCovered: string[];
  eligibility: string;
  isRenewable: boolean;
  benefits: string[];
  applicationProcedure: string;
  country: string;
  tags: string[];
  link?: string;
}

// Initial empty scholarship for creating new scholarships
const emptyScholarship: Omit<Scholarship, '_id'> = {
  title: "",
  slug: "",
  overview: "",
  description: "",
  highlights: [],
  amount: "",
  deadline: "",
  duration: "",
  level: "",
  fieldsCovered: [],
  eligibility: "",
  isRenewable: false,
  benefits: [],
  applicationProcedure: "",
  country: "",
  tags: [],
  link: ""
};

const ScholarshipsAdmin = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentScholarship, setCurrentScholarship] = useState<Scholarship | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<Scholarship, '_id'>>(emptyScholarship);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  // State for array fields
  const [highlightInput, setHighlightInput] = useState("");
  const [fieldInput, setFieldInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/scholarships');
      if (!response.ok) {
        throw new Error('Failed to fetch scholarships');
      }

      const data = await response.json();
      setScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast({
        title: 'Error fetching scholarships',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyScholarship);
    setCurrentScholarship(null);
    setDialogOpen(true);
    setActiveTab("basic");
    clearArrayInputs();
  };

  const handleEdit = (scholarship: Scholarship) => {
    setIsEditing(true);
    setEditForm(scholarship);
    setCurrentScholarship(scholarship);
    setDialogOpen(true);
    setActiveTab("basic");
    clearArrayInputs();
  };

  const handleDelete = async (scholarshipId: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/scholarships/${scholarshipId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete scholarship');
      }

      // Update the UI by removing the deleted scholarship
      setScholarships(scholarships.filter(scholarship => scholarship._id !== scholarshipId));
      
      toast({
        title: 'Scholarship deleted',
        description: 'The scholarship has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      toast({
        title: 'Error deleting scholarship',
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
      if (!editForm.title || !editForm.description || !editForm.amount) {
        throw new Error('Title, description, and amount are required');
      }

      const url = isEditing
        ? `/api/admin/scholarships/${currentScholarship?._id}`
        : '/api/admin/scholarships';
      
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
        throw new Error(errorData.error || 'Failed to save scholarship');
      }

      const savedScholarship = await response.json();
      
      if (isEditing) {
        // Update existing scholarship in the list
        setScholarships(scholarships.map(scholarship => 
          scholarship._id === savedScholarship._id ? savedScholarship : scholarship
        ));
      } else {
        // Add new scholarship to the list
        setScholarships([...scholarships, savedScholarship]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'Scholarship updated' : 'Scholarship created',
        description: isEditing 
          ? 'The scholarship has been updated successfully' 
          : 'A new scholarship has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving scholarship:', error);
      toast({
        title: 'Error saving scholarship',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm({
      ...editForm,
      [name]: checked
    });
  };

  // Array field handlers
  const addHighlight = () => {
    if (highlightInput.trim()) {
      setEditForm({
        ...editForm,
        highlights: [...editForm.highlights, highlightInput.trim()]
      });
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setEditForm({
      ...editForm,
      highlights: editForm.highlights.filter((_, i) => i !== index)
    });
  };

  const addField = () => {
    if (fieldInput.trim()) {
      setEditForm({
        ...editForm,
        fieldsCovered: [...editForm.fieldsCovered, fieldInput.trim()]
      });
      setFieldInput("");
    }
  };

  const removeField = (index: number) => {
    setEditForm({
      ...editForm,
      fieldsCovered: editForm.fieldsCovered.filter((_, i) => i !== index)
    });
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setEditForm({
        ...editForm,
        benefits: [...editForm.benefits, benefitInput.trim()]
      });
      setBenefitInput("");
    }
  };

  const removeBenefit = (index: number) => {
    setEditForm({
      ...editForm,
      benefits: editForm.benefits.filter((_, i) => i !== index)
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setEditForm({
        ...editForm,
        tags: [...editForm.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter((_, i) => i !== index)
    });
  };

  const clearArrayInputs = () => {
    setHighlightInput("");
    setFieldInput("");
    setBenefitInput("");
    setTagInput("");
  };

  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scholarships</h2>
          <p className="text-slate-500 mt-2">
            Manage all your scholarships
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Scholarship
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search scholarships..."
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
            <BookOpen className="h-4 w-4" />
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
                      <TableHead>Amount</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholarships.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No scholarships found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredScholarships.map((scholarship) => (
                        <TableRow key={scholarship._id}>
                          <TableCell className="font-medium">{scholarship.title}</TableCell>
                          <TableCell>{scholarship.amount}</TableCell>
                          <TableCell>{scholarship.deadline}</TableCell>
                          <TableCell>{scholarship.country}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(scholarship)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(scholarship._id)}
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
              {filteredScholarships.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No scholarships found
                </div>
              ) : (
                filteredScholarships.map((scholarship) => (
                  <Card key={scholarship._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap" title={scholarship.title}>
                        {scholarship.title}
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{scholarship.country}</span>
                        <span>{scholarship.amount}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {scholarship.overview || scholarship.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {scholarship.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {scholarship.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{scholarship.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div className="text-xs text-slate-500">
                        Deadline: {scholarship.deadline}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(scholarship)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(scholarship._id)}
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

      {/* Scholarship Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Scholarship" : "Create New Scholarship"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the scholarship"
                : "Add a new scholarship to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility & Application</TabsTrigger>
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
                    placeholder="Scholarship title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={editForm.overview}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the scholarship"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the scholarship"
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleInputChange}
                      placeholder="e.g. $10,000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      value={editForm.deadline}
                      onChange={handleInputChange}
                      placeholder="e.g. May 15, 2025"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 years"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      placeholder="e.g. United States"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    name="level"
                    value={editForm.level}
                    onChange={handleInputChange}
                    placeholder="e.g. Undergraduate, Graduate, PhD"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Scholarship Link</Label>
                  <Input
                    id="link"
                    name="link"
                    value={editForm.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com/scholarship"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              {/* Highlights Section */}
              <div className="space-y-2 border rounded-md p-4">
                <Label>Highlights</Label>
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="Add a highlight"
                  />
                  <Button 
                    type="button" 
                    onClick={addHighlight}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {editForm.highlights.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {editForm.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                        <span className="flex-1 text-sm">{highlight}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => removeHighlight(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fields Covered Section */}
              <div className="space-y-2 border rounded-md p-4">
                <Label>Fields Covered</Label>
                <div className="flex gap-2">
                  <Input
                    value={fieldInput}
                    onChange={(e) => setFieldInput(e.target.value)}
                    placeholder="Add a field"
                  />
                  <Button 
                    type="button" 
                    onClick={addField}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {editForm.fieldsCovered.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {editForm.fieldsCovered.map((field, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                        <span className="flex-1 text-sm">{field}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits Section */}
              <div className="space-y-2 border rounded-md p-4">
                <Label>Benefits</Label>
                <div className="flex gap-2">
                  <Input
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="Add a benefit"
                  />
                  <Button 
                    type="button" 
                    onClick={addBenefit}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {editForm.benefits.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {editForm.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                        <span className="flex-1 text-sm">{benefit}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => removeBenefit(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-2 border rounded-md p-4">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {editForm.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editForm.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="h-4 w-4 text-slate-500 p-0 ml-1"
                          onClick={() => removeTag(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRenewable"
                  checked={editForm.isRenewable}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('isRenewable', checked as boolean)
                  }
                />
                <Label htmlFor="isRenewable" className="cursor-pointer">
                  This scholarship is renewable
                </Label>
              </div>
            </TabsContent>

            {/* Eligibility & Application Tab */}
            <TabsContent value="eligibility" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  name="eligibility"
                  value={editForm.eligibility}
                  onChange={handleInputChange}
                  placeholder="Eligibility requirements for applicants"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationProcedure">Application Procedure</Label>
                <Textarea
                  id="applicationProcedure"
                  name="applicationProcedure"
                  value={editForm.applicationProcedure}
                  onChange={handleInputChange}
                  placeholder="Steps to apply for this scholarship"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  placeholder="scholarship-url-slug"
                />
                <p className="text-xs text-slate-500">
                  Will be generated automatically if left blank
                </p>
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
                isEditing ? "Update Scholarship" : "Create Scholarship"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScholarshipsAdmin;