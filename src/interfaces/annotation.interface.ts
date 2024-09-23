export interface Annotation {
  type: 'text' | 'image';
  pageNumber: number;
  x: number;
  y: number;
  data: string;
} 