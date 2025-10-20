export interface Component {
  type: string;
  lectureType: string;
  _id: string;
  component: {
    _id: string;
    contentType: string;
    title: string;
    video: string;
    image: string;
  };
  // Progress-related fields may be present in some contexts
  compId?: string;
  isComplete?: boolean;
  isFirstAttempt?: boolean;
  parentSection?: string;
}
