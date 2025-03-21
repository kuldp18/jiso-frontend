import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";
import { Loader } from "lucide-react";

// signup schema
const signupSchema = z.object({
  firstName: z.string().min(3, {
    message: "First name is required",
  }),
  lastName: z.string().min(3, {
    message: "Last name is required",
  }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({
      message: "Invalid email format",
    })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email address",
    }),
  password: z.string().min(8, {
    message: "Password is required",
  }),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(18, {
    message: "You must be at least 18 years old",
  }),
});

const SignupPage = () => {
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "male",
      age: 18,
    },
  });

  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      await signup(values);
      navigate("/verify-email", { state: { fromSignup: true } });
    } catch (error) {
      console.log(`Error while signing up: ${error}`);
    }
  }
  return (
    <>
      <main className="flex justify-center items-center min-h-[calc(100vh-64.8px)] px-2 sm:px-4 py-6">
        <div className="w-full sm:max-w-[500px] p-3 sm:p-8 border rounded-lg shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">
            Create New Account
          </h1>

          <div>
            <p className="text-xs sm:text-sm text-center">
              Already have an account?
              <Link
                to="/login"
                className="hover:underline text-pink-400 ml-1 sm:ml-2 hover:font-semibold"
              >
                Login
              </Link>
            </p>
          </div>

          {/* error */}
          {error && (
            <div>
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            </div>
          )}

          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSubmit)}
              className="space-y-4 mt-4 sm:mt-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* First Name */}
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Firstname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                {/* Last Name */}
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Lastname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password must be at least 8 characters"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Gender */}
                <FormField
                  control={signupForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm">Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={signupForm.control}
                  name="age"
                  render={({
                    field: { onChange, onBlur, name, ref, value },
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm">Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Age must be at least 18"
                          type="number"
                          className="w-full"
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? "" : parseInt(val, 10));
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                          value={value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" />
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};
export default SignupPage;
