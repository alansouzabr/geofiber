export interface TrainingCourse {

  id:string;

  title:string;

  description:string;

  category:string;

  thumbnail?:string;

  duration?:number;

  published:boolean;

}

export interface TrainingLesson{

  id:string;

  courseId:string;

  title:string;

  order:number;

  type:"PDF"|"VIDEO";

  url:string;

}

export interface TrainingProgress{

  courseId:string;

  lessonId:string;

  completed:boolean;

  percentage:number;

}


export interface TrainingFile{

  id?:string;

  name:string;

  fileUrl?:string;

  category?:string;

  month?:string;

  year?:string;

  type?:string;

  size?:number;

  uploadedBy?:string;

  createdAt?:string;

}
