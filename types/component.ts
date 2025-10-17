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
}
