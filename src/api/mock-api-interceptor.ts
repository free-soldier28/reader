import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpClient, HttpStatusCode } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Document } from "../interfaces/document.interface";
import { Router } from '@angular/router';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
    private readonly baseUrl = 'mock-api';
    private readonly baseJsonUrl = 'assets/mock-data';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes(`${this.baseUrl}/documents/`)) {
            const lastSlashIndex = req.url.lastIndexOf('/');
            const documentId = req.url.slice(-(req.url.length - lastSlashIndex - 1));

            return this.getDocumentResponse(+documentId)
                .pipe(
                    tap(response => {
                        // @ts-ignore: 
                        if (response.status === HttpStatusCode.NotFound) {
                            this.router.navigate(['/not-found']);
                        }
                    })
                );
        }

        if (req.url === `${this.baseUrl}/documents`) {
            return this.getDocumentsResponse();
        }

        return next.handle(req);
    }

    private getDocumentResponse(documentId: number): Observable<HttpResponse<any>> {
        return this.getHttpResponseFromFile<Document[]>('mock-documents.json')
            .pipe(
                map(response => {
                    const document = response.body.find(x => x.id === documentId);
                    const httpStatus = document ? HttpStatusCode.Ok : HttpStatusCode.NotFound;

                    return new HttpResponse({ status: httpStatus, body: document });
                })
            );
    }

    private getDocumentsResponse(): Observable<HttpResponse<any>> {
        return this.getHttpResponseFromFile<Document[]>('mock-document-short-list.json');
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
