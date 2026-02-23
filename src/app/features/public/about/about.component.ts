import {
  ChangeDetectionStrategy, Component, inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UpperSectionComponent } from '../../../shared/components/template/cards/page-upper-section.component';
import { TestimonialComponent } from '../../../shared/components/template/testimonial.component';
import { SeoService } from '../../../shared/services/seo/seo.service';

@Component({
  selector: 'app-about',
  imports: [UpperSectionComponent, TestimonialComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  // ── Stats bar ──────────────────────────────────────────────────
  readonly stats = [
    { value: '120+', label: 'Projects Shipped',   color1: '#f76179', color2: '#c0365a' },
    { value: '50+',  label: 'Happy Clients',      color1: '#6366f1', color2: '#8b5cf6' },
    { value: '20+',  label: 'Team Members',       color1: '#10b981', color2: '#059669' },
    { value: '5yr',  label: 'Years of Excellence', color1: '#f59e0b', color2: '#d97706' },
  ];

  // ── Timeline ───────────────────────────────────────────────────
  readonly milestones = [
    {
      year: '2019', icon: '🚀',
      title: 'Company Founded',
      desc: 'Three engineers left their corporate jobs and founded InfoAidTech from a small office in Dhaka with a single client and a bold vision.',
    },
    {
      year: '2020', icon: '📈',
      title: 'First 10 Clients',
      desc: 'Despite the pandemic, we onboarded 10 clients across 4 countries by pivoting quickly to remote collaboration.',
    },
    {
      year: '2021', icon: '🌐',
      title: 'Global Expansion',
      desc: 'Partnerships signed with agencies in the UK, Canada, and Australia. Team doubled to 10 full-time engineers.',
    },
    {
      year: '2022', icon: '🏆',
      title: 'Recognized for Excellence',
      desc: 'Delivered 50+ projects and received multiple 5-star reviews on Clutch and GoodFirms.',
    },
    {
      year: '2023', icon: '🤖',
      title: 'AI Practice Launched',
      desc: 'Dedicated AI/ML division formed to help clients integrate intelligent automation into their workflows.',
    },
    {
      year: '2024', icon: '🎓',
      title: 'InfoAidTech Academy',
      desc: 'Launched our tech education blog and internship program, training the next generation of Bangladeshi developers.',
    },
  ];

  // ── Core Values ────────────────────────────────────────────────
  readonly coreValues = [
    {
      emoji: '🏆', title: 'Excellence',
      desc: 'We hold ourselves to the highest standards in every line of code and every client interaction.',
      glow:  'rgba(247,97,121,0.08)', bg: 'linear-gradient(135deg,#f76179,#c0365a)',
      bar1: '#f76179', bar2: '#c0365a',
    },
    {
      emoji: '🤝', title: 'Integrity',
      desc: 'Honest communication, transparent processes, and keeping every promise we make.',
      glow:  'rgba(99,102,241,0.08)', bg: 'linear-gradient(135deg,#6366f1,#4338ca)',
      bar1: '#6366f1', bar2: '#4338ca',
    },
    {
      emoji: '🚀', title: 'Innovation',
      desc: 'We constantly explore new technologies to solve complex problems in smarter ways.',
      glow:  'rgba(16,185,129,0.08)', bg: 'linear-gradient(135deg,#10b981,#059669)',
      bar1: '#10b981', bar2: '#059669',
    },
    {
      emoji: '🌱', title: 'Growth',
      desc: 'We grow alongside our clients, investing in education, mentorship, and continuous improvement.',
      glow:  'rgba(245,158,11,0.08)', bg: 'linear-gradient(135deg,#f59e0b,#d97706)',
      bar1: '#f59e0b', bar2: '#d97706',
    },
  ];

  // ── Team ───────────────────────────────────────────────────────
  readonly team = [
    {
      initials: 'AR', name: 'Asibul Rahman', role: 'Founder & CEO',
      bio: 'Visionary leader with 10+ years in software development and digital strategy.',
      gradient: 'linear-gradient(135deg,#f76179 0%,#1e3e62 100%)',
    },
    {
      initials: 'SM', name: 'Sarah Mohammed', role: 'Lead Developer',
      bio: 'Full-stack expert specializing in Angular, Node.js, and cloud architectures.',
      gradient: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
    },
    {
      initials: 'KH', name: 'Karim Hassan', role: 'UI/UX Designer',
      bio: 'Design-first thinker crafting beautiful, accessible, user-centered interfaces.',
      gradient: 'linear-gradient(135deg,#10b981 0%,#059669 100%)',
    },
    {
      initials: 'NA', name: 'Nadia Ahmed', role: 'Project Manager',
      bio: 'Scrum master ensuring projects ship on time, within scope, and on budget.',
      gradient: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
    },
  ];

  // ── Technology marquee rows ─────────────────────────────────────
  readonly techRow1 = [
    'Angular', 'React', 'Vue.js', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Python', 'Django', 'FastAPI', 'GraphQL',
  ];
  readonly techRow2 = [
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Flutter', 'React Native', 'TailwindCSS',
  ];

  constructor() {
    const origin = isPlatformBrowser(this.platformId) ? window.location.origin : '';
    this.seo.updateTags({
      title: 'About InfoAidTech — Innovative IT & Digital Solutions Agency',
      description: 'InfoAidTech is a leading IT and digital agency providing custom software development, web & app solutions, and digital marketing services to help businesses grow.',
      image: 'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: origin,
      type: 'website',
    });
  }
}
