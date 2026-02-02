import { Injectable } from '@angular/core';
import { Annotation } from '../../interfaces/annotation.interface';
import { AnnotationType } from '../enums/annotation-type.enum';
import { Page } from '../../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private annotations: Annotation[] = [];

  getAnnotations(): Annotation[] {
    return this.annotations;
  }

  loadAnnotations(documentId: number): Annotation[] {
    const annotationsStr = localStorage.getItem(`doc_${documentId}_annotations`);
    this.annotations = annotationsStr ? JSON.parse(annotationsStr) : [];
    return this.annotations;
  }

  addAnnotation(
    annotationType: AnnotationType,
    data: string,
    pageNumber: number,
    x: number,
    y: number
  ): Annotation {
    const annotation: Annotation = {
      id: crypto.randomUUID(),
      type: annotationType,
      data,
      pageNumber,
      x,
      y
    };

    this.annotations.push(annotation);
    return annotation;
  }

  deleteAnnotation(annotationId: string): void {
    if (!annotationId) {
      return;
    }

    this.annotations = this.annotations.filter(x => x.id !== annotationId);
  }

  saveAnnotations(documentId: number): void {
    localStorage.setItem(`doc_${documentId}_annotations`, JSON.stringify(this.annotations));
  }

  setAnnotationsToPages(pages: Page[]): void {
    if (!pages?.length || !this.annotations?.length) {
      return;
    }

    for (let page of pages) {
      page.annotations = this.annotations.filter(x => x.pageNumber === page.pageNumber);
    }
  }

  clearAnnotations(): void {
    this.annotations = [];
  }
}
