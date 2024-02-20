import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Perke';
  myNextProject = 'PERKE';

  showPurpleBoxShadow = true;
  get boxShadow() {
    if (this.showPurpleBoxShadow) return 'purple-box-shadow';

    return 'pink-box-shadow';
  }
}
