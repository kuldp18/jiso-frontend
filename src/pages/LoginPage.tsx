import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// login schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email address",
    }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

const LoginPage = () => {
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
  }

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-64.8px)] px-4 sm:px-6 md:px-8 py-8">
      <div className="w-full max-w-[90%] sm:max-w-[480px] min-h-[500px] p-4 sm:p-8 border rounded-lg shadow-md flex flex-col justify-evenly items-center">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 text-center">
            Login to Jiso
          </h1>

          <p className="text-sm sm:text-base text-center">
            Don't have an account?
            <Link
              to="/signup"
              className="hover:underline text-pink-400 ml-1 hover:font-semibold"
            >
              Create account
            </Link>
          </p>
        </div>

        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-5 w-full mt-6"
          >
            {/* Email */}
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      className="text-sm px-4 py-3 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="text-sm px-4 py-3 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-pink-400 hover:underline hover:font-semibold"
              >
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full py-3 mt-2">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default LoginPage;
