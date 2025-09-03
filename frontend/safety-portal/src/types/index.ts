// Base Types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Search Parameters
export interface SearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// User Types
export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  plantId?: number;
  departmentId?: number;
  isActive: boolean;
  lastLoginAt?: string;
  plant?: Plant;
  department?: Department;
}

export type UserRole = 
  | 'SuperAdmin'
  | 'Admin' 
  | 'SafetyManager'
  | 'SafetyOfficer'
  | 'Supervisor'
  | 'Employee'
  | 'Auditor'
  | 'Approver';

export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  plantId?: number;
  departmentId?: number;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  plantId?: number;
  departmentId?: number;
  isActive?: boolean;
}

// Plant Types
export interface Plant extends BaseEntity {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  departments?: Department[];
}

// Department Types
export interface Department extends BaseEntity {
  name: string;
  code: string;
  plantId: number;
  managerId?: number;
  isActive: boolean;
  plant?: Plant;
  manager?: User;
}

// Hazard Types
export interface HazardCategory extends BaseEntity {
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  hazardTypes?: HazardType[];
}

export interface HazardType extends BaseEntity {
  name: string;
  description?: string;
  hazardCategoryId: number;
  color: string;
  isActive: boolean;
  hazardCategory?: HazardCategory;
}

// Observation Types
export interface Observation extends BaseEntity {
  title: string;
  description: string;
  location: string;
  type: ObservationType;
  priority: Priority;
  status: ObservationStatus;
  plantId: number;
  departmentId: number;
  reporterId: number;
  assignedToId?: number;
  hazardTypeId?: number;
  imageUrl?: string;
  actionTaken?: string;
  resolvedAt?: string;
  plant?: Plant;
  department?: Department;
  reporter?: User;
  assignedTo?: User;
  hazardType?: HazardType;
}

export type ObservationType = 
  | 'UnsafeAct'
  | 'UnsafeCondition'
  | 'NearMiss'
  | 'PositiveObservation'
  | 'Suggestion';

export type ObservationStatus = 
  | 'Open'
  | 'InProgress'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled';

export type Priority = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export interface ObservationDto extends Observation {}

export interface CreateObservationDto {
  title: string;
  description: string;
  location: string;
  type: ObservationType;
  priority: Priority;
  plantId: number;
  departmentId: number;
  reporterId: number;
  assignedToId?: number;
  hazardTypeId?: number;
  imageUrl?: string;
}

export interface UpdateObservationDto {
  title?: string;
  description?: string;
  location?: string;
  type?: ObservationType;
  priority?: Priority;
  status?: ObservationStatus;
  assignedToId?: number;
  hazardTypeId?: number;
  actionTaken?: string;
}

export interface ObservationStatisticsDto {
  totalObservations: number;
  openObservations: number;
  inProgressObservations: number;
  closedObservations: number;
  highPriorityObservations: number;
  mediumPriorityObservations: number;
  lowPriorityObservations: number;
}

// Incident Types
export interface Incident extends BaseEntity {
  title: string;
  description: string;
  location: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  plantId: number;
  departmentId: number;
  reporterId: number;
  assignedToId?: number;
  occurredAt: string;
  injuryCount: number;
  fatalityCount: number;
  propertyDamage: number;
  environmentalImpact?: string;
  immediateAction: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  plant?: Plant;
  department?: Department;
  reporter?: User;
  assignedTo?: User;
}

export type IncidentType = 
  | 'Injury'
  | 'PropertyDamage'
  | 'Environmental'
  | 'Security'
  | 'Quality'
  | 'NearMiss';

export type IncidentSeverity = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export type IncidentStatus = 
  | 'Open'
  | 'UnderInvestigation'
  | 'InProgress'
  | 'Closed';

// Audit Types
export interface Audit extends BaseEntity {
  title: string;
  description: string;
  type: AuditType;
  status: AuditStatus;
  plantId: number;
  departmentId: number;
  auditorId: number;
  scheduledDate: string;
  completedDate?: string;
  score?: number;
  findings?: string;
  recommendations?: string;
  plant?: Plant;
  department?: Department;
  auditor?: User;
}

export type AuditType = 
  | 'Internal'
  | 'External'
  | 'Regulatory'
  | 'SelfAssessment';

export type AuditStatus = 
  | 'Planned'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

// Permit Types
export interface Permit extends BaseEntity {
  permitNumber: string;
  title: string;
  description: string;
  type: PermitType;
  status: PermitStatus;
  plantId: number;
  departmentId: number;
  requestorId: number;
  approverId?: number;
  validFrom: string;
  validTo: string;
  workLocation: string;
  hazards: string[];
  safetyMeasures: string[];
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  plant?: Plant;
  department?: Department;
  requestor?: User;
  approver?: User;
}

export type PermitType = 
  | 'HotWork'
  | 'ConfinedSpace'
  | 'WorkAtHeight'
  | 'Electrical'
  | 'Excavation'
  | 'Radiation'
  | 'Chemical';

export type PermitStatus = 
  | 'Draft'
  | 'Submitted'
  | 'UnderReview'
  | 'Approved'
  | 'Rejected'
  | 'Active'
  | 'Expired'
  | 'Cancelled';

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoHide?: boolean;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationState {
  notifications: Notification[];
}

// Filter Types
export interface ObservationFilters {
  status?: ObservationStatus[];
  type?: ObservationType[];
  priority?: Priority[];
  plantId?: number;
  departmentId?: number;
  reporterId?: number;
  assignedToId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface IncidentFilters {
  status?: IncidentStatus[];
  type?: IncidentType[];
  severity?: IncidentSeverity[];
  plantId?: number;
  departmentId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditFilters {
  status?: AuditStatus[];
  type?: AuditType[];
  plantId?: number;
  departmentId?: number;
  auditorId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PermitFilters {
  status?: PermitStatus[];
  type?: PermitType[];
  plantId?: number;
  departmentId?: number;
  requestorId?: number;
  approverId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'textarea' | 'date' | 'datetime' | 'file' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

// Component Props Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  };
  onRow?: (record: T, index?: number) => React.HTMLAttributes<any>;
}

export interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  width?: string | number;
  height?: string | number;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

// Theme Types
export interface Theme {
  palette: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    error: {
      main: string;
      light: string;
      dark: string;
    };
    warning: {
      main: string;
      light: string;
      dark: string;
    };
    info: {
      main: string;
      light: string;
      dark: string;
    };
    success: {
      main: string;
      light: string;
      dark: string;
    };
    grey: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    body1: any;
    body2: any;
    button: any;
    caption: any;
    overline: any;
  };
  spacing: (factor: number) => number;
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
