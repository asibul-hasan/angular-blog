// service-card.component.ts (unchanged)
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-section-card',
  template: `
    <div
      class="rounded-2xl w-full bg-white/10 backdrop-blur-md border border-white/30 shadow-lg p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 flex flex-col h-full"
    >
      <div
        class="w-20 h-20 bg-[#f76179] rounded-full absolute -right-5 -top-7 flex items-center justify-center"
      >
        <p class="text-white text-2xl font-bold">{{ id }}</p>
      </div>
      <h3 class="font-bold text-white text-xl mb-2">{{ title }}</h3>
      <p class="text-sm text-zinc-500 leading-6 mb-4 flex-grow">
        {{ description }}
      </p>
      <button
        class="mt-auto px-4 py-2 bg-[#f76179] text-white rounded-md hover:bg-[#1e3e62] transition-colors duration-300"
      >
        Read More
      </button>
    </div>
  `,
})
export class ServiceCardComponent {
  @Input() icon: string = '';
  @Input() title: string = 'Service Title';
  @Input() description: string = 'Service description goes here.';
  @Input() id: number = 1;
}
