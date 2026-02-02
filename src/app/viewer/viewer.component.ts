import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentApiService } from '../../api/document-api.service';
import { Document } from "../../interfaces/document.interface";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FileHelper } from '../../helpers/file.helper';
import { AnnotationType } from '../enums/annotation-type.enum';
import { ZoomComponent } from './zoom/zoom.component';
import { PageComponent } from './page/page.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { DocumentComponent } from './document/document.component';
import { AnnotationToolbarComponent } from './annotation-toolbar/annotation-toolbar.component';
import { AnnotationService } from '../services/annotation.service';
import { PageService } from '../services/page.service';
const COMPONENTS = [
  ZoomComponent,
  TextEditorComponent,
  DocumentComponent,
  AnnotationToolbarComponent
];

const MATERIAL_COMPONENTS = [
  MatButtonModule,
  MatIconModule
]

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  standalone: true,
  imports: [CommonModule, ...COMPONENTS, ...MATERIAL_COMPONENTS],
  providers: [DocumentApiService]
})
export class ViewerComponent implements OnInit {
  private readonly ZOOM_MARGIN_INCREMENT = 280;
  private readonly ZOOM_SCALE_INCREMENT = 0.1;

  readonly annotationType = AnnotationType;
  readonly availableImageExtensions = '.JPEG, .PNG, .WebP';
  
  clickOnPagePosition = signal({ x: 0, y: 0 });
  currentPage = signal<number | null>(null);
  document = signal<Document | null>(null);
  isShowTextEditor = signal(false);
  pagesMarginTop = signal(0);
  scaleFactor = signal(1);
  textEditorPosition = signal({ x: 0, y: 0 });
  currentAnnotationTool = signal<AnnotationType | null>(null);

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(
    private activeRoute: ActivatedRoute,
    private annotationService: AnnotationService,
    private documentApiService: DocumentApiService,
    private pageService: PageService,
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
    this.scaleFactor.update(v => v + this.ZOOM_SCALE_INCREMENT);
    this.pagesMarginTop.update(v => v + this.ZOOM_MARGIN_INCREMENT);
  }

  zoomDecreased(): void {
    this.scaleFactor.update(v => v - this.ZOOM_SCALE_INCREMENT);
    this.pagesMarginTop.update(v => v - this.ZOOM_MARGIN_INCREMENT);
  }

  setAnnotationTool(value: AnnotationType): void {
    if (value === this.currentAnnotationTool()) {
      this.currentAnnotationTool.set(null);
      return;
    }

    this.currentAnnotationTool.set(value);
  }

  clickByPage(eventData: { event: MouseEvent; pageNumber: number }): void {
    const { event, pageNumber } = eventData;
    
    if (this.currentAnnotationTool() === AnnotationType.Text) {
      this.textEditorPosition.set({ x: event.clientX, y: event.clientY });
      this.isShowTextEditor.set(true);
    }
    else if (this.currentAnnotationTool() === AnnotationType.Image) {
      this.showUploaderImage();
    }

    this.clickOnPagePosition.set(this.pageService.calculateClickPosition(event, pageNumber));
    this.currentPage.set(pageNumber);
  }

  fileSelected(fileInput: any): void {
    const file = fileInput.target.files[0] as File;
    FileHelper.blobToBase64WithoutDataType(file)
      .subscribe(str => {
        this.currentAnnotationTool.set(null);
        const annotation = this.annotationService.addAnnotation(
          AnnotationType.Image,
          `data:image/jpeg;base64,${str}`,
          this.currentPage(),
          this.clickOnPagePosition().x,
          this.clickOnPagePosition().y
        );
        this.annotationService.setAnnotationsToPages(this.document()?.pages);
        this.currentPage.set(null);
      });
  }

  addTextAnnotation(text: string): void {
    const annotation = this.annotationService.addAnnotation(
      AnnotationType.Text,
      text,
      this.currentPage(),
      this.clickOnPagePosition().x,
      this.clickOnPagePosition().y
    );
    this.annotationService.setAnnotationsToPages(this.document()?.pages);

    this.isShowTextEditor.set(false);
    this.currentPage.set(null);
    this.currentAnnotationTool.set(null);
  }

  save(): void {
    this.annotationService.saveAnnotations(this.document()?.id);
  }

  onMouseUp(eventData: { event: MouseEvent; pageNumber: number; annotationId: string }): void {
    //ToDo: Implement drag position update
  }

  private showUploaderImage(): void {
    this.fileInput.nativeElement.click();
  }

  private getDocument(documentId: number): void {
    this.documentApiService.getDocument(documentId)
      .subscribe(document => {
        if (document?.pages?.length) {
          this.document.set(document);
          this.annotationService.loadAnnotations(document.id);
          this.annotationService.setAnnotationsToPages(document.pages);
        }
      });
  }
}
