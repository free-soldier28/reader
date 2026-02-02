import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  calculateClickPosition(event: MouseEvent, pageNumber: number): { x: number; y: number } {
    const pageEl = document.getElementById(`${pageNumber}`);
    if (!pageEl) {
      return { x: 0, y: 0 };
    }

    const pageRect = pageEl.getBoundingClientRect();
    return {
      x: event.clientX - pageRect.left,
      y: event.clientY - pageRect.top
    };
  }

  getPageElement(pageNumber: number): HTMLElement | null {
    return document.getElementById(`${pageNumber}`);
  }
}
