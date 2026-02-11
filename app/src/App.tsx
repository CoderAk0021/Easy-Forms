import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from './components/app/AppRoutes';


function App() {
  return (
    <BrowserRouter>
      {/* 2. AuthProvider wraps the UI so context is available everywhere */}
      <AuthProvider>
        <div className="min-h-screen bg-[#0f0f12] text-white selection:bg-indigo-500/30">
          <AppRoutes />
          <Toaster position="top-right" richColors theme="dark" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;