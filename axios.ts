import axios from "axios";

export const backEndClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACK_END_HOST,
});

export const certificateServiceClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_CERTIFICATE_SERVICE_HOST,
});
