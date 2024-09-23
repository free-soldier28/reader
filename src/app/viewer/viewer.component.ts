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
import { FileHelper } from '../../helpers/file.helper';
import { AnnotationType } from '../enums/annotation-type.enum';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule],
  providers: [DocumentApiService]
})
export class ViewerComponent implements OnInit {
  readonly annotationType = AnnotationType;
  readonly availableImageExtensions = '.JPEG, .PNG, .WebP';

  annotations: Annotation[] = [];
  clickOnPagePosition = { x: 0, y: 0 };
  currentPage: number;
  document: Document;
  isShowTextEditor = false;
  pageHeight = 1200;
  pageWidth = 900;
  pagesMarginTop = 0;
  scaleFactor = 1;
  textCtrl = new FormControl('');
  textEditorPosition = { x: 0, y: 0 };
  zoom = 100;
  currentAnnotationTool: AnnotationType;

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

  setAnnotationTool(value: AnnotationType): void {
    if (value === this.currentAnnotationTool) {
      this.currentAnnotationTool = null;
      return;
    }

    this.currentAnnotationTool = value;
  }

  clickByPage(event, pageNumber: number): void {
    if (this.currentAnnotationTool === AnnotationType.Text) {
      this.showTextEditor({ x: event.clientX, y: event.clientY });
    }
    else if (this.currentAnnotationTool === AnnotationType.Image) {
      this.showUploaderImage();
    }

    const pageEl = document.getElementById(`${pageNumber}`);
    const pageRect = pageEl.getBoundingClientRect();
    this.clickOnPagePosition.x = event.clientX - pageRect.left;
    this.clickOnPagePosition.y = event.clientY - pageRect.top;

    this.currentPage = pageNumber;

    this.cdr.detectChanges();
  }

  fileSelected(fileInput: any): void {
    const file = fileInput.target.files[0] as File;
    FileHelper.blobToBase64WithoutDataType(file)
      .subscribe(str => {
        this.currentAnnotationTool = null;
        this.addAnnotation(AnnotationType.Image, `data:image/jpeg;base64,${str}`);
      });
  }

  addTextAnnotation(): void {
    this.addAnnotation(AnnotationType.Text, this.textCtrl.value);

    this.isShowTextEditor = false;
    this.textCtrl.reset();

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

  private addAnnotation(annotationType: AnnotationType, data: string): void {
    const annotation = {
      id: crypto.randomUUID(),
      type: annotationType,
      data,
      pageNumber: this.currentPage,
      x: this.clickOnPagePosition.x,
      y: this.clickOnPagePosition.y
    } as Annotation;
  
    this.annotations.push(annotation);
    this.setAnnotationToPages(this.document.pages, [annotation]);

    this.currentPage = null;
    this.currentAnnotationTool = null;
  }

  private showTextEditor(position: { x: number; y: number; }): void {
    this.isShowTextEditor = true;

    this.textEditorPosition.x = position.x;
    this.textEditorPosition.y = position.y;

    setTimeout(() => {
      this.textEditor.nativeElement.focus();
    });
  }

  private showUploaderImage(): void {
    const fileInput = document.getElementById('fileInput');

    fileInput.click();   
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
