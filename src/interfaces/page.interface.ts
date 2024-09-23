import { Annotation } from "./annotation.interface";

export interface Page {
    pageNumber: number;
    imageUrl: string;
    annotations: Annotation[];
}