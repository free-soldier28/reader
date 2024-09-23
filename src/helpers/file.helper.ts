import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";

export class FileHelper {
    static blobToBase64WithoutDataType(file: Blob): Observable<string> {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const result = new Subject<string>();
        reader.onloadend = () => {
            result.next((reader.result as string).substr((reader.result as string).indexOf(',')+1));
            result.complete();
        };
        return result.asObservable();
    }
}