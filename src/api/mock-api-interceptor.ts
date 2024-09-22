import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Document } from "../interfaces/document.interface";

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
    private readonly baseUrl = 'mock-api';
    private readonly baseJsonUrl = 'assets/mock-data';

    constructor(private http: HttpClient) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes(`${this.baseUrl}/documents/1`)) {
            return this.getDocumentResponse();
        }

        if (req.url === `${this.baseUrl}/documents`) {
            return this.getDocumentsResponse();
        }

        return next.handle(req);
    }

    private getDocumentResponse(): Observable<HttpResponse<any>> {
        return this.getHttpResponseFromFile<Document>('mock-document-1.json');
    }
    
    private getDocumentsResponse(): Observable<HttpResponse<any>> {
        return this.getHttpResponseFromFile<Document[]>('mock-documents.json');
    }

    private getHttpResponseFromFile<T>(fileName: string): Observable<HttpResponse<T>> {
        return this.readFromFile<T>(fileName)
            .pipe(
                map(data => new HttpResponse({ status: 200, body: data }))
            );
    }  

    private readFromFile<T>(fileName: string): Observable<T> {
        return this.http.get<T>(`${this.baseJsonUrl}/${fileName}`);
    }
}
