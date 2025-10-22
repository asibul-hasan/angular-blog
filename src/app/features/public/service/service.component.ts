import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutSection } from '../../../shared/components/template/about-section.component';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";

@Component({
  selector: 'app-service',
  imports: [UpperSectionComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent { }
