import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, of } from 'rxjs';

export interface GA4DailyPoint {
  rawDate: string;
  date: string;
  views: number;
  users: number;
  engagementRate?: number;
}

export interface GA4TopPage {
  rank: number;
  title: string;
  views: number;
}

export interface GA4TrafficSource {
  source: string;
  users: number;
  views: number;
  percentage: number;
}

export interface GA4AnalyticsOverview {
  success: boolean;
  configured: boolean;
  propertyId: string;
  clientEmail?: string;
  status: string;
  message?: string;
  hint?: string;
  data?: {
    period: string;
    totalViews: string;
    totalViewsExact?: number;
    activeUsers: number;
    engagementRate: string;
    dailyTrajectory: GA4DailyPoint[];
    topPages: GA4TopPage[];
    trafficSources: GA4TrafficSource[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/analytics`;

  getOverview(): Observable<GA4AnalyticsOverview> {
    return this.http.get<GA4AnalyticsOverview>(`${this.apiUrl}/overview`).pipe(
      catchError(() =>
        of({
          success: false,
          configured: false,
          propertyId: '483080897',
          status: 'network_error',
          data: {
            period: 'Last 30 Days',
            totalViews: '0',
            activeUsers: 0,
            engagementRate: '0.0%',
            dailyTrajectory: [],
            topPages: [],
            trafficSources: [],
          },
        })
      )
    );
  }
}
