import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerMenu } from './components/CustomerMenu';
import { ViewMode, Category, MenuItem, RestaurantConfig } from './types';
import { MOCK_CATEGORIES, MOCK_ITEMS, INITIAL_CONFIG } from './constants';

const App = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LANDING');
  
  // Lifted State for data persistence across views
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(MOCK_ITEMS);
  const [config, setConfig] = useState<RestaurantConfig>(INITIAL_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
      );
  }

  return (
    <div className="antialiased text-slate-900">
      {viewMode === 'LANDING' && (
        <LandingPage 
          onGetStarted={() => setViewMode('DASHBOARD')} 
          onDemoToggle={(mode) => setViewMode(mode)}
        />
      )}

      {viewMode === 'DASHBOARD' && (
        <AdminDashboard 
          categories={categories}
          items={items}
          config={config}
          setCategories={setCategories}
          setItems={setItems}
          setConfig={setConfig}
          onLogout={() => setViewMode('LANDING')}
        />
      )}

      {viewMode === 'CUSTOMER_PREVIEW' && (
        <div className="bg-slate-900 min-h-screen flex justify-center sm:items-center sm:p-4">
            <div className="w-full max-w-[480px] h-full sm:h-[850px] bg-white sm:rounded-[3rem] overflow-hidden shadow-2xl relative">
                {/* Simulated Customer Device Frame for Desktop View */}
                <CustomerMenu 
                    categories={categories} 
                    items={items} 
                    config={config} 
                />
                
                {/* Back to landing button for Demo purposes */}
                <button 
                    onClick={() => setViewMode('LANDING')}
                    className="fixed bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 transition z-50"
                >
                    Exit Demo
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
