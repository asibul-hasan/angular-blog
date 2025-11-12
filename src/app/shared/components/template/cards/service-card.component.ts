// service-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-section-card',
  template: `
    <div
      class="group relative rounded-3xl w-full bg-linear-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 shadow-2xl p-8 overflow-hidden transform transition-all duration-500 hover:shadow-[#f76179]/20 hover:-translate-y-3 hover:scale-[1.02] hover:border-[#f76179]/30 flex flex-col h-full"
    >
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-linear-to-br from-[#f76179]/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Floating orb -->
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-[#f76179]/10 rounded-full blur-3xl group-hover:bg-[#f76179]/20 transition-all duration-500"></div>
      
      <!-- ID badge -->
      <div
        class="absolute -right-3 -top-3 w-16 h-16 bg-[#f76179] rounded-full flex items-center justify-center shadow-lg shadow-[#f76179]/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
      >
        <p class="text-white text-xl font-black">{{ id }}</p>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col h-full">
        <h3 class="font-black text-white text-2xl mb-4 leading-tight group-hover:text-[#f76179] transition-colors duration-300">
          {{ title }}
        </h3>
        
        <p class="text-sm text-gray-300 leading-relaxed mb-6 grow">
          {{ description }}
        </p>
        
        <button
          class="mt-auto px-6 py-3 bg-[#f76179] text-white font-semibold rounded-xl hover:bg-[#1e3e62] shadow-lg shadow-[#f76179]/30 hover:shadow-[#1e3e62]/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Learn More
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class ServiceCardComponent {
  @Input() icon: string = '';
  @Input() title: string = 'Service Title';
  @Input() description: string = 'Service description goes here.';
  @Input() id: number = 1;
}
