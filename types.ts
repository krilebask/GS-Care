
export enum ServiceType {
  MESS = 'Mess',
  KRP = 'KRP',
  MAINTENANCE = 'Maintenance'
}

export enum SubMenu {
  DASHBOARD = 'Dashboard',
  REQUEST = 'Request'
}

export enum RequestStatus {
  REQUESTED = 'Requested',
  ON_PROGRESS = 'On Progress',
  PENDING = 'Pending',
  CLOSE = 'Close'
}

export interface BaseRequest {
  id: string;
  type: ServiceType;
  status: RequestStatus;
  createdAt: string;
  function: string;
}

export interface MessRequest extends BaseRequest {
  location: 'Banjarbaru' | 'Batu Butok' | 'Long Ikis' | 'Tanjung';
  guestName: string;
  roomCount: number;
  requesterName: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface KRPRequest extends BaseRequest {
  passengerName: string;
  passengerCount: number;
  passengerPhone: string;
  departureDate: string;
  departureTime: string;
  isRoundTrip: boolean;
  returnDate?: string;
  returnTime?: string;
}

export interface MaintenanceRequest extends BaseRequest {
  category: 'Fasilitas Umum' | 'Electrical maintenance' | 'Civil Maintenance' | 'AC Maintenance' | 'House Keeping';
  requesterName: string;
  requesterPhone: string;
  workDate: string;
  detail: string;
}

export type AnyRequest = MessRequest | KRPRequest | MaintenanceRequest;
