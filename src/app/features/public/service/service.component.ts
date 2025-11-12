import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutSection } from '../../../shared/components/template/about-section.component';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";
import { ServiceCardComponent } from '../../../shared/components/template/cards/service-card.component';
import { DataService } from '../../../../assets/data/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-service',
  imports: [CommonModule, UpperSectionComponent, ServiceCardComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent implements OnInit {
  services$!: Observable<any[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.services$ = this.dataService.getOurServiceData();
  }
}
