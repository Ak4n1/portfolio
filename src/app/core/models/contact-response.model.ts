export interface ContactResponse {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress: string;
    country: string;
    countryCode: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    read: boolean;
    createdAt: string;
}
