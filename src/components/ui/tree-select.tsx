import { useState, useCallback } from 'react';
import { cn } from "../../lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  data: TreeNode[];
  onSelect: (selectedPaths: string[][]) => void;
  className?: string;
  maxHeight?: string;
}

export function TreeSelect({ 
  data, 
  onSelect, 
  className,
  maxHeight = "350px"
}: TreeSelectProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const handleToggleExpand = (nodeId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  const buildPath = useCallback((node: TreeNode, currentPath: string[] = []): string[][] => {
    const path = [...currentPath, node.name];
    
    // If no children or not expanded, return just this path
    if (!node.children || !expandedItems[node.id]) {
      return [path];
    }
    
    // Include all child paths if any children are selected
    const childrenPaths = node.children
      .filter(child => selectedItems[child.id])
      .flatMap(child => buildPath(child, path));
    
    // If no children are selected but this node is, return this path
    if (childrenPaths.length === 0 && selectedItems[node.id]) {
      return [path];
    }
    
    return childrenPaths;
  }, [expandedItems, selectedItems]);
  
  const handleSelect = (node: TreeNode) => {
    const newSelectedItems = { ...selectedItems };
    
    // Toggle selection for this node
    newSelectedItems[node.id] = !newSelectedItems[node.id];
    
    // Deselect any other nodes at the same level
    if (newSelectedItems[node.id]) {
      Object.keys(selectedItems).forEach(key => {
        if (key !== node.id && key.startsWith(node.id.split('-')[0])) {
          newSelectedItems[key] = false;
        }
      });
    }
    
    setSelectedItems(newSelectedItems);
    
    // Build the path and call onSelect
    const selectedPaths = data
      .filter(rootNode => newSelectedItems[rootNode.id] || 
        (rootNode.children && rootNode.children.some(child => newSelectedItems[child.id])))
      .flatMap(rootNode => buildPath(rootNode));
    
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
            "flex items-center py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer",
            isSelected && "bg-primary/10 text-primary font-medium",
            level > 0 && "ml-4"
          )}
        >
          {hasChildren ? (
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
          ) : (
            <span className="w-5" />
          )}
          
          <div 
            className="flex-1"
            onClick={() => handleSelect(node)}
          >
            {node.name}
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