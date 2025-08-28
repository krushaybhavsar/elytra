import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppScreens } from './types/navigation';
import DashboardScreen from './screens/MainScreen';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { LoadingScreen } from './components/screens/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
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
    </TooltipProvider>
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
