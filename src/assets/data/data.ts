import { Injectable } from '@angular/core';
import { LanguageService } from '../../app/shared/services/language/lang.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _chooseUsData = new BehaviorSubject<any[]>([]);
  private _aboutUsData = new BehaviorSubject<any[]>([]);
  private _ourServiceData = new BehaviorSubject<any[]>([]);
  private _ourTechnologyData = new BehaviorSubject<any[]>([]);

  constructor(private langService: LanguageService) {
    combineLatest([this.langService.isLoaded$, this.langService.lang$])
      .pipe(
        filter(([isLoaded, lang]) => isLoaded && Object.keys(lang).length > 0)
      )
      .subscribe(() => {
        this._chooseUsData.next(this.initializeChooseUsData());
        this._aboutUsData.next(this.initializeAboutUsData());
        this._ourServiceData.next(this.initializeOurServiceData());
        this._ourTechnologyData.next(this.initializeOurTechnologyData());
      });
  }

  private initializeChooseUsData(): any[] {
    return [
      {
        icon: 'fa-duotone fa-solid fa-bullseye',
        title: this.langService.lang.bestStrategy,
        description:
          this.langService.lang
            .unlockSuccessWithEaseWhetherYoureStartingOutOrLookingToGrowWeveGotYouCoveredWithOurExpertGuidanceAndPersonalizedSolutionsReachingYourGoalsHasNeverBeenSimpler,
      },
      {
        icon: 'fa-duotone fa-solid fa-people-group',
        title: this.langService.lang.teamWork,
        description:
          this.langService.lang
            .unlockSuccessWithEaseWhetherYoureStartingOutOrLookingToGrowWeveGotYouCovered,
      },
      {
        icon: 'fa-duotone fa-solid fa-business-time',
        title: this.langService.lang.saveYourTime,
        description:
          this.langService.lang
            .weKnowYourTimeIsPreciousWithUsYouCanBreatheEasyOurSimpleYetEffectiveSolutionsAndSmoothProcessesLetYouConcentrateOnWhatTrulyCountsWhileWeHandleTheRest,
      },
      {
        icon: 'fa-duotone fa-solid fa-hand-holding-dollar',
        title: this.langService.lang.affordablePriceForYou,
        description:
          this.langService.lang
            .enjoyQualityServicesAtAnAffordablePriceWePrioritizeDeliveringValueToOurCustomersWithoutCompromisingOnQuality,
      },
    ];
  }

  private initializeAboutUsData(): any[] {
    return [
      {
        icon: 'fa-duotone fa-solid fa-bolt',
        title: this.langService.lang.boostYourWebsiteForBetterResults,
        description:
          this.langService.lang
            .ourStrategiesOptimizeYourWebsitesPerformanceAndDesignToAttractMoreVisitorsAndConvertThemIntoCustomers,
      },
      {
        icon: 'fa-duotone fa-solid fa-hand-fist',
        title: this.langService.lang.buildAStrongerBrand,
        description:
          this.langService.lang
            .weHelpYouCraftACompellingBrandIdentityThatResonatesWithYourTargetAudienceAndSetsYouApartFromTheCompetition,
      },
      {
        icon: 'fa-duotone fa-solid fa-people-arrows',
        title: this.langService.lang.elevateYourSocialMediaPresence,
        description:
          this.langService.lang
            .ourSocialMediaExpertiseEnsuresYourBrandConnectsWithAWiderAudienceBuildingALoyalCommunityAndDrivingEngagement,
      },
    ];
  }

  private initializeOurServiceData(): any[] {
    return [
      {
        icon: '',
        title: 'Web Development',
        description:
          'We craft scalable, high-performance websites using modern frameworks and clean code. From responsive landing pages to complex web applications, we build solutions that deliver fast performance, seamless UX, and long-term value for your business.',
        id: 1,
      },
      {
        icon: '',
        title: 'Website Design (UI/UX)',
        description:
          'We design clean, intuitive interfaces that enhance user experience and drive engagement. By blending creativity with usability, we deliver visually compelling and conversion-focused designs tailored to your brand.',
        id: 2,
      },
      {
        icon: '',
        title: 'WordPress Development',
        description:
          "We build dynamic, easy-to-manage websites using WordPress and Elementor. Whether it's a corporate site or an online store, we create SEO-optimized, mobile-responsive WordPress solutions tailored to your business needs.",
        id: 3,
      },
      {
        icon: '',
        title: 'eCommerce Development',
        description:
          'We develop secure, user-friendly eCommerce platforms that convert. From Shopify to WooCommerce or custom-built stores, we deliver scalable solutions with seamless checkout, payment integration, and inventory management.',
        id: 4,
      },
      {
        icon: '',
        title: 'Search Engine Optimization (SEO)',
        description:
          'We boost your online visibility with data-driven SEO strategies. From keyword research to technical SEO and content optimization, we help you rank higher, drive organic traffic, and grow your customer base.',
        id: 5,
      },
      {
        icon: '',
        title: 'Digital Marketing',
        description:
          'We create results-driven digital marketing campaigns that amplify your online presence. Using PPC, content marketing, email, and analytics, we help you attract, engage, and convert your target audience efficiently.',
        id: 6,
      },
      {
        icon: '',
        title: 'Mobile App Development',
        description:
          'We build high-performance mobile apps for iOS and Android using native and cross-platform technologies. Our apps are designed for usability, speed, and scalability — delivering seamless experiences to your users.',
        id: 7,
      },
      {
        icon: '',
        title: 'Social Media Management (SMM)',
        description:
          'We manage and grow your social presence through strategy, content, and engagement. From content planning to analytics, we help build your brand and connect with your audience across all major platforms.',
        id: 8,
      },
      {
        icon: '',
        title: 'Custom Software Development',
        description:
          'We deliver tailored software solutions that solve real business problems. Whether it’s a CRM, dashboard, or automation tool, we build secure, scalable products aligned with your workflow and goals.',
        id: 9,
      },
      {
        icon: '',
        title: 'API Development & Integration',
        description:
          'We develop and integrate robust APIs that connect your systems and streamline operations. From third-party services to custom back-end integrations, we ensure secure, efficient, and scalable communication between apps.',
        id: 10,
      },
      {
        icon: '',
        title: 'Cybersecurity Services',
        description:
          'We protect your digital assets with end-to-end cybersecurity solutions. From penetration testing to data encryption and threat monitoring, we help secure your systems and build customer trust.',
        id: 11,
      },
      {
        icon: '',
        title: 'Cloud Services & DevOps',
        description:
          'We deploy, scale, and manage cloud infrastructure using AWS, Azure, and Google Cloud. Our DevOps experts implement CI/CD pipelines and automation for fast, secure, and reliable software delivery.',
        id: 12,
      },
      // {
      //   icon: '',
      //   title: 'Software Testing & QA',
      //   description:
      //     'We ensure your software is bug-free, fast, and reliable. Our QA team conducts rigorous manual and automated testing to catch issues early and deliver seamless user experiences across devices and platforms.',
      //   id: 13,
      // },
      // {
      //   icon: '',
      //   title: 'Maintenance & Support',
      //   description:
      //     'We offer proactive maintenance and support to keep your website or app running smoothly. From bug fixes to performance updates, we ensure your digital products remain secure, updated, and optimized.',
      //   id: 14,
      // },
      // {
      //   icon: '',
      //   title: 'Data Analytics & Business Intelligence (BI)',
      //   description:
      //     'We transform raw data into business insights using advanced analytics and dashboards. Our BI solutions help you track KPIs, identify trends, and make data-driven decisions that fuel growth.',
      //   id: 15,
      // },

      //   {
      //     icon: '',
      //     title: this.langService.lang.design,
      //     description:
      //       this.langService.lang
      //         .weCraftIntuitiveUserCenteredDesignsThatElevateDigitalExperiencesAndVisuallyBringYourBrandToLifeOurExpertiseSpansUIUXGraphicDesignBrandingAndPrototypingToEnsureEveryInteractionFeelsSeamlessAndImpactful,
      //         id: 1
      //   },
      //   {
      //     icon: '',
      //     title: this.langService.lang.development,
      //     description:
      //       this.langService.lang
      //         .weBuildScalableHighPerformanceSolutionsTailoredToYourBusinessNeedsFromWebAndMobileAppDevelopmentToWordPressElementorAndCustomSoftwareWeDeliverReliableFutureReadyProductsThatDriveGrowth,
      //  id:2
      //       },
      //   {
      //     icon: '',
      //     title: this.langService.lang.management,
      //     description:
      //       this.langService.lang
      //         .weManageProjectsWithPrecisionEnsuringSmoothExecutionTimelyDeliveryAndSeamlessCollaborationOurServicesIncludeProjectManagementProductManagementAgileDeliveryAndResourceManagement,
      //  id:3 },
      //   {
      //     icon: '',
      //     title: this.langService.lang.marketing,
      //     description:
      //       this.langService.lang
      //         .ourDataDrivenMarketingSolutionsAreDesignedToBoostEngagementDriveTrafficAndGrowYourBrandWeSpecializeInSEOSocialMediaContentWritingEmailMarketingAndPaidAdsThatDeliverMeasurableResults,
      //   id:4},
      //   {
      //     icon: '',
      //     title: this.langService.lang.sharing,
      //     description:
      //       this.langService.lang
      //         .weEnableEffortlessContentAndDataSharingAcrossPlatformsEmpoweringCollaborationAndReachOurServicesIncludeCloudSharingSocialMediaSharingContentDistributionAndDataIntegration,
      //   id:5},
      //   {
      //     icon: '',
      //     title: this.langService.lang.security,
      //     description:
      //       this.langService.lang
      //         .protectYourDigitalAssetsWithAdvancedSecurityMeasuresThatEnsureComplianceAndResilienceWeProvideDataEncryptionNetworkSecurityComplianceAuditsAndThreatMonitoring,
      //  id:6 },
      //   {
      //     icon: '',
      //     title: this.langService.lang.strategy,
      //     description:
      //       this.langService.lang
      //         .weHelpBusinessesAlignGoalsWithInnovationThroughActionableStrategiesThatFuelLongTermSuccessOurFocusAreasIncludeBusinessStrategyDigitalTransformationGoToMarketAndInnovationStrategy,
      //  id:7 },
    ];
  }

  private initializeOurTechnologyData(): any[] {
    return [
      {
        name: 'React',
        icon: 'assets/icons/react.svg',
        color: '97, 218, 251',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(97, 218, 251, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(97, 218, 251, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Vue.js',
        icon: 'assets/icons/vue-dot-js.svg',
        color: '65, 184, 131',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(65, 184, 131, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(65, 184, 131, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Angular',
        icon: 'assets/icons/angular.svg',
        color: '221, 0, 49',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(221, 0, 49, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(221, 0, 49, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Django',
        icon: 'assets/icons/django.svg',
        color: '9, 46, 32',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(12, 74, 110, 0.2) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(9, 46, 32, 0.15) 0%, transparent 50%)'
      },
      {
        name: 'React Native',
        icon: 'assets/icons/react-native.svg',
        color: '97, 218, 251',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(97, 218, 251, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(136, 146, 255, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Next.js',
        icon: 'assets/icons/nextjs.svg',
        color: '255, 255, 255',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(100, 100, 100, 0.12) 0%, transparent 50%)'
      },
      {
        name: 'FastAPI',
        icon: 'assets/icons/fastapi.svg',
        color: '0, 150, 136',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(0, 150, 136, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(5, 205, 153, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'jQuery',
        icon: 'assets/icons/jquery.svg',
        color: '0, 101, 166',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(0, 101, 166, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(19, 147, 217, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Node.js',
        icon: 'assets/icons/nodejs.svg',
        color: '104, 160, 99',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(104, 160, 99, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(104, 160, 99, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Ruby On Rails',
        icon: 'assets/icons/rubyonrails.svg',
        color: '204, 0, 0',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(204, 0, 0, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(255, 77, 77, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'WordPress',
        icon: 'assets/icons/wordpress.svg',
        color: '33, 117, 155',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(33, 117, 155, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(33, 117, 155, 0.1) 0%, transparent 50%)'
      },
      {
        name: 'Shopify',
        icon: 'assets/icons/shopify.svg',
        color: '150, 184, 62',
        bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(150, 184, 62, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(150, 184, 62, 0.1) 0%, transparent 50%)'
      }
    ];
  }

  getChooseUsData(): Observable<any[]> {
    return this._chooseUsData.asObservable();
  }

  getAboutUsData(): Observable<any[]> {
    return this._aboutUsData.asObservable();
  }

  getOurServiceData(): Observable<any[]> {
    return this._ourServiceData.asObservable();
  }

  getOurTechnologyData(): Observable<any[]> {
    return this._ourTechnologyData.asObservable();
  }
}
