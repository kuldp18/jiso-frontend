import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyEmail = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await verifyEmail(user?.email, data.pin);
      // Pass the fromSignup flag when redirecting to dashboard
      const fromSignup = location.state?.fromSignup === true;
      navigate("/dashboard", {
        state: { fromSignup, needsOnboarding: true },
      });
      toast.success("Email verified successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error verifying email");
    }
  }

  if (user?.verified) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="grid place-content-center min-h-[calc(100vh-64.8px)]">
      {error && toast.error(error)}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-8 rounded-md mx-4"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-center gap-6">
                <FormLabel className="text-lg">Verify your email</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="text-lg" />
                      <InputOTPSlot index={1} className="text-lg" />
                      <InputOTPSlot index={2} className="text-lg" />
                      <InputOTPSlot index={3} className="text-lg" />
                      <InputOTPSlot index={4} className="text-lg" />
                      <InputOTPSlot index={5} className="text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default VerifyEmail;
