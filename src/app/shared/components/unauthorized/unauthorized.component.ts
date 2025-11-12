import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p class="text-gray-600 mb-6">
              You don't have permission to access this resource.
            </p>
            <div class="flex justify-center space-x-4">
              <button 
                (click)="goBack()" 
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
              <button 
                (click)="goHome()" 
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
    constructor(private router: Router) { }

    goBack(): void {
        window.history.back();
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}