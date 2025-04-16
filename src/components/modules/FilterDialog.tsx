import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../ui/dialog';
import { OrganizationFilter } from './OrganizationFilter';
import { Filter } from 'lucide-react';
import { Employee, mockEmployees } from '../../data/mockData';

type FilterDialogProps = {
  onFilterApplied?: (filteredData: Employee[]) => void;
  buttonText?: string;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
};

export function FilterDialog({ 
  onFilterApplied, 
  buttonText = 'Filter', 
  className,
  buttonVariant = 'outline'
}: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedOrgPath, setSelectedOrgPath] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>(mockEmployees);

  const handleOrgFilterChange = (path: string[]) => {
    setSelectedOrgPath(path);
    
    let results = [...mockEmployees];
    
    // Apply organization filter based on the selected path
    if (path.length > 0) {
      if (path.length >= 1) {
        // Filter by company
        results = results.filter(employee => employee.company === path[0]);
        
        if (path.length >= 2) {
          // Filter by business unit
          results = results.filter(employee => employee.businessUnit === path[1]);
          
          if (path.length >= 3) {
            // Filter by department
            results = results.filter(employee => employee.department === path[2]);
            
            if (path.length >= 4) {
              // Filter by division
              results = results.filter(employee => employee.division === path[3]);
            }
          }
        }
      }
    }
    
    setFilteredData(results);
  };
  
  const resetFilters = () => {
    setSelectedOrgPath([]);
    setFilteredData(mockEmployees);
  };

  const applyFilters = () => {
    setOpen(false);
    if (onFilterApplied) {
      onFilterApplied(filteredData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={className}>
          <Filter className="h-4 w-4 mr-2" />
          {buttonText} {selectedOrgPath.length > 0 && 
            <span className="ml-1 bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-xs">!</span>
          }
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Organization Filter</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-2 text-sm text-muted-foreground">
            Select any level in the organization hierarchy to filter results.
          </div>
          
          <OrganizationFilter 
            onFilterChange={handleOrgFilterChange}
            buttonVariant="ghost"
            className="w-full"
          />
          
          {selectedOrgPath.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm border border-primary/20">
              <span className="font-medium text-primary">Currently filtering by: </span>
              {selectedOrgPath.join(' > ')}
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredData.length} employees match this filter
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
          <Button 
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}