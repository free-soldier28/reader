import { HttpClient } from "@angular/common/http";
import { BaseApi } from "./base.api";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Document } from "../interfaces/document.interface";

@Injectable()
export class DocumentApiService extends BaseApi {
    private readonly baseUrl = 'documents';
 
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getDocumentList(): Observable<Document[]> {
        return this.apiGet<Document[]>(this.baseUrl);
    }

    getDocument(id: number): Observable<Document> {
        return this.apiGet<Document>(`${this.baseUrl}/${id}`);
    }
}