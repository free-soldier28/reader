export interface Annotation {
  id: string;
  type: 'text' | 'image';
  pageNumber: number;
  x: number;
  y: number;
  data: string;
} 