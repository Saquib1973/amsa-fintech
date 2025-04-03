export interface CourseLecture {
  title: string;
  videoId: string;
  description: string;
}

export interface Course {
  title: string;
  description: string;
  instructor: string;
  lectures: CourseLecture[];
  thumbnail: string;
}