import { useState, useEffect } from 'react';
import { Download, Edit, Search, RefreshCw, User, Plus, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { mockAdmins, accessTypes, AdminAccessType, mockEmployees } from '../../data/mockData';
import { OrganizationFilter } from './OrganizationFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Define types for access rules
type AccessRule = {
  id: string;
  organizationPath: string[];
  accessTypes: AdminAccessType[];
  applyToAllUsers: boolean;
};

// Updated Admin type with access rules
type AdminWithRules = {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  avatarUrl: string;
  company: string;
  businessUnit: string;
  department: string;
  division: string;
  accessTypes: AdminAccessType[];
  accessRules?: AccessRule[];
};

export function AdminAccessManagement() {
  // Convert existing admins to have the new structure
  const convertedAdmins: AdminWithRules[] = mockAdmins.map(admin => ({
    ...admin,
    accessRules: [{
      id: `default-${admin.id}`,
      organizationPath: [admin.company],
      accessTypes: admin.accessTypes,
      applyToAllUsers: true
    }]
  }));

  const [admins, setAdmins] = useState<AdminWithRules[]>(convertedAdmins);
  const [filteredAdmins, setFilteredAdmins] = useState<AdminWithRules[]>(convertedAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminWithRules | null>(null);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [multiSelectAccessTypes, setMultiSelectAccessTypes] = useState<AdminAccessType[]>([]);
  const [selectedOrgPath, setSelectedOrgPath] = useState<string[]>([]);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  
  // Add state for bulk edit rules
  const [bulkAccessRules, setBulkAccessRules] = useState<AccessRule[]>([{
    id: 'bulk-default',
    organizationPath: [],
    accessTypes: [],
    applyToAllUsers: true
  }]);
  
  // Current logged-in user ID (mock)
  const currentUserId = "1";
  
  useEffect(() => {
    let result = admins;
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        admin => 
          admin.name.toLowerCase().includes(lowerCaseQuery) || 
          admin.email.toLowerCase().includes(lowerCaseQuery) ||
          admin.employeeCode.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply organization hierarchy filter based on the path selected
    if (selectedOrgPath.length > 0) {
      result = result.filter(admin => {
        const hasMatchingRule = admin.accessRules?.some(rule => 
          rule.organizationPath.every((path, index) => 
            selectedOrgPath[index] === undefined || selectedOrgPath[index] === path
          )
        );
        return hasMatchingRule;
      });
    }
    
    setFilteredAdmins(result);
  }, [searchQuery, admins, selectedOrgPath]);
  
  const handleEditAdmin = (admin: AdminWithRules) => {
    setCurrentAdmin(admin);
    setAccessRules(admin.accessRules || [{
      id: `default-${admin.id}`,
      organizationPath: [admin.company],
      accessTypes: admin.accessTypes,
      applyToAllUsers: true
    }]);
    setShowEditDialog(true);
  };
  
  const handleSaveChanges = () => {
    if (!currentAdmin) return;
    
    setAdmins(prev => 
      prev.map(admin => {
        if (admin.id === currentAdmin.id) {
          return {
            ...admin,
            accessRules: accessRules,
            // Set main accessTypes as the union of all rule access types
            accessTypes: Array.from(new Set(
              accessRules.flatMap(rule => rule.accessTypes)
            ))
          };
        }
        return admin;
      })
    );
    
    setShowEditDialog(false);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(
        filteredAdmins
          .filter(admin => admin.id !== currentUserId)
          .map(admin => admin.id)
      );
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleOpenBulkEditDialog = () => {
    setBulkAccessRules([{
      id: 'bulk-default',
      organizationPath: [],
      accessTypes: [],
      applyToAllUsers: true
    }]);
    setShowBulkEditDialog(true);
  };

  const handleApplyBulkEdit = () => {
    if (selectedAdmins.length === 0) return;
    setIsLoading(true);
    
    setTimeout(() => {
      setAdmins(prev => 
        prev.map(admin => {
          if (selectedAdmins.includes(admin.id)) {
            return {
              ...admin,
              accessRules: bulkAccessRules,
              // Set main accessTypes as the union of all rule access types
              accessTypes: Array.from(new Set(
                bulkAccessRules.flatMap(rule => rule.accessTypes)
              ))
            };
          }
          return admin;
        })
      );
      
      setSelectedAdmins([]);
      setBulkAccessRules([{
        id: 'bulk-default',
        organizationPath: [],
        accessTypes: [],
        applyToAllUsers: true
      }]);
      setIsAllSelected(false);
      setIsLoading(false);
      setShowBulkEditDialog(false);
    }, 600);
  };

  // Handle organization filter change
  const handleOrgFilterChange = (path: string[]) => {
    setSelectedOrgPath(path);
  };
  
  const resetFilters = () => {
    setSelectedOrgPath([]);
    setSearchQuery('');
  };

  const exportData = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Employee Code', 'Organization', 'Access Rules'];
    const rows = filteredAdmins.map(admin => {
      const rulesText = admin.accessRules ? 
        admin.accessRules.map(rule => 
          `${rule.organizationPath.join(' > ')}: ${rule.accessTypes.join(', ')}`
        ).join(' | ') : 
        admin.accessTypes.join(', ');
      
      return [
        admin.name,
        admin.email,
        admin.employeeCode,
        `${admin.company} > ${admin.businessUnit} > ${admin.department} > ${admin.division}`,
        rulesText
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'admin_access.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to add a new access rule
  const addNewRule = () => {
    const newRule: AccessRule = {
      id: `rule-${Date.now()}`,
      organizationPath: [],
      accessTypes: [],
      applyToAllUsers: true
    };
    setAccessRules(prev => [...prev, newRule]);
  };

  // Function to update a rule
  const updateRule = (ruleId: string, updates: Partial<AccessRule>) => {
    setAccessRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  // Function to remove a rule
  const removeRule = (ruleId: string) => {
    setAccessRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  // Function to add a new bulk rule
  const addNewBulkRule = () => {
    const newRule: AccessRule = {
      id: `bulk-rule-${Date.now()}`,
      organizationPath: [],
      accessTypes: [],
      applyToAllUsers: true
    };
    setBulkAccessRules(prev => [...prev, newRule]);
  };

  // Function to update a bulk rule
  const updateBulkRule = (ruleId: string, updates: Partial<AccessRule>) => {
    setBulkAccessRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  // Function to remove a bulk rule
  const removeBulkRule = (ruleId: string) => {
    setBulkAccessRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="p-5 mb-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Admin Access Management</h2>
        <p className="text-muted-foreground">Manage and configure admin permissions across different organizational units.</p>
      </div>
    
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 h-10"
            />
          </div>
          
          <div className="flex gap-2">
            <OrganizationFilter 
              onFilterChange={handleOrgFilterChange}
              buttonVariant="ghost"
            />
            
            <Button variant="ghost" size="sm" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
        </div>
        <div className="flex items-center gap-3">
          {selectedAdmins.length > 0 && (
            <Button 
              onClick={handleOpenBulkEditDialog}
              variant="default"
            >
              <Edit className="mr-2 h-4 w-4" /> Bulk Edit ({selectedAdmins.length})
            </Button>
          )}
          <p className="text-sm text-muted-foreground bg-card/40 px-3 py-1 rounded-full border border-border/30">
            Showing <span className="font-medium text-foreground">{filteredAdmins.length}</span> of <span className="font-medium text-foreground">{admins.length}</span> admins
          </p>
        </div>
      </div>
      
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/80 backdrop-blur-sm relative">
        <div className={`absolute inset-0 z-10 bg-background/60 flex items-center justify-center rounded-xl transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm font-medium">Updating access...</p>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/40">
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all admins"
                />
              </TableHead>
              <TableHead className="min-w-[250px]">Admin</TableHead>
              <TableHead className="min-w-[220px]">Organization</TableHead>
              <TableHead>Access Types</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 bg-muted/5">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted/20 p-3 mb-2">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No admins found matching your criteria.</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={resetFilters}
                      className="mt-2"
                    >
                      Reset filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map(admin => {
                const isCurrentUser = admin.id === currentUserId;
                return (
                  <TableRow 
                    key={admin.id} 
                    className={`group transition-colors hover:bg-muted/10 ${isCurrentUser ? "bg-muted/30" : ""} ${selectedAdmins.includes(admin.id) ? 'bg-primary/5' : ''}`}
                  >
                    <TableCell>
                      {!isCurrentUser && (
                        <Checkbox 
                          checked={selectedAdmins.includes(admin.id)}
                          onCheckedChange={() => {
                            if (selectedAdmins.includes(admin.id)) {
                              setSelectedAdmins(prev => prev.filter(id => id !== admin.id));
                            } else {
                              setSelectedAdmins(prev => [...prev, admin.id]);
                            }
                          }}
                          aria-label={`Select ${admin.name}`}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img 
                            src={admin.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=random`} 
                            alt={admin.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=random`;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{admin.name}</p>
                          <p className="text-xs text-muted-foreground">{admin.email}</p>
                          <p className="text-xs bg-secondary/20 text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] inline-block mt-1">{admin.employeeCode}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm leading-tight">
                        <p className="font-medium">{admin.company}</p>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <span>{admin.businessUnit}</span>
                          <span className="text-xs">›</span>
                          <span>{admin.department}</span>
                          <span className="text-xs">›</span>
                          <span>{admin.division}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {admin.accessTypes.map(type => (
                          <span 
                            key={`${admin.id}-${type}`} 
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {type}
                          </span>
                        ))}
                        
                        {admin.accessRules && admin.accessRules.length > 1 && (
                          <span 
                            className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary ring-1 ring-inset ring-secondary/10"
                            title={`Has specific access levels in ${admin.accessRules.length} organizations`}
                          >
                            +{admin.accessRules.length - 1} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleEditAdmin(admin)}
                        disabled={isCurrentUser}
                        className={isCurrentUser ? "cursor-not-allowed" : ""}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Admin Access</DialogTitle>
            <DialogDescription>
              {currentAdmin && `Modify access permissions for ${currentAdmin.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {currentAdmin && (
              <div className="text-sm mb-4">
                <div className="font-medium text-lg mb-1">{currentAdmin.name}</div>
                <p className="text-muted-foreground">{currentAdmin.email}</p>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{currentAdmin.company}</span>
                  <span className="mx-1">›</span>
                  <span>{currentAdmin.businessUnit}</span>
                  <span className="mx-1">›</span>
                  <span>{currentAdmin.department}</span>
                  <span className="mx-1">›</span>
                  <span>{currentAdmin.division}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Access Rules</h3>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={addNewRule}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Rule
                </Button>
              </div>

              <div className="space-y-6">
                {accessRules.map((rule, index) => (
                  <div 
                    key={rule.id}
                    className="p-6 border border-border/50 rounded-md bg-muted/5 relative hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-sm font-medium">Rule {index + 1}</h4>
                      {accessRules.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRule(rule.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="text-sm font-medium mb-3">1. Access Scope</h5>
                        <Select 
                          value={rule.applyToAllUsers ? "all" : "specific"}
                          onValueChange={(value: string) => {
                            updateRule(rule.id, {
                              applyToAllUsers: value === "all",
                              organizationPath: []
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select scope" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-950">
                            <SelectItem value="all">All users in the system</SelectItem>
                            <SelectItem value="specific">Specific organization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!rule.applyToAllUsers && (
                        <div>
                          <h5 className="text-sm font-medium mb-3">2. Select Organization</h5>
                          <OrganizationFilter
                            onFilterChange={(paths) => updateRule(rule.id, { organizationPath: paths })}
                            buttonVariant="outline"
                            className="w-full"
                          />
                        </div>
                      )}

                      <div>
                        <h5 className="text-sm font-medium mb-3">
                          {rule.applyToAllUsers ? "2" : "3"}. Access Types
                        </h5>
                        <div className="grid grid-cols-2 gap-2 bg-card/30 p-4 rounded-md border border-border/30">
                          {accessTypes.map(type => (
                            <div key={`${rule.id}-${type}`} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/20 transition-colors">
                              <Checkbox
                                id={`${rule.id}-${type}`}
                                checked={rule.accessTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  const updatedTypes = checked
                                    ? [...rule.accessTypes, type]
                                    : rule.accessTypes.filter(t => t !== type);
                                  updateRule(rule.id, { accessTypes: updatedTypes });
                                }}
                              />
                              <label
                                htmlFor={`${rule.id}-${type}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} variant="default">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkEditDialog} onOpenChange={setShowBulkEditDialog}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Bulk Update Admin Access</DialogTitle>
            <DialogDescription>
              Update access permissions for {selectedAdmins.length} selected admin(s)
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Access Rules</h3>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={addNewBulkRule}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Rule
                </Button>
              </div>

              <div className="space-y-6">
                {bulkAccessRules.map((rule, index) => (
                  <div 
                    key={rule.id}
                    className="p-6 border border-border/50 rounded-md bg-muted/5 relative hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-sm font-medium">Rule {index + 1}</h4>
                      {bulkAccessRules.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBulkRule(rule.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="text-sm font-medium mb-3">1. Access Scope</h5>
                        <Select 
                          value={rule.applyToAllUsers ? "all" : "specific"}
                          onValueChange={(value: string) => {
                            updateBulkRule(rule.id, {
                              applyToAllUsers: value === "all",
                              organizationPath: []
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select scope" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-950">
                            <SelectItem value="all">All users in the system</SelectItem>
                            <SelectItem value="specific">Specific organization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!rule.applyToAllUsers && (
                        <div>
                          <h5 className="text-sm font-medium mb-3">2. Select Organization</h5>
                          <OrganizationFilter
                            onFilterChange={(paths) => updateBulkRule(rule.id, { organizationPath: paths })}
                            buttonVariant="outline"
                            className="w-full"
                          />
                        </div>
                      )}

                      <div>
                        <h5 className="text-sm font-medium mb-3">
                          {rule.applyToAllUsers ? "2" : "3"}. Access Types
                        </h5>
                        <div className="grid grid-cols-2 gap-2 bg-card/30 p-4 rounded-md border border-border/30">
                          {accessTypes.map(type => (
                            <div key={`${rule.id}-${type}`} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/20 transition-colors">
                              <Checkbox
                                id={`${rule.id}-${type}`}
                                checked={rule.accessTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  const updatedTypes = checked
                                    ? [...rule.accessTypes, type]
                                    : rule.accessTypes.filter(t => t !== type);
                                  updateBulkRule(rule.id, { accessTypes: updatedTypes });
                                }}
                              />
                              <label
                                htmlFor={`${rule.id}-${type}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowBulkEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApplyBulkEdit}
              variant="default"
              disabled={bulkAccessRules.some(rule => rule.accessTypes.length === 0)}
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}