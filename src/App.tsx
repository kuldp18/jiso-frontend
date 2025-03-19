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
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

const App = () => {
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
