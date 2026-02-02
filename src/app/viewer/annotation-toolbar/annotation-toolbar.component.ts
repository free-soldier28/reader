import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnnotationType } from '../../enums/annotation-type.enum';

@Component({
  selector: 'app-annotation-toolbar',
  templateUrl: './annotation-toolbar.component.html',
  styleUrl: './annotation-toolbar.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class AnnotationToolbarComponent {
  readonly annotationType = AnnotationType;

  @Input() selectedTool = signal<AnnotationType | null>(null);
  @Output() toolSelected = new EventEmitter<AnnotationType>();

  selectTool(tool: AnnotationType): void {
    this.toolSelected.emit(tool);
  }
}
