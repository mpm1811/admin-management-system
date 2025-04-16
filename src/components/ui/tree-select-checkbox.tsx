import { useState, useCallback, useEffect } from 'react';
import { cn } from "../../lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "./checkbox";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface TreeSelectCheckboxProps {
  data: TreeNode[];
  onSelect: (selectedPaths: string[][]) => void;
  className?: string;
  maxHeight?: string;
}

export function TreeSelectCheckbox({ 
  data, 
  onSelect, 
  className,
  maxHeight = "350px"
}: TreeSelectCheckboxProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const handleToggleExpand = (nodeId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Helper function to get all descendant node IDs
  const getDescendantIds = (node: TreeNode): string[] => {
    const descendants: string[] = [node.id];
    if (node.children) {
      node.children.forEach(child => {
        descendants.push(...getDescendantIds(child));
      });
    }
    return descendants;
  };

  // Helper function to get all ancestor node IDs
  const getAncestorIds = (nodeId: string, nodes: TreeNode[], parentIds: string[] = []): string[] => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return parentIds;
      }
      if (node.children) {
        const result = getAncestorIds(nodeId, node.children, [...parentIds, node.id]);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };
  
  const buildPath = useCallback((node: TreeNode, currentPath: string[] = []): string[][] => {
    const path = [...currentPath, node.name];
    const paths: string[][] = [];
    
    if (selectedItems[node.id]) {
      paths.push(path);
    }
    
    if (node.children) {
      node.children.forEach(child => {
        paths.push(...buildPath(child, path));
      });
    }
    
    return paths;
  }, [selectedItems]);
  
  const handleSelect = (node: TreeNode) => {
    const newSelectedItems = { ...selectedItems };
    const isSelected = !selectedItems[node.id];
    
    // Get all descendant IDs
    const descendants = getDescendantIds(node);
    
    // Get all ancestor IDs
    const ancestors = getAncestorIds(node.id, data);
    
    // Update selection state for the node and all its descendants
    descendants.forEach(id => {
      newSelectedItems[id] = isSelected;
    });
    
    // If selecting, expand all ancestors
    if (isSelected) {
      ancestors.forEach(id => {
        setExpandedItems(prev => ({
          ...prev,
          [id]: true
        }));
      });
    }
    
    setSelectedItems(newSelectedItems);
    
    // Build all selected paths and call onSelect
    const selectedPaths = data.flatMap(rootNode => buildPath(rootNode));
    onSelect(selectedPaths);
  };
  
  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedItems[node.id];
    const isSelected = selectedItems[node.id];
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className={cn(
            "flex items-center py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors",
            level > 0 && "ml-4"
          )}
        >
          <div className="flex items-center flex-1">
            {hasChildren && (
              <button
                onClick={() => handleToggleExpand(node.id)}
                className="mr-1 focus:outline-none"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? 
                  <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                }
              </button>
            )}
            {!hasChildren && <span className="w-5" />}
            
            <Checkbox
              id={`tree-${node.id}`}
              checked={isSelected}
              onCheckedChange={() => handleSelect(node)}
              className="mr-2"
            />
            
            <label
              htmlFor={`tree-${node.id}`}
              className={cn(
                "flex-1 cursor-pointer text-sm",
                isSelected && "text-primary font-medium"
              )}
            >
              {node.name}
            </label>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {node.children?.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={cn(
      "border rounded-md overflow-hidden bg-card", 
      className
    )}>
      <div 
        className="overflow-y-auto p-1.5"
        style={{ maxHeight }}
      >
        {data.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
} 