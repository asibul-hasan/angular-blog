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
        icon: '',
        title: this.langService.lang.bestStrategy,
        description:
          this.langService.lang
            .unlockSuccessWithEaseWhetherYoureStartingOutOrLookingToGrowWeveGotYouCoveredWithOurExpertGuidanceAndPersonalizedSolutionsReachingYourGoalsHasNeverBeenSimpler,
      },
      {
        icon: '',
        title: this.langService.lang.teamWork,
        description:
          this.langService.lang
            .unlockSuccessWithEaseWhetherYoureStartingOutOrLookingToGrowWeveGotYouCovered,
      },
      {
        icon: '',
        title: this.langService.lang.saveYourTime,
        description:
          this.langService.lang
            .weKnowYourTimeIsPreciousWithUsYouCanBreatheEasyOurSimpleYetEffectiveSolutionsAndSmoothProcessesLetYouConcentrateOnWhatTrulyCountsWhileWeHandleTheRest,
      },
      {
        icon: '',
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
        icon: '',
        title: this.langService.lang.boostYourWebsiteForBetterResults,
        description:
          this.langService.lang
            .ourStrategiesOptimizeYourWebsitesPerformanceAndDesignToAttractMoreVisitorsAndConvertThemIntoCustomers,
      },
      {
        icon: '',
        title: this.langService.lang.buildAStrongerBrand,
        description:
          this.langService.lang
            .weHelpYouCraftACompellingBrandIdentityThatResonatesWithYourTargetAudienceAndSetsYouApartFromTheCompetition,
      },
      {
        icon: '',
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
        title: this.langService.lang.design,
        description:
          this.langService.lang
            .weCraftIntuitiveUserCenteredDesignsThatElevateDigitalExperiencesAndVisuallyBringYourBrandToLifeOurExpertiseSpansUIUXGraphicDesignBrandingAndPrototypingToEnsureEveryInteractionFeelsSeamlessAndImpactful,
      },
      {
        icon: '',
        title: this.langService.lang.development,
        description:
          this.langService.lang
            .weBuildScalableHighPerformanceSolutionsTailoredToYourBusinessNeedsFromWebAndMobileAppDevelopmentToWordPressElementorAndCustomSoftwareWeDeliverReliableFutureReadyProductsThatDriveGrowth,
      },
      {
        icon: '',
        title: this.langService.lang.management,
        description:
          this.langService.lang
            .weManageProjectsWithPrecisionEnsuringSmoothExecutionTimelyDeliveryAndSeamlessCollaborationOurServicesIncludeProjectManagementProductManagementAgileDeliveryAndResourceManagement,
      },
      {
        icon: '',
        title: this.langService.lang.marketing,
        description:
          this.langService.lang
            .ourDataDrivenMarketingSolutionsAreDesignedToBoostEngagementDriveTrafficAndGrowYourBrandWeSpecializeInSEOSocialMediaContentWritingEmailMarketingAndPaidAdsThatDeliverMeasurableResults,
      },
      {
        icon: '',
        title: this.langService.lang.sharing,
        description:
          this.langService.lang
            .weEnableEffortlessContentAndDataSharingAcrossPlatformsEmpoweringCollaborationAndReachOurServicesIncludeCloudSharingSocialMediaSharingContentDistributionAndDataIntegration,
      },
      {
        icon: '',
        title: this.langService.lang.security,
        description:
          this.langService.lang
            .protectYourDigitalAssetsWithAdvancedSecurityMeasuresThatEnsureComplianceAndResilienceWeProvideDataEncryptionNetworkSecurityComplianceAuditsAndThreatMonitoring,
      },
      {
        icon: '',
        title: this.langService.lang.strategy,
        description:
          this.langService.lang
            .weHelpBusinessesAlignGoalsWithInnovationThroughActionableStrategiesThatFuelLongTermSuccessOurFocusAreasIncludeBusinessStrategyDigitalTransformationGoToMarketAndInnovationStrategy,
      },
    ];
  }

  private initializeOurTechnologyData(): any[] {
    return [
      // {
      //   icon: '',
      //   title: this.langService.lang.,
      //   description: this.langService.lang.
      // },
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
