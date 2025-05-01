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
import { Loader2, Plus, Pencil, Trash2, Search, Globe, LayoutGrid } from "lucide-react";

// Country interface based on the MongoDB model
interface Country {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  overview: string;
  description: string;
  highlights: string[];
  universities: number;
  acceptanceRate: string;
  language: string;
  currency: string;
  averageTuition: string;
  averageLivingCost: string;
  visaRequirement: string;
  popularCities: string[];
  topUniversities: string[];
  educationSystem: string;
  image?: string;
  flag?: string;
}

// Initial empty country for creating new countries
const emptyCountry: Omit<Country, '_id' | 'id'> = {
  name: "",
  slug: "",
  overview: "",
  description: "",
  highlights: [],
  universities: 0,
  acceptanceRate: "",
  language: "",
  currency: "",
  averageTuition: "",
  averageLivingCost: "",
  visaRequirement: "",
  popularCities: [],
  topUniversities: [],
  educationSystem: "",
  image: "",
  flag: ""
};

const CountriesAdmin = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<Country, '_id' | 'id'>>(emptyCountry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  // State for array fields
  const [highlightInput, setHighlightInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [universityInput, setUniversityInput] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/countries');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: 'Error fetching countries',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyCountry);
    setCurrentCountry(null);
    setDialogOpen(true);
    setActiveTab("basic");
    clearArrayInputs();
  };

  const handleEdit = (country: Country) => {
    setIsEditing(true);
    setEditForm(country);
    setCurrentCountry(country);
    setDialogOpen(true);
    setActiveTab("basic");
    clearArrayInputs();
  };

  const handleDelete = async (country: Country) => {
    if (!confirm('Are you sure you want to delete this country?')) {
      return;
    }

    // Get the appropriate ID regardless of format
    const countryId = country.id || country._id;
    
    if (!countryId) {
      toast({
        title: 'Error deleting country',
        description: 'Country ID not found',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/countries/${countryId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete country');
      }

      // Update the UI by removing the deleted country
      setCountries(countries.filter(c => 
        (c._id !== countryId) && (c.id !== countryId)
      ));
      
      toast({
        title: 'Country deleted',
        description: 'The country has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: 'Error deleting country',
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
      if (!editForm.name || !editForm.description) {
        throw new Error('Name and description are required');
      }

      const url = isEditing
        ? `/api/admin/countries/${currentCountry?.id || currentCountry?._id}`
        : '/api/admin/countries';
      
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
        throw new Error(errorData.error || 'Failed to save country');
      }

      const savedCountry = await response.json();
      
      if (isEditing) {
        // Update existing country in the list
        setCountries(countries.map(country => {
          // Handle both ID formats by comparing with both
          const matchesId = 
            (country._id === savedCountry._id) || 
            (country.id === savedCountry.id) ||
            (country._id === savedCountry.id) ||
            (country.id === savedCountry._id);
          return matchesId ? savedCountry : country;
        }));
      } else {
        // Add new country to the list
        setCountries([...countries, savedCountry]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'Country updated' : 'Country created',
        description: isEditing 
          ? 'The country has been updated successfully' 
          : 'A new country has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: 'Error saving country',
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
    if (name === 'universities') {
      setEditForm({
        ...editForm,
        [name]: parseInt(value) || 0
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
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

  const addCity = () => {
    if (cityInput.trim()) {
      setEditForm({
        ...editForm,
        popularCities: [...editForm.popularCities, cityInput.trim()]
      });
      setCityInput("");
    }
  };

  const removeCity = (index: number) => {
    setEditForm({
      ...editForm,
      popularCities: editForm.popularCities.filter((_, i) => i !== index)
    });
  };

  const addUniversity = () => {
    if (universityInput.trim()) {
      setEditForm({
        ...editForm,
        topUniversities: [...editForm.topUniversities, universityInput.trim()]
      });
      setUniversityInput("");
    }
  };

  const removeUniversity = (index: number) => {
    setEditForm({
      ...editForm,
      topUniversities: editForm.topUniversities.filter((_, i) => i !== index)
    });
  };

  const clearArrayInputs = () => {
    setHighlightInput("");
    setCityInput("");
    setUniversityInput("");
  };

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Countries</h2>
          <p className="text-slate-500 mt-2">
            Manage all your country information
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search countries..."
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
            <Globe className="h-4 w-4" />
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
                      <TableHead>Universities</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCountries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No countries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCountries.map((country) => (
                        <TableRow key={country.id || country._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {country.flag && (
                                <img 
                                  src={country.flag} 
                                  alt={country.name} 
                                  className="h-5 w-auto object-contain"
                                />
                              )}
                              {country.name}
                            </div>
                          </TableCell>
                          <TableCell>{country.universities}</TableCell>
                          <TableCell>{country.language}</TableCell>
                          <TableCell>{country.currency}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(country)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(country)}
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
              {filteredCountries.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <Card key={country.id || country._id} className="overflow-hidden">
                    <div className="relative h-40">
                      {country.image ? (
                        <img 
                          src={country.image} 
                          alt={country.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                          <Globe className="h-12 w-12 text-primary-300" />
                        </div>
                      )}
                      {country.flag && (
                        <div className="absolute top-2 right-2 h-8 w-12 border border-white rounded shadow-sm overflow-hidden">
                          <img 
                            src={country.flag} 
                            alt={`${country.name} flag`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{country.name}</CardTitle>
                      <CardDescription>
                        {country.language} • {country.currency}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {country.overview || country.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="font-medium">Universities:</span>
                        <span>{country.universities}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(country)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(country)}
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

      {/* Country Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Country" : "Add New Country"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the country information"
                : "Add a new country to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="education">Education System</TabsTrigger>
              <TabsTrigger value="living">Living & Costs</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Country Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. United States"
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
                    placeholder="Brief overview of the country"
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
                    placeholder="Detailed description of the country"
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      name="language"
                      value={editForm.language}
                      onChange={handleInputChange}
                      placeholder="e.g. English"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      name="currency"
                      value={editForm.currency}
                      onChange={handleInputChange}
                      placeholder="e.g. USD"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Country Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={editForm.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flag">Flag Image URL</Label>
                    <Input
                      id="flag"
                      name="flag"
                      value={editForm.flag}
                      onChange={handleInputChange}
                      placeholder="https://example.com/flag.jpg"
                    />
                  </div>
                </div>

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
              </div>
            </TabsContent>

            {/* Education System Tab */}
            <TabsContent value="education" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="universities">Number of Universities</Label>
                  <Input
                    id="universities"
                    name="universities"
                    type="number"
                    value={editForm.universities}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acceptanceRate">Acceptance Rate</Label>
                  <Input
                    id="acceptanceRate"
                    name="acceptanceRate"
                    value={editForm.acceptanceRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 70% average"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationSystem">Education System</Label>
                  <Textarea
                    id="educationSystem"
                    name="educationSystem"
                    value={editForm.educationSystem}
                    onChange={handleInputChange}
                    placeholder="Description of the education system"
                    rows={4}
                  />
                </div>

                {/* Top Universities Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Top Universities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={universityInput}
                      onChange={(e) => setUniversityInput(e.target.value)}
                      placeholder="Add a university"
                    />
                    <Button 
                      type="button" 
                      onClick={addUniversity}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.topUniversities.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.topUniversities.map((university, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{university}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeUniversity(index)}
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

            {/* Living & Costs Tab */}
            <TabsContent value="living" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="averageTuition">Average Tuition</Label>
                  <Input
                    id="averageTuition"
                    name="averageTuition"
                    value={editForm.averageTuition}
                    onChange={handleInputChange}
                    placeholder="e.g. $20,000 - $50,000 per year"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageLivingCost">Average Living Cost</Label>
                  <Input
                    id="averageLivingCost"
                    name="averageLivingCost"
                    value={editForm.averageLivingCost}
                    onChange={handleInputChange}
                    placeholder="e.g. $10,000 - $20,000 per year"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaRequirement">Visa Requirements</Label>
                  <Textarea
                    id="visaRequirement"
                    name="visaRequirement"
                    value={editForm.visaRequirement}
                    onChange={handleInputChange}
                    placeholder="Information about visa requirements"
                    rows={4}
                  />
                </div>

                {/* Popular Cities Section */}
                <div className="space-y-2 border rounded-md p-4">
                  <Label>Popular Cities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Add a city"
                    />
                    <Button 
                      type="button" 
                      onClick={addCity}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {editForm.popularCities.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {editForm.popularCities.map((city, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                          <span className="flex-1 text-sm">{city}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeCity(index)}
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
                    placeholder="country-url-slug"
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
                isEditing ? "Update Country" : "Create Country"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountriesAdmin;