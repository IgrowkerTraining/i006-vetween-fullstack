import React, { useEffect } from "react";
import { HashRouter, useNavigate } from "react-router-dom";
import { AuthProvider } from "./src/context/AuthContext";
import { ToastProvider, useToast } from "./src/context/ToastContext";
import { ToastContainer } from "./src/components/common/ToastContainer";
import { Layout } from "./src/components/layout/Layout";
import { LoadingSpinner } from "./src/components/common/LoadingSpinner";
import { AppRoutes } from "./src/routes/AppRoutes";
import { useAuth } from "./src/hooks/useAuth";
import { setHttpErrorHandlers, installFetchInterceptor } from "./src/utils/httpErrorHandler";

const AppContent: React.FC = () => {
  const { loading, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setHttpErrorHandlers(showToast, () => {
      logout();
      navigate("/login");
    });
    installFetchInterceptor();
  }, [showToast, logout, navigate]);

  if (loading) {
    return <LoadingSpinner message="Initializing Example App..." />;
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
