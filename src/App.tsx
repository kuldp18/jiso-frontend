import {
  DashboardPage,
  ForgotPasswordPage,
  GlobalLayout,
  LandingPage,
  LoginPage,
  SignupPage,
  VerifyEmailPage,
  ResetPasswordPage,
  DashboardLayout,
  ErrorPage,
  MoodsPage,
  JournalsPage,
  NewChatPage,
  ChatsPage,
} from "@/pages";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ProtectedRoute, RedirectAuthenticated } from "./components/app";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    errorElement: <ErrorPage />,
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
        path: "forgot-password",
        element: (
          <RedirectAuthenticated>
            <ForgotPasswordPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: "reset-password/:token",
        element: (
          <RedirectAuthenticated>
            <ResetPasswordPage />
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
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            element: <DashboardPage />,
            index: true,
          },

          {
            path: "moods",
            element: <MoodsPage />,
          },

          {
            path: "journals",
            element: <JournalsPage />,
          },
          {
            path: "new-chat",
            element: <NewChatPage />,
          },
          {
            path: "chats",
            element: <ChatsPage />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin mx-auto" />
      </div>
    );
  }

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
