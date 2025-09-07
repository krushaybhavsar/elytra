import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppScreens } from './types/navigation';
import DashboardScreen from './screens/MainScreen';
import { TooltipProvider } from './components/ui/tooltip';
import { LoadingScreen } from './components/LoadingView';
import { DialogProvider } from './components/contexts/DialogContext';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <TooltipProvider>
          <HashRouter>
            {loading ? (
              <LoadingScreen />
            ) : (
              <>
                <Routes>
                  <Route path={AppScreens.MAIN} element={<DashboardScreen />} />
                  <Route path='*' element={<Navigate to={AppScreens.MAIN} />} />
                </Routes>
              </>
            )}
            <Toaster richColors />
          </HashRouter>
        </TooltipProvider>
      </DialogProvider>
    </QueryClientProvider>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
