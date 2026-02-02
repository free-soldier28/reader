import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Page } from '../../../interfaces/page.interface';
import { AnnotationType } from '../../enums/annotation-type.enum';

@Component({
  selector: 'app-page-annotation',
  templateUrl: './page-annotation.component.html',
  styleUrl: './page-annotation.component.scss',
  standalone: true,
  imports: [CommonModule, MatIconModule, CdkDrag]
})
export class PageAnnotationComponent {
  readonly annotationType = AnnotationType;

  @Input() page: Page;

  @Output() pageClicked = new EventEmitter<{ event: MouseEvent; pageNumber: number }>();
  @Output() annotationDeleted = new EventEmitter<string>();
  @Output() annotationMouseUp = new EventEmitter<{ event: MouseEvent; pageNumber: number; annotationId: string }>();

  onPageClick(event: MouseEvent): void {
    this.pageClicked.emit({ event, pageNumber: this.page.pageNumber });
  }

  onDeleteAnnotation(annotationId: string): void {
    this.annotationDeleted.emit(annotationId);
  }

  onAnnotationMouseUp(event: MouseEvent, annotationId: string): void {
    this.annotationMouseUp.emit({ event, pageNumber: this.page.pageNumber, annotationId });
  }
}
