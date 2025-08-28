import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChooseUsCardComponent } from './service-card';
import { LanguageService } from '../../services/language/lang.service';
import { SectionTitleCard } from './title-section-card';
import { DataService } from '../../../../assets/data/data';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, ChooseUsCardComponent, SectionTitleCard],
  template: `
    <div class="max-w-screen-xl mx-auto px-6 py-20">
      <div class="flex flex-col md:flex-row md:gap-6">
        <!-- Left: Fixed / Sticky Image -->
        <div class="w-full md:w-1/2 mb-6 md:mb-0">
          <div class="md:sticky md:top-20 flex justify-center">
            <img
              src="https://res.cloudinary.com/dfcir8epp/image/upload/v1755605324/White-and-Red-Illustrative-Software-Development_fqzphq.webp"
              alt="Section Image"
              class="w-full md:w-auto"
            />
          </div>
        </div>

        <!-- Right: Service Cards -->
        <div class="w-full md:w-1/2 grid grid-cols-1 gap-4">
          <app-section-title-card
            [title]="langService.lang?.aboutInfoaidTech"
            [titleDesc]="
              langService.lang
                ?.mergingVisionAndExpertiseToEmpowerBusinessesInTheDigitalEra
            "
            [description]="langService.lang?.aboutSection?.description"
          ></app-section-title-card>

          <div *ngFor="let list of dataList">
            <app-service-card [list]="list"></app-service-card>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AboutSection implements OnInit {
  dataList: any;
  customClass: string =
    'relative rounded-lg border-2 border-indigo-500 bg-white p-6 transition duration-500 hover:scale-105 dark:border-gray-300 dark:bg-gray-800';
  constructor(public langService: LanguageService, private data: DataService) {}
  ngOnInit(): void {
    this.dataList = this.data.getAboutUsData().map((el: any) => {
      el['customClass'] = this.customClass;
      return el;
    });
  }

  // trackByFn(index: number, item: any) {
  //   return item.id;
  // }
}
