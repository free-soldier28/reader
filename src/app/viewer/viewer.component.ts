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
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ZoomComponent } from './zoom/zoom.component';
import { PageAnnotationComponent } from './page-annotation/page-annotation.component';
import { AnnotationService } from '../services/annotation.service';
const COMPONENTS = [
  ZoomComponent,
  PageAnnotationComponent
];

const MATERIAL_COMPONENTS = [
  MatButtonModule,
  MatIconModule,
  MatInputModule
]

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...COMPONENTS, ...MATERIAL_COMPONENTS],
  providers: [DocumentApiService]
})
export class ViewerComponent implements OnInit {
  readonly annotationType = AnnotationType;
  readonly availableImageExtensions = '.JPEG, .PNG, .WebP';
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
  currentAnnotationTool: AnnotationType;

  @ViewChild('textEditor') textEditor: ElementRef;

  constructor(
    private activeRoute: ActivatedRoute,
    private annotationService: AnnotationService,
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

  zoomIncreased(): void {
    this.pageWidth = this.pageWidth * 1.1;
    this.pageHeight = this.pageHeight  * 1.1;
    this.scaleFactor = this.scaleFactor + 0.1;
    this.pagesMarginTop += 280;

    this.cdr.detectChanges();
  }

  zoomDecreased(): void {
    this.pageWidth = this.pageWidth * 0.9;
    this.pageHeight = this.pageHeight * 0.9;
    this.scaleFactor = this.scaleFactor - 0.1;
    this.pagesMarginTop -= 280;

    this.cdr.detectChanges();
  }

  setAnnotationTool(value: AnnotationType): void {
    if (value === this.currentAnnotationTool) {
      this.currentAnnotationTool = null;
      return;
    }

    this.currentAnnotationTool = value;
  }

  clickByPage(eventData: { event: MouseEvent; pageNumber: number }): void {
    const { event, pageNumber } = eventData;
    
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
        const annotation = this.annotationService.addAnnotation(
          AnnotationType.Image,
          `data:image/jpeg;base64,${str}`,
          this.currentPage,
          this.clickOnPagePosition.x,
          this.clickOnPagePosition.y
        );
        this.annotationService.setAnnotationsToPages(this.document.pages);
        this.currentPage = null;
      });
  }

  addTextAnnotation(): void {
    const annotation = this.annotationService.addAnnotation(
      AnnotationType.Text,
      this.textCtrl.value,
      this.currentPage,
      this.clickOnPagePosition.x,
      this.clickOnPagePosition.y
    );
    this.annotationService.setAnnotationsToPages(this.document.pages);

    this.isShowTextEditor = false;
    this.textCtrl.reset();
    this.currentPage = null;
    this.currentAnnotationTool = null;

    this.cdr.detectChanges();
  }

  deleteAnnotation(annotationId: string): void {
    if (!annotationId) {
      return;
    }

    this.annotationService.deleteAnnotation(annotationId);
    this.annotationService.setAnnotationsToPages(this.document.pages);

    this.cdr.detectChanges();
  }

  save(): void {
    this.annotationService.saveAnnotations(this.document.id);
  }

  onMouseUp(eventData: { event: MouseEvent; pageNumber: number; annotationId: string }): void {
    //ToDo: Implement drag position update
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

  private getDocument(documentId: number): void {
    this.documentApiService.getDocument(documentId)
      .subscribe(document => {
        if (document?.pages?.length) {
          this.document = document;
          this.annotationService.loadAnnotations(this.document.id);
          this.annotationService.setAnnotationsToPages(this.document.pages);
        }

        this.cdr.detectChanges();
      });
  }
}
