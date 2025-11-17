import { client } from "@/api/backend/client.gen";
import { postStudentLogin, postStudentSignup } from "@/api/backend/sdk.gen";
import { JwtResponse } from "@/api/backend/types.gen";

export const loginStudentStrapi = async (email: string, password: string) => {
  const response = await postStudentLogin({
    body: {
      email,
      password,
    },
  });
  if (!response) {
    throw new Error("Failed to login user in strapi");
  }

  return response as JwtResponse;
};

export const signUpStudentStrapi = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await postStudentSignup({
    body: {
      name,
      email,
      password,
    },
  });

  if (!response) {
    throw new Error("Failed to signup user in strapi");
  }

  return response as JwtResponse;
};

export const logoutStudentStrapi = () => {
  // Removes the authorization header from the client
  client.setConfig({
    ...client.getConfig(),
    headers: {
      Authorization: "",
    },
  });

  return Promise.resolve();
};
