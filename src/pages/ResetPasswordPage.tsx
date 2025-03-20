import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Loader, MoveLeft } from "lucide-react";

// Reset password schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPassword = useAuthStore((state) => state.resetPassword);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Check if token exists - moved from conditional rendering to useEffect
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) return;

    try {
      await resetPassword(token, values.password);
      setIsSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resetting password");
      console.error("Reset password error:", error);
    }
  }

  // If token is invalid, show error message
  if (!isTokenValid) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64.8px)] px-4">
        <div className="w-full max-w-[90%] sm:max-w-[480px] p-6 border rounded-lg shadow-md text-center">
          <p className="mb-4">Invalid or missing reset token.</p>
          <Link
            to="/forgot-password"
            className="text-sm text-pink-500 hover:underline flex items-center justify-center gap-2"
          >
            <MoveLeft size={20} />
            <span>Back to forgot password</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-64.8px)] px-4 sm:px-6 md:px-8 py-8">
      <div className="w-full max-w-[90%] sm:max-w-[480px] min-h-[400px] p-4 sm:p-8 border rounded-lg shadow-md flex flex-col justify-evenly items-center">
        <div className="w-full mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 text-center">
            Reset your password
          </h1>
          <p className="text-sm sm:text-base text-center">
            {!isSuccess
              ? "Enter your new password below"
              : "Password reset successful!"}
          </p>
        </div>

        {!isSuccess ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              {/* New Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="New password"
                        className="text-sm px-4 py-3 rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm new password"
                        className="text-sm px-4 py-3 rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-3 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-4 w-full">
            <div className="p-4 bg-secondary/30 rounded-md">
              <p>Your password has been reset successfully!</p>
              <p className="text-sm mt-2">
                You will be redirected to the login page.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-pink-500 gap-2 flex items-center justify-center hover:underline"
          >
            <MoveLeft size={20} className="mt-1" />
            <div>Back to login</div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
