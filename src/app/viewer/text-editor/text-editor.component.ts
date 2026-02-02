import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule]
})
export class TextEditorComponent implements OnChanges {
  @Input() position: { x: number; y: number };
  @Input() show = false;
  @Output() textAdded = new EventEmitter<string>();

  textCtrl = new FormControl('');

  @ViewChild('textEditor') textEditor: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      setTimeout(() => {
        this.textEditor?.nativeElement.focus();
      });
    }
  }

  onBlur(): void {
    if (this.textCtrl.value) {
      this.textAdded.emit(this.textCtrl.value);
      this.textCtrl.reset();
    }
  }
}
