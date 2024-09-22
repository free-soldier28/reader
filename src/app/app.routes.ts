import { Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';

export const routes: Routes = [
    { 
        path: '', 
        component: DocumentsComponent
    },
    { 
        path: '**', 
        component: DocumentsComponent
    }
];
