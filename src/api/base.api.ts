import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export abstract class BaseApi {
    protected apiUrl: string;

    constructor(protected http: HttpClient) {
        this.apiUrl = environment.apiUrl;
        this.handleApiUrl();
    }

    protected apiGet<T>(url: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${url}`);
    }

    protected apiPost<T>(url: string, data: any = null): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${url}`, data);
    }

    protected apiPut<T>(url: string, data: any = null): Observable<any> {
        return this.http.put<T>(`${this.apiUrl}${url}`, data)
    }

    protected apiDelete<T>(url: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${url}`)
    }

    protected apiPatch<T>(url: string, data: any): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}${url}`, data);
    }

    private handleApiUrl(): void {
        if (this.apiUrl.length && this.apiUrl[this.apiUrl.length - 1] !== "/"){
            this.apiUrl = `${this.apiUrl}/`;
        }
    }
}
