import {
  DashboardPage,
  GlobalLayout,
  LandingPage,
  LoginPage,
  SignupPage,
  VerifyEmailPage,
} from "@/pages";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ProtectedRoute, RedirectAuthenticated } from "./components/app";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      {
        element: <LandingPage />,
        index: true,
      },
      {
        path: "signup",
        element: (
          <RedirectAuthenticated>
            <SignupPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: "login",
        element: (
          <RedirectAuthenticated>
            <LoginPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            color: `white`,
            backgroundColor: "hsl(309 40% 30%)",
            fontSize: "0.875rem",
          },
        }}
      />
    </>
  );
};
export default App;
