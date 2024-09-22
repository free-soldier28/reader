import { Component, OnInit } from '@angular/core';
import { DocumentApiService } from '../../api/document-api.service';
import { Router } from '@angular/router';
import { Document } from "../../interfaces/document.interface";

@Component({
  selector: 'documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  standalone: true,
  imports: [],
  providers: [DocumentApiService]
})
export class DocumentsComponent implements OnInit {
    documents: Document[] = [];

    constructor(
      private documentApiService: DocumentApiService,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      this.getDocuments();
    }
  
    openViewer(id: number): void {
      this.router.navigate(['viewer', id]);
    }
  
    private getDocuments(): void {
      this.documentApiService.getDocumentList()
        .subscribe(documents => {
          this.documents = documents ?? [];
        });
    }
}
