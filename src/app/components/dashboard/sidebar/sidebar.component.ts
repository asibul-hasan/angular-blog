import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
// import { LoaderComponent } from '../../../shared/components/template/loader.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class SidebarComponent implements OnInit {
  isSidebarExpanded = false;
  isUserMenuOpen = false;
  // isLoading$;

  isBrowser = false;

  constructor(
    private loaderService: LoaderService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Ensure the observable has an initial value
    // this.isLoading$ = this.loaderService.isLoading$.pipe(startWith(false));
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
