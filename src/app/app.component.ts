import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './shared/services/loader/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected readonly title = signal('infoAidTech');
  private loader = inject(LoaderService);

  ngOnInit(): void {
    this.loader.show();

    setTimeout(() => {
      this.loader.hide();
    }, 2500);
  }
}
