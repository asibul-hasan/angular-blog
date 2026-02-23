import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UpperSectionComponent } from '../../../shared/components/template/cards/page-upper-section.component';
import { DataService } from '../../../../assets/data/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-service',
  imports: [AsyncPipe, UpperSectionComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceComponent implements OnInit {
  private readonly dataService = inject(DataService);

  services$!: Observable<any[]>;

  readonly processSteps = [
    { step: 1, title: 'Discovery', desc: 'We understand your goals, users, and constraints.' },
    { step: 2, title: 'Design', desc: 'We prototype and validate the right solution.' },
    { step: 3, title: 'Build', desc: 'Agile sprints deliver quality code, fast.' },
    { step: 4, title: 'Launch', desc: 'We deploy, monitor, and support your product.' },
  ];

  readonly technologies = [
    'Angular', 'React', 'Vue.js', 'Node.js', 'NestJS', 'Python', 'Django',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'AWS', 'Docker', 'Kubernetes',
    'TypeScript', 'GraphQL', 'REST APIs', 'Flutter', 'React Native', 'TailwindCSS',
  ];

  ngOnInit(): void {
    this.services$ = this.dataService.getOurServiceData();
  }
}
