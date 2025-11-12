/**
 * Shared imports aggregator for standalone components.
 *
 * Usage in a standalone component:
 *
 * @Component({
 *   standalone: true,
 *   imports: [ ...SHARED_IMPORTS, SomeOtherModule ],
 *   template: `...`
 * })
 * export class MyStandaloneComponent {}
 *
 * Keep this file small and only include modules that are truly shared across many
 * components. Add feature or UI library modules (PrimeNG, Material, NgZorro)
 * here only if they are used by most standalone components in the app.
 */

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG UI modules commonly used across standalone components
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

// Optional: enable and add other UI library modules here if you want them
// available everywhere. Keep this list minimal to avoid large bundles.

export const SHARED_IMPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    // UI
    ToastModule,
    ButtonModule,
    InputTextModule,
    CardModule,
];

export default SHARED_IMPORTS;
