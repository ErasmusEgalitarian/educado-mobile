import { View, Pressable } from "react-native";
import type { Course } from "@/types";
import { ReactElement } from "react";

export interface CourseButtonProps {
  course: Course;
  onPress: (course: Course) => void;
  children: ReactElement;
}

/**
 * CourseButton component displays a button to subscribe to or access a course
 * @param course - Course object containing course details
 * @param onPress - Callback function executed when the button is pressed, receiving the course as an argument
 * @param children - The React element(s) to render inside the button
 * @returns The rendered component
 */
export const CourseButton = ({
  course,
  onPress,
  children,
}: CourseButtonProps) => {
  return (
    <View>
      <Pressable
        onPress={() => {
          onPress(course);
        }}
        className="flex w-full items-center justify-center rounded-2xl bg-surfaceDefaultCyan p-2"
      >
        {children}
      </Pressable>
    </View>
  );
};
