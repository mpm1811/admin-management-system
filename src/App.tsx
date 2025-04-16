import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { EmployeeModuleEnablement } from './components/modules/EmployeeModuleEnablement';
import { AdminAccessManagement } from './components/modules/AdminAccessManagement';
import { FeatureFlagManagement } from './components/modules/FeatureFlagManagement';
import { Navbar } from './components/layout/Navbar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('employee-modules');
  const [mounted, setMounted] = useState(false);

  // Animation effect for initial load
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-6 pb-16">
        <div className={`container mx-auto px-4 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="glass-card mb-8">
            <h1 className="text-2xl font-bold mb-2 gradient-text">Admin Configuration Dashboard</h1>
            <p className="text-muted-foreground">Manage system settings, user permissions, and feature flags</p>
          </div>
          
          <Tabs 
            defaultValue="employee-modules" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full animate-fade-in"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 p-1 bg-muted/20 backdrop-blur-sm rounded-xl">
              <TabsTrigger 
                value="employee-modules"
                className="data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 transition-all py-3"
              >
                Employee Module Enablement
              </TabsTrigger>
              <TabsTrigger 
                value="admin-access"
                className="data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 transition-all py-3"
              >
                Admin Access Management
              </TabsTrigger>
              <TabsTrigger 
                value="feature-flags"
                className="data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 transition-all py-3"
              >
                Feature Flag Management
              </TabsTrigger>
            </TabsList>
            
            <div className="card shadow-lg border border-border/50">
              <TabsContent value="employee-modules" className="animate-fade-in">
                <EmployeeModuleEnablement />
              </TabsContent>
              
              <TabsContent value="admin-access" className="animate-fade-in">
                <AdminAccessManagement />
              </TabsContent>
              
              <TabsContent value="feature-flags" className="animate-fade-in">
                <FeatureFlagManagement />
              </TabsContent>
              
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default App;
