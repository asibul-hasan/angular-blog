import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { ChooseUsCardComponent } from './service-card.component';
import { SectionTitleCard } from './title-section-card.component';
import { DataService } from '../../../../assets/data/data';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-choose-us',
  standalone: true,
  imports: [CommonModule, ChooseUsCardComponent, SectionTitleCard],
  template: ` <section class="choose-us-home-section">
    <div class="max-w-screen-xl mx-auto px-6 py-20">
      <div class="flex flex-col md:flex-row md:gap-6 md:items-center">
        <!-- Left: Section Title (horizontally & vertically centered) -->
        <div
          class="md:w-2/6 mb-6 md:mb-0 flex justify-center"
          *ngIf="langService.isLoaded$ | async"
        >
          <app-section-title-card
            [title]="langService.lang.whyChooseUs"
            [titleDesc]="
              langService.lang
                .ourAimIsToImproveReturnOnInvestmentsAndReduceCosts
            "
            [description]="
              langService.lang
                .discoverTheReasonsWhyWereTheRightChoiceForYouWithOurExpertiseDedicationAndCommitmentToExcellenceWeDeliverOutstandingResultsThatExceedExpectations
            "
          ></app-section-title-card>
        </div>
        <!-- Right: Service Cards -->
        <div class="md:w-4/6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div *ngFor="let list of dataList$ | async" class="p-4">
            <app-service-card [list]="list"> </app-service-card>
          </div>
        </div>
      </div>
    </div>
  </section>`,
  styles: ``,
})
export class ChooseUs implements OnInit, OnDestroy {
  dataList$: Observable<any[]> | undefined;
  private dataSubscription: Subscription | undefined;
  customClass: string =
    'h-full py-6 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl shadow-sm hover:shadow-md transition';
  constructor(public langService: LanguageService, private data: DataService) {}

  ngOnInit(): void {
    this.dataList$ = this.data.getChooseUsData().pipe(
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
}
