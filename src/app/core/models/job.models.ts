export interface JobOfferDto {
  id: string;
  title: string;
  company: string | null;
  url: string | null;
  source: string;
  location: string | null;
  date: string | null;
  tags: string[] | null;
  salary: string | null;
  description: string | null;
}

export interface ProfileSkillRequest {
  name: string;
  category?: string | null;
  sortOrder?: number | null;
}

export interface ProfileSkillResponse {
  id: number;
  name: string;
  category: string | null;
  sortOrder: number | null;
  createdAt: string;
}

export interface AlertRuleRequest {
  name: string;
  active: boolean;
  keywords: string[];
}

export interface AlertRuleResponse {
  id: number;
  name: string;
  active: boolean;
  keywords: string[];
  createdAt: string;
}

export interface JobSettingsRequest {
  alertIntervalHours: number;
  filterCountry?: string;
  filterLanguage?: string;
  filterSource?: string;
}

export interface JobSettingsResponse {
  alertIntervalHours: number;
  filterCountry?: string;
  filterLanguage?: string;
  filterSource?: string;
}

export interface JobSearchRunResponse {
  id: number;
  runAt: string;
  offersFound: number;
  offersSent: number;
  emailSent: boolean;
}

export interface SearchNowResponse {
  offersFound: number;
  newOffers: number;
  emailSent: boolean;
  message: string;
  offers: JobOfferDto[];
}
