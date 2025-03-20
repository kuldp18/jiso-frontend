import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";

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

// email schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email address",
    }),
});

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const isLoading = useAuthStore((state) => state.isLoading);

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      await forgotPassword(values.email);
      setSubmittedEmail(values.email);
      setIsSubmitted(true);
      toast.success("Reset link sent to your email!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending reset link");
      console.error("Forgot password error:", error);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-64.8px)] px-4 sm:px-6 md:px-8 py-8">
      <div className="w-full max-w-[90%] sm:max-w-[480px] min-h-[400px] p-4 sm:p-8 border rounded-lg shadow-md flex flex-col justify-evenly items-center">
        <div className="w-full mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 text-center">
            Reset your password
          </h1>
          <p className="text-sm sm:text-base text-center">
            {!isSubmitted
              ? "Enter your registered email address"
              : "Check your email for a reset link"}
          </p>
        </div>

        {!isSubmitted ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
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
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-4 w-full">
            <div className="p-4 bg-secondary/30 rounded-md">
              <p>
                A password reset link has been sent to{" "}
                <span className="font-semibold">{submittedEmail}</span>
              </p>
              <p className="text-sm mt-2">
                Please check your inbox and follow the instructions to reset
                your password.
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

export default ForgotPasswordPage;
