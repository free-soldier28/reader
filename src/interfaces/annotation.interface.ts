import { AnnotationType } from "../app/enums/annotation-type.enum";

export interface Annotation {
  id: string;
  type: AnnotationType;
  pageNumber: number;
  x: number;
  y: number;
  data: string;
} 