import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  standalone: true,
  imports: [MatIconModule]
})
export class NotFoundComponent {
  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(['']);
  }
}
