import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentApiService } from '../../api/document-api.service';
import { Document } from "../../interfaces/document.interface";
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Annotation } from '../../interfaces/annotation.interface';
import { Page } from '../../interfaces/page.interface';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule],
  providers: [DocumentApiService]
})
export class ViewerComponent implements OnInit {
  annotations: Annotation[] = [];
  clickOnPageX: number;
  clickOnPageY: number;
  currentPage: number;
  document: Document;
  isAvailableAddingText = false;
  isShowTextEditor = false;
  pageHeight = 1200;
  pageWidth = 900;
  pagesMarginTop = 0;
  scaleFactor = 1;
  textCtrl = new FormControl('');
  textEditorX: number;
  textEditorY: number;
  zoom = 100;

  @ViewChild('textEditor') textEditor: ElementRef;

  constructor(
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private documentApiService: DocumentApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const documentId = +this.activeRoute.snapshot.paramMap.get('id');
    this.getDocument(documentId);
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  zoomPage(value: number): void {
    if (!this.document.pages?.length){
      return;
    }

    if (value === 1 && this.zoom === 200) {
      return;
    }
    if (value === -1 && this.zoom === 10) {
      return;
    }

    if (value == 1) {
      this.zoom += 10;
      this.pageWidth = this.pageWidth * 1.1;
      this.pageHeight = this.pageHeight  * 1.1;
      this.scaleFactor = this.scaleFactor + 0.1;
      this.pagesMarginTop += 280;
    } else {
      this.zoom -= 10;
      this.pageWidth = this.pageWidth * 0.9;
      this.pageHeight = this.pageHeight * 0.9;
      this.scaleFactor = this.scaleFactor - 0.1;
      this.pagesMarginTop -= 280;
    }

    this.cdr.detectChanges();
  }

  activateAddText(): void {
    this.isAvailableAddingText = !this.isAvailableAddingText;
  }

  showTextEditor(event, pageNumber: number): void {
    if (!this.isAvailableAddingText) {
      return;
    }

    this.isShowTextEditor = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.textEditor.nativeElement.focus();
    });

    const pageEl = document.getElementById(`${pageNumber}`);
    const pageRect = pageEl.getBoundingClientRect();
  
    this.textEditorX = event.clientX;
    this.textEditorY = event.clientY;

    this.clickOnPageX = event.clientX - pageRect.left;
    this.clickOnPageY = event.clientY - pageRect.top;

    this.currentPage = pageNumber;
  }

  addTextAnnotation(): void {
    const annotation = {
      id: crypto.randomUUID(),
      type: 'text',
      data: this.textCtrl.value,
      pageNumber: this.currentPage,
      x: this.clickOnPageX,
      y: this.clickOnPageY
    } as Annotation;
    this.annotations.push(annotation);
    this.setAnnotationToPages(this.document.pages, [annotation]);

    this.isShowTextEditor = false;
    this.textCtrl.reset();
    this.currentPage = null;
    this.isAvailableAddingText = false;

    this.cdr.detectChanges();
  }

  deleteAnnotation(annotationId: string): void {
    if (!annotationId) {
      return;
    }

    for (let page of this.document.pages) {
      const index = page.annotations.findIndex(x => x.pageNumber === page.pageNumber && x.id === annotationId);
      if (index != -1) {
        page.annotations.splice(index, 1);
      }
    }

    this.annotations = this.annotations.filter(x => x.id !== annotationId);

    this.cdr.detectChanges();
  }

  save(): void {
    localStorage.setItem(`doc_${this.document.id}_annotations`, JSON.stringify(this.annotations));
  }

  private getAnnotations(documentId: number): Annotation[]  {
    const annotationsStr = localStorage.getItem(`doc_${documentId}_annotations`);
    return JSON.parse(annotationsStr) as Annotation[] ?? [];
  }

  private setAnnotationToPages(pages: Page[], annotations: Annotation[]): void {
    if (!pages.length || !annotations.length) {
      return;
    }

    for (let page of pages) {
      page.annotations = this.annotations.filter(x => x.pageNumber === page.pageNumber);
    }
  }

  private getDocument(documentId: number): void {
    this.documentApiService.getDocument(documentId)
      .subscribe(document => {
        if (document?.pages?.length) {
          this.document = document;
          this.annotations = this.getAnnotations(this.document.id);
          this.setAnnotationToPages(this.document.pages, this.annotations);
        }

        this.cdr.detectChanges();
      });
  }
}
