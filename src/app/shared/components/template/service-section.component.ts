import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ServiceCardComponent } from './cards/service-card.component';
import { SectionTitleCard } from './title-section-card.component';
import { LanguageService } from '../../services/language/lang.service';
import { DataService } from '../../../../assets/data/data';

@Component({
  selector: 'app-service-section',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, SectionTitleCard],
  template: `
    <section class="home-service-section">
      <div class="max-w-screen-xl mx-auto px-6 py-20">
        <!-- Section Title -->
        <app-section-title-card
          [title]="langService.lang?.ourServices"
          [titleDesc]="langService.lang?.weProvideTheBestServiceForYou"
          [description]="
            langService.lang
              ?.werededicatedToGivingYouTopNotchServiceThatsJustRightForYouWeMakeSureEveryTimeWeHelpYouItsEvenBetterThanYouExpectedWhetherYouNeedAdviceTechHelpOrAnythingElseWereHereToMakeSureYouReachYourGoalsSmoothlyAndSuccessfully
          "
        ></app-section-title-card>

        <!-- Sticky Scroll Section -->
        <div class="relative w-full">
          <div class="sticky top-20">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 auto-rows-fr"
            >
              <div *ngFor="let service of services$ | async" class="p-4">
                <app-service-section-card
                  [id]="service.id"
                  [title]="service.title"
                  [description]="service.description"
                  [icon]="service.icon"
                ></app-service-section-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ServiceSectionComponent {
  services$!: Observable<any[]>;
  private resizeObserver?: ResizeObserver;

  constructor(public langService: LanguageService, private data: DataService) {
    this.services$ = this.data.getOurServiceData();
  }
}
