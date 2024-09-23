import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { DocumentsComponent } from './documents/documents.component';

export const routes: Routes = [
    { 
        path: '', 
        component: DocumentsComponent
    },
    { 
        path: 'viewer/:id', 
        component: ViewerComponent
    },
    { 
        path: '**', 
        component: DocumentsComponent
    }
];
