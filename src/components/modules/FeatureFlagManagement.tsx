import { useState, useEffect } from 'react';
import { Search, InfoIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { mockFeatureFlags } from '../../data/mockData';
import { OrganizationFilter } from './OrganizationFilter';

export function FeatureFlagManagement() {
  const [featureFlags, setFeatureFlags] = useState(mockFeatureFlags);
  const [filteredFlags, setFilteredFlags] = useState(mockFeatureFlags);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentFlag, setCurrentFlag] = useState<typeof mockFeatureFlags[0] | null>(null);
  const [selectedOrgPath, setSelectedOrgPath] = useState<string[]>([]);
  
  useEffect(() => {
    let result = featureFlags;
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        flag => 
          flag.name.toLowerCase().includes(lowerCaseQuery) || 
          flag.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply organization filter
    if (selectedOrgPath.length > 0) {
      // Filter by company (first level of path)
      result = result.filter(flag => flag.companies.includes(selectedOrgPath[0]));
    }
    
    setFilteredFlags(result);
  }, [searchQuery, featureFlags, selectedOrgPath]);
  
  const handleToggleFeatureFlag = (flag: typeof mockFeatureFlags[0]) => {
    if (flag.level === 'organization') {
      // Show confirmation for organization-level flags
      setCurrentFlag(flag);
      setShowConfirmation(true);
    } else {
      // Directly toggle company-level flags
      setFeatureFlags(prev => 
        prev.map(f => {
          if (f.id === flag.id) {
            return {
              ...f,
              enabled: !f.enabled
            };
          }
          return f;
        })
      );
    }
  };
  
  const handleConfirmToggle = () => {
    if (!currentFlag) return;
    
    setFeatureFlags(prev => 
      prev.map(flag => {
        if (flag.id === currentFlag.id) {
          return {
            ...flag,
            enabled: !flag.enabled
          };
        }
        return flag;
      })
    );
    
    setShowConfirmation(false);
    setCurrentFlag(null);
  };
  
  // Handle organization filter change
  const handleOrgFilterChange = (path: string[]) => {
    setSelectedOrgPath(path);
  };
  
  const resetFilters = () => {
    setSelectedOrgPath([]);
    setSearchQuery('');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="glass-card p-5 mb-6">
        <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary via-secondary to-accent gradient-text">Feature Flag Management</h2>
        <p className="text-muted-foreground">Control feature availability across your organization and individual companies.</p>
      </div>
    
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feature flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 shadow-sm h-10"
            />
          </div>
          
          <div className="flex gap-2">
            {/* Replace Filter button with OrganizationFilter component */}
            <OrganizationFilter 
              onFilterChange={handleOrgFilterChange}
              buttonVariant="secondary"
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-md bg-card/80 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/40">
              <TableHead className="min-w-[250px]">Feature Flag</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Applied To</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFlags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 bg-muted/5">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted/20 p-3 mb-2">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No feature flags found matching your criteria.</p>
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
              filteredFlags.map(flag => (
                <TableRow key={flag.id} className="hover:bg-muted/10">
                  <TableCell>
                    <div className="font-medium">{flag.name}</div>
                    {flag.level === 'organization' && (
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <InfoIcon className="h-3 w-3 mr-1 text-amber-500" />
                        <span>Organization-level flag affects all companies</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{flag.description}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        flag.level === 'organization' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}
                    >
                      {flag.level === 'organization' ? 'Organization' : 'Company'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {flag.companies.map(company => (
                        <span 
                          key={`${flag.id}-${company}`} 
                          className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggleFeatureFlag(flag)}
                        aria-label={`Toggle ${flag.name}`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-primary to-accent gradient-text">Confirm Feature Flag Change</DialogTitle>
            <DialogDescription>
              {currentFlag && (
                <span>
                  You are about to {currentFlag.enabled ? 'disable' : 'enable'} the <strong>{currentFlag.name}</strong> feature flag.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {currentFlag && (
            <div className="py-4">
              <p className="mb-2">This is an organization-level flag and will affect all companies:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {currentFlag.companies.map(company => (
                  <li key={company}>{company}</li>
                ))}
              </ul>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmToggle}
              variant="default"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}