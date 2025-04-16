import { useState, useEffect } from 'react';
import { Download, Search, RefreshCw, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { mockEmployees, modules } from '../../data/mockData';
import { OrganizationFilter } from './OrganizationFilter';

export function EmployeeModuleEnablement() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrgPath, setSelectedOrgPath] = useState<string[]>([]);
  
  useEffect(() => {
    let result = employees;
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        employee => 
          employee.name.toLowerCase().includes(lowerCaseQuery) || 
          employee.email.toLowerCase().includes(lowerCaseQuery) ||
          employee.employeeCode.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply organization hierarchy filter based on the path selected
    if (selectedOrgPath.length > 0) {
      if (selectedOrgPath.length >= 1) {
        // Filter by company
        result = result.filter(employee => employee.company === selectedOrgPath[0]);
        
        if (selectedOrgPath.length >= 2) {
          // Filter by business unit
          result = result.filter(employee => employee.businessUnit === selectedOrgPath[1]);
          
          if (selectedOrgPath.length >= 3) {
            // Filter by department
            result = result.filter(employee => employee.department === selectedOrgPath[2]);
            
            if (selectedOrgPath.length >= 4) {
              // Filter by division
              result = result.filter(employee => employee.division === selectedOrgPath[3]);
            }
          }
        }
      }
    }
    
    setFilteredEmployees(result);
  }, [searchQuery, employees, selectedOrgPath]);
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(employee => employee.id));
    }
    setIsAllSelected(!isAllSelected);
  };
  
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };
  
  const handleModuleToggle = (employeeId: string, moduleName: string) => {
    setEmployees(prev => 
      prev.map(employee => {
        if (employee.id === employeeId) {
          const updatedModules = employee.enabledModules.includes(moduleName)
            ? employee.enabledModules.filter(m => m !== moduleName)
            : [...employee.enabledModules, moduleName];
          
          return {
            ...employee,
            enabledModules: updatedModules
          };
        }
        return employee;
      })
    );
  };
  
  const handleBulkModuleToggle = () => {
    setShowConfirmation(false);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmployees(prev => 
        prev.map(employee => {
          if (selectedEmployees.includes(employee.id)) {
            // For each selected employee, add all selected modules
            const updatedModules = [
              ...new Set([
                ...employee.enabledModules.filter(m => !selectedModules.includes(m)),
                ...selectedModules
              ])
            ];
            
            return {
              ...employee,
              enabledModules: updatedModules
            };
          }
          return employee;
        })
      );
      
      // Clear selections after bulk operation
      setSelectedEmployees([]);
      setSelectedModules([]);
      setIsAllSelected(false);
      setIsLoading(false);
    }, 600);
  };
  
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const exportData = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Employee Code', 'Organization Hierarchy', 'Enabled Modules'];
    const rows = filteredEmployees.map(employee => [
      employee.name,
      employee.email,
      employee.employeeCode,
      `${employee.company} > ${employee.businessUnit} > ${employee.department} > ${employee.division}`,
      employee.enabledModules.join(', ')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_modules.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const resetFilters = () => {
    setSelectedOrgPath([]);
    setSearchQuery('');
  };

  // Handle organization filter change
  const handleOrgFilterChange = (path: string[]) => {
    setSelectedOrgPath(path);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="glass-card p-5 mb-6">
        <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary via-secondary to-accent gradient-text">Employee Module Enablement</h2>
        <p className="text-muted-foreground">Manage and configure module access for employees across different organizational units.</p>
      </div>
    
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 shadow-sm h-10"
            />
          </div>
          
          <div className="flex gap-2">
            {/* Replace FilterDialog with OrganizationFilter */}
            <OrganizationFilter 
              onFilterChange={handleOrgFilterChange}
              buttonVariant="secondary"
            />
            
            <Button variant="ghost" size="sm" onClick={refreshData}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Intentionally left empty to match AdminAccessManagement layout */}
        </div>
        <div className="flex items-center gap-3">
          {selectedEmployees.length > 0 && (
            <Button 
              onClick={() => setShowConfirmation(true)}
              variant="default"
            >
              <User className="mr-2 h-4 w-4" /> Bulk Edit ({selectedEmployees.length})
            </Button>
          )}
          <p className="text-sm text-muted-foreground bg-card/40 px-3 py-1 rounded-full border border-border/30 shadow-sm">
            Showing <span className="font-medium text-foreground">{filteredEmployees.length}</span> of <span className="font-medium text-foreground">{employees.length}</span> employees
          </p>
        </div>
      </div>
      
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-md bg-card/80 backdrop-blur-sm relative">
        <div className={`absolute inset-0 z-10 bg-background/60 flex items-center justify-center rounded-xl transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm font-medium">Loading data...</p>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/40">
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all employees"
                />
              </TableHead>
              <TableHead className="min-w-[250px]">Employee</TableHead>
              <TableHead className="min-w-[220px]">Organization</TableHead>
              {modules.map(module => (
                <TableHead key={module} className="text-center">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                    {module}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8 + modules.length} className="text-center py-10 bg-muted/5">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted/20 p-3 mb-2">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No employees found matching your criteria.</p>
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
              filteredEmployees.map((employee) => (
                <TableRow 
                  key={employee.id}
                  className={`group transition-colors hover:bg-muted/10 ${selectedEmployees.includes(employee.id) ? 'bg-primary/5' : ''}`}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => handleSelectEmployee(employee.id)}
                      aria-label={`Select ${employee.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img 
                          src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random`} 
                          alt={employee.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                        <p className="text-xs bg-secondary/20 text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] inline-block mt-1">{employee.employeeCode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm leading-tight">
                      <p className="font-medium">{employee.company}</p>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <span>{employee.businessUnit}</span>
                        <span className="text-xs">›</span>
                        <span>{employee.department}</span>
                        <span className="text-xs">›</span>
                        <span>{employee.division}</span>
                      </div>
                    </div>
                  </TableCell>
                  {modules.map(module => (
                    <TableCell key={`${employee.id}-${module}`} className="text-center">
                      <Switch
                        checked={employee.enabledModules.includes(module)}
                        onCheckedChange={() => handleModuleToggle(employee.id, module)}
                        aria-label={`Toggle ${module} for ${employee.name}`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-primary to-accent gradient-text">Bulk Update Module Access</DialogTitle>
            <DialogDescription>
              Select modules to enable for <span className="font-medium">{selectedEmployees.length}</span> employee(s).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {modules.map(module => (
                <div key={module} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id={`module-${module}`}
                    checked={selectedModules.includes(module)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedModules(prev => [...prev, module]);
                      } else {
                        setSelectedModules(prev => prev.filter(m => m !== module));
                      }
                    }}
                  />
                  <label
                    htmlFor={`module-${module}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {module}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkModuleToggle}
              variant="default"
              disabled={isLoading}
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