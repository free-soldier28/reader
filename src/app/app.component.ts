import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DocumentsComponent } from './documents/documents.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, DocumentsComponent]
})
export class AppComponent{ }
