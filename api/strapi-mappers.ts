import { JwtResponse } from "@/api/backend/types.gen";
import { LoginStudent, StudentCourse } from "@/types";

/**
 * Maps a Strapi JwtResponse to a LoginStudent.
 * This is a basic mapper that handles the essential user info.
 * TODO: Add courses mapping when course data is available.
 *
 * @param jwtResponse - The JWT response from Strapi login
 * @returns A LoginStudent object
 */
export const mapToLoginStudent = (jwtResponse: JwtResponse): LoginStudent => {
  if (!jwtResponse.accessToken || !jwtResponse.userInfo) {
    throw new Error("Invalid JWT response: missing accessToken or userInfo");
  }

  const { userInfo } = jwtResponse;
  const nameParts = (userInfo.name ?? "").split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  return {
    accessToken: jwtResponse.accessToken,
    userInfo: {
      id: userInfo.documentId ?? "",
      firstName,
      lastName,
      email: userInfo.email ?? "",
      courses: [], // TODO: Fetch and map courses from Strapi
      points: 0, // TODO: Add points to Strapi model or fetch from student data
      role: "user" as const, // TODO: Add role to Strapi model
    },
  };
};

