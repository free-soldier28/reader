import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { DocumentsComponent } from './documents/documents.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
        path: 'not-found', 
        component: NotFoundComponent
    },
    { 
        path: '**', 
        component: DocumentsComponent
    }
];
