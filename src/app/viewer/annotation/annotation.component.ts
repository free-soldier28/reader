import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Annotation } from '../../../interfaces/annotation.interface';
import { AnnotationType } from '../../enums/annotation-type.enum';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  standalone: true,
  imports: [CommonModule, MatIconModule, CdkDrag]
})
export class AnnotationComponent {
  readonly annotationType = AnnotationType;

  @Input() annotation: Annotation;
  @Input() pageNumber: number;

  @Output() annotationDeleted = new EventEmitter<string>();
  @Output() annotationMouseUp = new EventEmitter<{ event: MouseEvent; pageNumber: number; annotationId: string }>();

  onDelete(): void {
    this.annotationDeleted.emit(this.annotation.id);
  }

  onMouseUp(event: MouseEvent): void {
    this.annotationMouseUp.emit({ event, pageNumber: this.pageNumber, annotationId: this.annotation.id });
  }
}
