import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UpperSectionComponent } from '../../../shared/components/template/cards/page-upper-section.component';
import { DataService } from '../../../../assets/data/data';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { Observable } from 'rxjs';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service',
  imports: [AsyncPipe, UpperSectionComponent, RouterLink],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly seo = inject(SeoService);

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
    this.seo.updateTags({
      title: 'Enterprise IT Services & Custom Software Solutions',
      description: 'InfoAidTech delivers end-to-end IT services: custom web and mobile app development, cloud infrastructure, AI integration, and digital consulting.',
      url: 'https://infoaidtech.net/service',
      type: 'website',
      keywords: 'IT services, software development, web development, mobile app development, cloud devops, AI consulting, InfoAidTech services',
    });

    this.seo.addBreadcrumbs([
      { name: 'Home', url: 'https://infoaidtech.net/' },
      { name: 'Services', url: 'https://infoaidtech.net/service' },
    ]);

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'InfoAidTech IT Services & Software Solutions',
      description: 'End-to-end technology services including custom software development, web & mobile app engineering, cloud DevOps, and AI integrations.',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: 'Custom Software Development',
            description: 'Tailored enterprise software, CRMs, automation tools, and workflow systems designed for business scalability.',
            provider: {
              '@type': 'Organization',
              name: 'InfoAidTech',
              url: 'https://infoaidtech.net'
            }
          }
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Web Application Development',
            description: 'High-performance, scalable web apps built with Angular, React, Node.js, and modern cloud architectures.',
            provider: {
              '@type': 'Organization',
              name: 'InfoAidTech',
              url: 'https://infoaidtech.net'
            }
          }
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Mobile App Development',
            description: 'Native and cross-platform mobile apps for iOS and Android using Flutter and React Native.',
            provider: {
              '@type': 'Organization',
              name: 'InfoAidTech',
              url: 'https://infoaidtech.net'
            }
          }
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Service',
            name: 'Cloud Services & DevOps',
            description: 'Cloud architecture, Docker/Kubernetes container orchestration, CI/CD pipeline automation, and AWS infrastructure.',
            provider: {
              '@type': 'Organization',
              name: 'InfoAidTech',
              url: 'https://infoaidtech.net'
            }
          }
        },
        {
          '@type': 'ListItem',
          position: 5,
          item: {
            '@type': 'Service',
            name: 'eCommerce & SME ERP Solutions',
            description: 'Turnkey eCommerce platforms and specialized business management software (Aidly ERP/PMS).',
            provider: {
              '@type': 'Organization',
              name: 'InfoAidTech',
              url: 'https://infoaidtech.net'
            }
          }
        }
      ]
    }, 'services-list');

    this.services$ = this.dataService.getOurServiceData();
  }
}
