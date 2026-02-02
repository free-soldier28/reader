import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../../interfaces/page.interface';
import { PageComponent } from '../page/page.component';
import { AnnotationService } from '../../services/annotation.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
  standalone: true,
  imports: [CommonModule, PageComponent]
})
export class DocumentComponent {
  @Input() pages: Page[] | undefined;
  @Input() pagesMarginTop = 0;
  @Input() scaleFactor = 1;

  @Output() pageClicked = new EventEmitter<{ event: MouseEvent; pageNumber: number }>();
  @Output() annotationMouseUp = new EventEmitter<{ event: MouseEvent; pageNumber: number; annotationId: string }>();

  constructor(private annotationService: AnnotationService) {}

  onAnnotationDeleted(annotationId: string): void {
    if (!annotationId) {
      return;
    }

    this.annotationService.deleteAnnotation(annotationId);
    this.annotationService.setAnnotationsToPages(this.pages);
  }
}
