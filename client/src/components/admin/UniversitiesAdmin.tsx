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
import { Loader2, Plus, Pencil, Trash2, Search, GraduationCap, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// University interface based on the MongoDB model
interface University {
  _id: string;
  id?: string | number; // Add id as optional to support both ID formats
  name: string;
  description: string;
  overview: string;
  country: string;
  location: string;
  foundedYear: number;
  ranking?: number;
  acceptanceRate?: string;
  studentPopulation?: number;
  internationalStudents?: string;
  academicCalendar?: string;
  programsOffered: string[];
  tuitionFees: string;
  admissionRequirements: string[];
  applicationDeadlines: string;
  scholarshipsAvailable: boolean;
  campusLife: string;
  notableAlumni: string[];
  facilities: string[];
  image?: string;
  logo?: string;
  website?: string;
  slug: string;
  features?: string[];
}

// Initial empty university for creating new universities
const emptyUniversity: Omit<University, '_id'> = {
  name: "",
  description: "",
  overview: "",
  country: "",
  location: "",
  foundedYear: 0,
  ranking: undefined,
  acceptanceRate: "",
  studentPopulation: 0,
  internationalStudents: "",
  academicCalendar: "",
  programsOffered: [],
  tuitionFees: "",
  admissionRequirements: [],
  applicationDeadlines: "",
  scholarshipsAvailable: false,
  campusLife: "",
  notableAlumni: [],
  facilities: [],
  image: "",
  logo: "",
  website: "",
  slug: "",
  features: []
};

const UniversitiesAdmin = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<University, '_id'>>(emptyUniversity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  // State for array fields
  const [programInput, setProgramInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [alumniInput, setAlumniInput] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/universities');
      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }

      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast({
        title: 'Error fetching universities',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyUniversity);
    setCurrentUniversity(null);
    setDialogOpen(true);
    setActiveTab("basic");
    clearArrayInputs();
  };

  const handleEdit = (university: University) => {
    setIsEditing(true);
    setEditForm(university);
    setCurrentUniversity(university);
    setDialogOpen(true);
    setActiveTab("basic");
    clearArrayInputs();
  };

  const handleDelete = async (universityId: string | number) => {
    if (!confirm('Are you sure you want to delete this university?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/universities/${universityId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete university');
      }

      // Update the UI by removing the deleted university
      setUniversities(universities.filter(university => university._id !== universityId));
      
      toast({
        title: 'University deleted',
        description: 'The university has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting university:', error);
      toast({
        title: 'Error deleting university',
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
      if (!editForm.name || !editForm.description || !editForm.country) {
        throw new Error('Name, description, and country are required');
      }

      // Use the appropriate ID field (supporting both formats)
      const universityId = currentUniversity?.id || currentUniversity?._id;
      const url = isEditing
        ? `/api/admin/universities/${universityId}`
        : '/api/admin/universities';
      
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
        throw new Error(errorData.error || 'Failed to save university');
      }

      const savedUniversity = await response.json();
      
      if (isEditing) {
        // Update existing university in the list
        setUniversities(universities.map(university => 
          university._id === savedUniversity._id ? savedUniversity : university
        ));
      } else {
        // Add new university to the list
        setUniversities([...universities, savedUniversity]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'University updated' : 'University created',
        description: isEditing 
          ? 'The university has been updated successfully' 
          : 'A new university has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving university:', error);
      toast({
        title: 'Error saving university',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for number fields
    if (name === 'foundedYear' || name === 'ranking' || name === 'studentPopulation') {
      setEditForm({
        ...editForm,
        [name]: name === 'ranking' && !value ? undefined : parseInt(value) || 0
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

  // Array field handlers
  const addProgram = () => {
    if (programInput.trim()) {
      setEditForm({
        ...editForm,
        programsOffered: [...editForm.programsOffered, programInput.trim()]
      });
      setProgramInput("");
    }
  };

  const removeProgram = (index: number) => {
    setEditForm({
      ...editForm,
      programsOffered: editForm.programsOffered.filter((_, i) => i !== index)
    });
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setEditForm({
        ...editForm,
        admissionRequirements: [...editForm.admissionRequirements, requirementInput.trim()]
      });
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setEditForm({
      ...editForm,
      admissionRequirements: editForm.admissionRequirements.filter((_, i) => i !== index)
    });
  };

  const addAlumni = () => {
    if (alumniInput.trim()) {
      setEditForm({
        ...editForm,
        notableAlumni: [...editForm.notableAlumni, alumniInput.trim()]
      });
      setAlumniInput("");
    }
  };

  const removeAlumni = (index: number) => {
    setEditForm({
      ...editForm,
      notableAlumni: editForm.notableAlumni.filter((_, i) => i !== index)
    });
  };

  const addFacility = () => {
    if (facilityInput.trim()) {
      setEditForm({
        ...editForm,
        facilities: [...editForm.facilities, facilityInput.trim()]
      });
      setFacilityInput("");
    }
  };

  const removeFacility = (index: number) => {
    setEditForm({
      ...editForm,
      facilities: editForm.facilities.filter((_, i) => i !== index)
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setEditForm({
        ...editForm,
        features: [...(editForm.features || []), featureInput.trim()]
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setEditForm({
      ...editForm,
      features: editForm.features?.filter((_, i) => i !== index)
    });
  };

  const clearArrayInputs = () => {
    setProgramInput("");
    setRequirementInput("");
    setAlumniInput("");
    setFacilityInput("");
    setFeatureInput("");
  };

  const filteredUniversities = universities.filter(university => 
    university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Universities</h2>
          <p className="text-slate-500 mt-2">
            Manage all your university information
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search universities..."
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
            <GraduationCap className="h-4 w-4" />
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
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Founded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No universities found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUniversities.map((university) => (
                        <TableRow key={university._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {university.logo ? (
                                <img 
                                  src={university.logo} 
                                  alt={university.name} 
                                  className="h-5 w-auto object-contain"
                                />
                              ) : university.image ? (
                                <img 
                                  src={university.image} 
                                  alt={university.name} 
                                  className="h-5 w-5 object-cover rounded-full"
                                />
                              ) : (
                                <span className="h-5 w-5 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center text-xs font-semibold">
                                  {university.name.charAt(0)}
                                </span>
                              )}
                              {university.name}
                            </div>
                          </TableCell>
                          <TableCell>{university.country}</TableCell>
                          <TableCell>
                            {university.ranking ? (
                              <span>#{university.ranking}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {university.foundedYear > 0 ? university.foundedYear : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(university)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(university.id || university._id)}
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
              {filteredUniversities.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No universities found
                </div>
              ) : (
                filteredUniversities.map((university) => (
                  <Card key={university._id} className="overflow-hidden">
                    <div className="relative h-40">
                      {university.image ? (
                        <img 
                          src={university.image} 
                          alt={university.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                          <GraduationCap className="h-12 w-12 text-primary-300" />
                        </div>
                      )}
                      {university.logo && (
                        <div className="absolute bottom-2 left-2 bg-white h-10 w-auto rounded shadow-sm p-1">
                          <img 
                            src={university.logo} 
                            alt={`${university.name} logo`}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                      )}
                      {university.ranking && (
                        <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-200">
                          Rank #{university.ranking}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{university.name}</CardTitle>
                      <CardDescription>
                        {university.location || university.country}
                        {university.foundedYear > 0 && ` • Est. ${university.foundedYear}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {university.overview || university.description}
                      </p>
                      {university.programsOffered && university.programsOffered.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {university.programsOffered.slice(0, 3).map((program, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                          {university.programsOffered.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{university.programsOffered.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="justify-end">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(university)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(university.id || university._id)}
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

      {/* University Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit University" : "Add New University"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the university information"
                : "Add a new university to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
              <TabsTrigger value="campus">Campus Life</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">University Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Harvard University"
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
                    placeholder="Brief overview of the university"
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
                    placeholder="Detailed description of the university"
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Cambridge, Massachusetts"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      name="foundedYear"
                      type="number"
                      value={editForm.foundedYear || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 1636"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ranking">Global Ranking</Label>
                    <Input
                      id="ranking"
                      name="ranking"
                      type="number"
                      value={editForm.ranking || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentPopulation">Student Population</Label>
                    <Input
                      id="studentPopulation"
                      name="studentPopulation"
                      type="number"
                      value={editForm.studentPopulation || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 20000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">University Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={editForm.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo Image URL</Label>
                    <Input
                      id="logo"
                      name="logo"
                      value={editForm.logo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    name="website"
                    value={editForm.website}
                    onChange={handleInputChange}
                    placeholder="https://www.university.edu"
                  />
                </div>

                {/* Features Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Key Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                    />
                    <Button 
                      type="button" 
                      onClick={addFeature}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.features && editForm.features.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{feature}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeFeature(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Academics Tab */}
            <TabsContent value="academics" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicCalendar">Academic Calendar</Label>
                  <Input
                    id="academicCalendar"
                    name="academicCalendar"
                    value={editForm.academicCalendar}
                    onChange={handleInputChange}
                    placeholder="e.g. Semester-based (Fall and Spring)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internationalStudents">International Students</Label>
                  <Input
                    id="internationalStudents"
                    name="internationalStudents"
                    value={editForm.internationalStudents}
                    onChange={handleInputChange}
                    placeholder="e.g. 25% of student body"
                  />
                </div>

                {/* Programs Offered Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Programs Offered</Label>
                  <div className="flex gap-2">
                    <Input
                      value={programInput}
                      onChange={(e) => setProgramInput(e.target.value)}
                      placeholder="Add a program"
                    />
                    <Button 
                      type="button" 
                      onClick={addProgram}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.programsOffered.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.programsOffered.map((program, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{program}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeProgram(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notable Alumni Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Notable Alumni</Label>
                  <div className="flex gap-2">
                    <Input
                      value={alumniInput}
                      onChange={(e) => setAlumniInput(e.target.value)}
                      placeholder="Add a notable alumnus"
                    />
                    <Button 
                      type="button" 
                      onClick={addAlumni}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.notableAlumni.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.notableAlumni.map((alumnus, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{alumnus}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeAlumni(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Admissions Tab */}
            <TabsContent value="admissions" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acceptanceRate">Acceptance Rate</Label>
                  <Input
                    id="acceptanceRate"
                    name="acceptanceRate"
                    value={editForm.acceptanceRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 4.6%"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tuitionFees">Tuition Fees</Label>
                  <Input
                    id="tuitionFees"
                    name="tuitionFees"
                    value={editForm.tuitionFees}
                    onChange={handleInputChange}
                    placeholder="e.g. $50,000 per year"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationDeadlines">Application Deadlines</Label>
                  <Input
                    id="applicationDeadlines"
                    name="applicationDeadlines"
                    value={editForm.applicationDeadlines}
                    onChange={handleInputChange}
                    placeholder="e.g. January 1 for Regular Decision"
                  />
                </div>

                {/* Admission Requirements Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Admission Requirements</Label>
                  <div className="flex gap-2">
                    <Input
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      placeholder="Add a requirement"
                    />
                    <Button 
                      type="button" 
                      onClick={addRequirement}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.admissionRequirements.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.admissionRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{requirement}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeRequirement(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarshipsAvailable"
                    checked={editForm.scholarshipsAvailable}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('scholarshipsAvailable', checked as boolean)
                    }
                  />
                  <Label htmlFor="scholarshipsAvailable" className="cursor-pointer">
                    Scholarships available
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Campus Life Tab */}
            <TabsContent value="campus" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campusLife">Campus Life</Label>
                  <Textarea
                    id="campusLife"
                    name="campusLife"
                    value={editForm.campusLife}
                    onChange={handleInputChange}
                    placeholder="Description of campus life at the university"
                    rows={4}
                  />
                </div>

                {/* Facilities Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Facilities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={facilityInput}
                      onChange={(e) => setFacilityInput(e.target.value)}
                      placeholder="Add a facility"
                    />
                    <Button 
                      type="button" 
                      onClick={addFacility}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.facilities.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{facility}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeFacility(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={editForm.slug}
                    onChange={handleInputChange}
                    placeholder="university-url-slug"
                  />
                  <p className="text-xs text-slate-500">
                    Will be generated automatically if left blank
                  </p>
                </div>
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
                isEditing ? "Update University" : "Create University"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniversitiesAdmin;