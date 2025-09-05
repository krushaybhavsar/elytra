import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppScreens } from './types/navigation';
import DashboardScreen from './screens/MainScreen';
import { TooltipProvider } from './components/ui/tooltip';
import { LoadingScreen } from './components/LoadingView';
import { DialogProvider } from './components/contexts/DialogContext';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <DialogProvider>
      <TooltipProvider>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Routes>
              <Route path={AppScreens.MAIN} element={<DashboardScreen />} />
              <Route path='*' element={<Navigate to={AppScreens.MAIN} />} />
            </Routes>
            <Toaster />
          </>
        )}
        <Toaster />
      </TooltipProvider>
    </DialogProvider>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
