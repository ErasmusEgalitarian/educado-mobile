import { Component } from "@/types/component";

export interface Section {
  sectionId: string;
  title: string;
  parentCourseId: string;
  description: string;
  components: Component[];
  total: number;
}

export interface ApiSection {
  _id: string;
  title: string;
  parentCourse: string;
  description: string;
  components: Component[];
  totalPoints: number;
}
