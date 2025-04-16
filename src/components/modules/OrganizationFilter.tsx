import { useState } from 'react';
import { Button } from '../ui/button';
import { TreeSelectCheckbox } from '../ui/tree-select-checkbox';
import { Filter } from 'lucide-react';
import { organizationHierarchy } from '../../data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

type OrganizationFilterProps = {
  onFilterChange: (path: string[]) => void;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
};

export function OrganizationFilter({ 
  onFilterChange, 
  className,
  buttonVariant = 'secondary'
}: OrganizationFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrgPaths, setSelectedOrgPaths] = useState<string[][]>([]);
  
  const handleOrgFilterSelect = (selectedNodes: string[][]) => {
    setSelectedOrgPaths(selectedNodes);
  };
  
  const resetFilters = () => {
    setSelectedOrgPaths([]);
    onFilterChange([]);
  };

  const applyFilters = () => {
    // Use the first path if available, otherwise empty array
    const path = selectedOrgPaths[0] || [];
    onFilterChange(path);
    setShowFilters(false);
  };

  return (
    <div className={className}>
      <Button 
        variant={buttonVariant} 
        size="sm" 
        onClick={() => setShowFilters(true)}
        className="flex items-center gap-1"
      >
        <Filter className="h-4 w-4" /> 
        Organization Filter {selectedOrgPaths.length > 0 && 
          <span className="bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-xs">!</span>
        }
      </Button>
      
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Organization Filter</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-2 text-sm text-muted-foreground">
              Select organizations in the hierarchy to filter results. When you select a parent organization, all its children will be automatically selected.
            </div>
            
            <TreeSelectCheckbox 
              data={organizationHierarchy} 
              onSelect={handleOrgFilterSelect} 
              className="border-border/50 bg-card/30 shadow-sm"
            />
            
            {selectedOrgPaths.length > 0 && (
              <div className="mt-3 p-2 bg-primary/5 rounded-md text-sm border border-primary/20">
                <span className="font-medium text-primary">Selected organizations: </span>
                <ul className="mt-1 space-y-1">
                  {selectedOrgPaths.map((path, index) => (
                    <li key={index} className="ml-2">• {path.join(' > ')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button 
              onClick={applyFilters}
              size="sm"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}