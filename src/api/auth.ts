import api from "@/api";
import { UserSignupData, LoginCredentials } from "@/types/auth.types";

export const signupUser = async (userData: UserSignupData) => {
  const { firstName, lastName, email, password, age, gender } = userData;
  try {
    const response = await api.post("/auth/signup", {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
    });
    return response.data;
  } catch (error) {
    console.error("Error while signing up:", error);
    throw error;
  }
};

export const loginUser = async (credentials: LoginCredentials) => {
  const { email, password } = credentials;
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error while logging in:", error);
    throw error;
  }
};

export const verifyUserEmail = async (
  email: string | undefined,
  pin: string
) => {
  try {
    if (!email) return;

    const response = await api.post("/auth/verify-email", {
      email,
      code: pin,
    });
    return response.data;
  } catch (error) {
    console.error("Error while verifying email:", error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await api.post("/auth/check-auth");
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error while logging out:", error);
    throw error;
  }
};
