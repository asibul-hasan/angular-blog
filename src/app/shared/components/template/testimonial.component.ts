import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTitleCard } from './title-section-card.component';

@Component({
  selector: 'app-testimonial-section',
  standalone: true,
  imports: [CommonModule, SectionTitleCard],
  template: `
    <section class="section-testimonial relative overflow-hidden">

      <!-- <div class="relative z-10"> -->

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-16 lg:py-20 relative z-10"
>
        <!-- <div class="grid grid-cols-1 grid-rows-2 gap-2"> -->
        <!-- 1st cell -->
        <div class="p-4 rounded max-w-4xl">
          <app-section-title-card
            [title]="'Testimonials'"
            [titleDesc]="'What Client Says About Info aidTech'"
            [description]="
              'At Info aidTech, we take pride in delivering exceptional service and building lasting relationships with our clients. Your satisfaction is our top priority, and we strive to exceed your expectations every step of the way. Thank you for your kind words!'
            "
          ></app-section-title-card>
        </div>

        <!-- 2nd cell -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg"
            *ngFor="let t of testimonials"
          >
            <p class="text-lg font-semibold text-[#f76179] mb-2">
              {{ t.title }}
            </p>

            <div class="relative mb-4">
              <!-- Optional quote icon -->
              <span
                class="absolute -left-3 -top-4 text-5xl text-white opacity-40"
                >“</span
              >
              <p class="text-gray-200 leading-relaxed pl-6">
                {{ t.message }}
              </p>
            </div>

            <p class="text-right text-sm font-medium text-[#f76179]">
              — {{ t.author }}
            </p>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </section>
  `,
})
export class TestimonialComponent {
  testimonials = [
    {
      title: 'Fantastic Job Done by InfoaidTech',
      message:
        'Their dedication and professionalism are truly commendable. We are extremely satisfied with their services and look forward to working with them again in the future. Highly recommended!',
      author: 'Steve Prosser',
    },
    {
      title: 'Highly Professional Team',
      message:
        'Working with InfoAidTech has been a pleasure. Their expertise and communication made the project smooth from start to finish.',
      author: 'Maria Lopez',
    },
  ];
}
