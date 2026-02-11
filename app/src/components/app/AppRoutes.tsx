import { useLocation,useNavigate,Route,Routes,Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import { LoginPage } from "@/pages/LoginPage";
import { PublicForm } from "@/pages/PublicForm";
import { Dashboard } from "@/pages/Dashboard";
import ProtectedRoute from "../ProtectedRoute";
import { FormResponses } from "@/pages/FormResponses";
import EditorWrapper from "./EditorWrapper";

export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="popLayout">
      {/* Key triggers re-render on route change for animations */}
      <Routes location={location} key={location.pathname}>
        
        {/* === PUBLIC ROUTES === */}
        
        {/* 1. Login Page */}
        <Route 
          path="/login" 
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          } 
        />

        {/* 2. Public Form View (Must be public so respondents can access) */}
        <Route 
          path="/form/:formId" 
          element={
            <PageTransition>
              <PublicForm />
            </PageTransition>
          } 
        />

        <Route
          path="/form"
          element={
            <PageTransition>
              <PublicForm />
            </PageTransition>
          }
        />

        {/* === PROTECTED ROUTES === */}
        {/* All routes inside this wrapper require authentication */}
        <Route element={<ProtectedRoute />}>
          
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <Dashboard
                  onEditForm={(form) =>
                    navigate(`/editor/${form.id}`, { state: { form } })
                  }
                />
              </PageTransition>
            }
          />

          <Route
            path="/editor/:formId"
            element={
              <PageTransition>
                <EditorWrapper onBack={() => navigate('/dashboard')} />
              </PageTransition>
            }
          />

          <Route 
            path="/form/:id/responses" 
            element={
              <PageTransition>
                <FormResponses />
              </PageTransition>
            } 
          />
           
           {/* Fallback: Send to dashboard (which will redirect to login if needed) */}
           <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
}
