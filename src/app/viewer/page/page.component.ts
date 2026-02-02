import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../../interfaces/page.interface';
import { AnnotationComponent } from '../annotation/annotation.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  standalone: true,
  imports: [CommonModule, AnnotationComponent]
})
export class PageComponent {
  @Input() page: Page;
  
  @Output() pageClicked = new EventEmitter<{ event: MouseEvent; pageNumber: number }>();
  @Output() annotationDeleted = new EventEmitter<string>();
  @Output() annotationMouseUp = new EventEmitter<{ event: MouseEvent; pageNumber: number; annotationId: string }>();

  onPageClick(event: MouseEvent): void {
    this.pageClicked.emit({ event, pageNumber: this.page.pageNumber });
  }
}
