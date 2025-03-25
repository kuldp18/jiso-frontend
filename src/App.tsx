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
  NewMoodPage,
  NewJournalPage,
  ChatPage,
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
            path: "moods/create",
            element: <NewMoodPage />,
          },

          {
            path: "journals",
            element: <JournalsPage />,
          },
          {
            path: "journals/create",
            element: <NewJournalPage />,
          },
          {
            path: "new-chat",
            element: <NewChatPage />,
          },
          {
            path: "chats",
            element: <ChatsPage />,
          },
          {
            path: "chats/:chatId",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Initial auth check when component mounts
    checkAuth();

    // Set up periodic auth check every 3 minutes
    const intervalId = setInterval(() => {
      checkAuth();
    }, 3 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
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
