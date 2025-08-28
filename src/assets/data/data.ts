import { Injectable } from '@angular/core';
import { LanguageService } from '../../app/shared/services/language/lang.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private chooseUsData: any[];
  private aboutUsData: any[];
  private ourServiceData: any[];
  private ourTechnologyData: any[];

  constructor(public langService: LanguageService) {
    this.chooseUsData = [
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

    this.aboutUsData = [
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
    this.ourServiceData = [
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
    this.ourTechnologyData = [
      // {
      //   icon: '',
      //   title: this.langService.lang.,
      //   description: this.langService.lang.
      // },
    ];
  }

  // Optionally, provide getters if you need access outside:
  getChooseUsData() {
    return this.chooseUsData;
  }

  getAboutUsData() {
    return this.aboutUsData;
  }

  getOurServiceData() {
    return this.ourServiceData;
  }

  getOurTechnologyData() {
    return this.ourTechnologyData;
  }
}
