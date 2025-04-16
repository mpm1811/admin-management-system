import { Sun } from 'lucide-react';
import { Button } from '../ui/button';

export function ThemeToggle() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Light theme"
      className="bg-muted/30 hover:bg-muted/50 rounded-full cursor-default"
    >
      <Sun className="h-5 w-5 text-yellow-400" />
    </Button>
  );
}