import { Page } from "./page.interface";

export interface Document {
    id: number;
    name: string;
    pages?: Page[];
}