import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-zoom',
    templateUrl: './zoom.component.html',
    styleUrl: './zoom.component.scss',
    standalone: true,
    imports: [MatIconModule, MatButtonModule]
})
export class ZoomComponent {
    @Input() disabled = false;
    @Input() maxValue = 200;
    @Input() minValue = 10;
    @Input() step = 10;
    @Input() value = 100;

    @Output() decreased = new EventEmitter<number>();
    @Output() increased = new EventEmitter<number>();

    increase(): void {
        if (this.value === this.maxValue) {
            return;
        }

        this.value += this.step;
        this.increased.emit(this.value);
    }

    decrease(): void {
        if (this.value === this.minValue) {
            return;
        }

        this.value -= this.step;
        this.decreased.emit(this.value);
    }
}