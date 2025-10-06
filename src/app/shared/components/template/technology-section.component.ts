import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChooseUsCardComponent } from './service-card.component';
import { LanguageService } from '../../services/language/lang.service';
import { SectionTitleCard } from './title-section-card.component';
import { DataService } from '../../../../assets/data/data';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TechCarouselComponent } from './tech-carousel.component';

@Component({
  selector: 'app-technology-section',
  standalone: true,
  imports: [CommonModule, SectionTitleCard, TechCarouselComponent],
  template: `
    <div class="max-w-screen-xl mx-auto px-6 py-20 vh-100">
      <div class="flex flex-col md:flex-row md:gap-6">
        <!-- Left: Fixed / Sticky Image -->
        <div class="w-full md:w-1/2 mb-6 md:mb-0">
          <app-tech-carousel></app-tech-carousel>
        </div>

        <!-- Right: Service Cards -->
        <div
          class="w-full md:w-1/2 grid grid-cols-1 gap-4 justify-center items-center"
          *ngIf="langService.isLoaded$ | async"
        >
          <app-section-title-card
            [title]="langService.lang?.technology"
            [titleDesc]="langService.lang?.ourSoftwareDevelopmentTechnology"
            [description]="
              langService.lang
                ?.weAreCommittedToDrivingDigitalInnovationByDeliveringTheLatestTechnologySolutionsOurCustomSoftwareDevelopmentServicesAreTailoredToMeetTheUniqueNeedsOfEachClientEnsuringTheyStayAheadInAFastPacedWorldWithAFocusOnQualityAndInnovationWeProudlyServeBusinessesWorldwideHelpingThemGrowAndSucceedWithPersonalizedCuttingEdgeSoftware
            "
          ></app-section-title-card>
        </div>
      </div>
    </div>
  `,
})
export class TechnologySectionComponent implements OnInit, OnDestroy {
  dataList$: Observable<any[]> | undefined;
  private dataSubscription: Subscription | undefined;
  customClass: string =
    'relative rounded-lg border-2 border-indigo-500 bg-white p-6 transition duration-500 hover:scale-105 dark:border-gray-300 dark:bg-gray-800';
  constructor(public langService: LanguageService, private data: DataService) {}
  ngOnInit(): void {
    this.dataList$ = this.data.getAboutUsData().pipe(
      map((dataList) =>
        dataList.map((el: any) => {
          el['customClass'] = this.customClass;
          return el;
        })
      )
    );
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // trackByFn(index: number, item: any) {
  //   return item.id;
  // }
}
