import axios from "axios";
import { UserSignupData, LoginCredentials } from "@/types/auth.types";

axios.defaults.withCredentials = true; // Enable sending cookies with requests

export const signupUser = async (userData: UserSignupData) => {
  const signupUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/signup`;
  const { firstName, lastName, email, password, age, gender } = userData;
  try {
    const response = await axios.post(signupUrl, {
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
  const loginUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
  const { email, password } = credentials;
  try {
    const response = await axios.post(loginUrl, {
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
  const verifyUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`;
  try {
    if (!email) return;

    const response = await axios.post(verifyUrl, {
      email,
      code: pin,
    });
    return response.data;
  } catch (error) {
    console.error("Error while verifying email:", error);
    throw error;
  }
};
