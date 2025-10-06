import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-char-count-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <label
        for="{{ controlName }}"
        class="block text-sm font-semibold text-gray-700"
      >
        {{ label }}
      </label>
      <input
        [id]="controlName"
        type="text"
        [formControl]="control"
        [attr.maxlength]="maxLength"
        [placeholder]="placeholder"
        class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 text-sm transition duration-150"
      />
      <div class="flex justify-between items-center mt-1">
        <p *ngIf="helpText" class="text-xs text-gray-500">{{ helpText }}</p>
        <p
          class="text-xs ml-auto font-medium"
          [ngClass]="{ 'text-red-500': currentLength > maxLength }"
        >
          {{ currentLength }} / {{ maxLength }}
        </p>
      </div>
    </div>
  `,
})
export class CharCountInputComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() maxLength: number = 255;
  @Input() placeholder: string = '';
  @Input() helpText: string = '';

  control!: FormControl;
  currentLength: number = 0;

  ngOnInit() {
    this.control = this.parentForm.get(this.controlName) as FormControl;

    // Subscribe to value changes to update the counter
    this.control.valueChanges.subscribe((value: string) => {
      this.currentLength = value ? String(value).length : 0;
    });

    // Set initial length
    this.currentLength = this.control.value
      ? String(this.control.value).length
      : 0;
  }
}
