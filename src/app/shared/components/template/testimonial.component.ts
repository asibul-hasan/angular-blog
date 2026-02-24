import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative bg-black text-white overflow-hidden py-24 md:py-32 border-y border-white/[0.06]">
      <div class="pointer-events-none absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10" style="background:#5b8cff"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <!-- Section Title -->
          <div class="lg:col-span-5 lg:sticky lg:top-32">
            <div class="space-y-8 pr-4">
              <span class="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-[#5b8cff]">
                <span class="w-2 h-2 rounded-full bg-[#5b8cff] animate-pulse inline-block"></span>
                Testimonials
              </span>

              <h2 class="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter">
                What Clients Say.
              </h2>

              <p class="text-xl text-gray-400 font-medium leading-relaxed">
                At InfoAidTech, we take pride in delivering exceptional service and building lasting relationships with our clients. Your satisfaction is our top priority, and we strive to exceed your expectations every step of the way. Thank you for your kind words!
              </p>
            </div>
          </div>

          <!-- Cards -->
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-6">
              <div
                class="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl hover:bg-white/[0.04] hover:-translate-y-2 hover:border-[#5b8cff]/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(91,140,255,0.2)]"
                *ngFor="let t of testimonials; let i = index"
              >
                <!-- Quote mark overlay -->
                <div class="absolute right-6 top-6 opacity-10">
                   <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                </div>

                <div class="relative z-10 h-full flex flex-col justify-between">
                  <h4 class="text-xl font-black text-white mb-6 pr-8 leading-tight">
                    {{ t.title }}
                  </h4>

                  <p class="text-gray-400 font-medium leading-relaxed mb-10 text-base">
                    "{{ t.message }}"
                  </p>

                  <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p class="text-sm font-bold text-white mb-0.5">{{ t.author }}</p>
                      <p class="text-xs font-bold text-[#5b8cff] tracking-widest uppercase">Valued Client</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
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
