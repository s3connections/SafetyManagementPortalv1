export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchParams {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// User types
export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  employeeId: string;
  departmentId: number;
  department?: Department;
  plantId: number;
  plant?: Plant;
  isActive: boolean;
  profileImageUrl?: string;
  lastLoginDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

// Plant & Department types
export interface Plant extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  isActive: boolean;
}

export interface Department extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  plantId: number;
  plant?: Plant;
  managerName?: string;
  managerEmail?: string;
  contactNumber?: string;
  isActive: boolean;
}

// Observation types
export interface IncidentObservation extends BaseEntity {
  title: string;
  description: string;
  observationType: string;
  status: string;
  priority: string;
  reporterId: number;
  reporter?: User;
  assignedToId?: number;
  assignedTo?: User;
  plantId: number;
  plant?: Plant;
  departmentId: number;
  department?: Department;
  location?: string;
  incidentDate: string;
  dueDate?: string;
  completedDate?: string;
  hazardType?: string;
  potentialImpact?: string;
  immediateActions?: string;
  correctiveActions?: string;
  attachments?: ObservationAttachment[];
}

export interface CreateIncidentObservationDto {
  title: string;
  description: string;
  observationType: string;
  priority: string;
  plantId: number;
  departmentId: number;
  location?: string;
  incidentDate: string;
  dueDate?: string;
  hazardType?: string;
  potentialImpact?: string;
  immediateActions?: string;
  assignedToId?: number;
}

export interface UpdateIncidentObservationDto extends Partial<CreateIncidentObservationDto> {
  status?: string;
  correctiveActions?: string;
  completedDate?: string;
}

export interface ObservationAttachment extends BaseEntity {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  observationId: number;
}

// Audit types
export interface Audit extends BaseEntity {
  title: string;
  description?: string;
  auditType: string;
  status: string;
  plantId: number;
  plant?: Plant;
  departmentId: number;
  department?: Department;
  auditorId: number;
  auditor?: User;
  scheduledDate: string;
  startDate?: string;
  completionDate?: string;
  score?: number;
  maxScore?: number;
  findings?: string;
  recommendations?: string;
  priority: string;
}

export interface CreateAuditDto {
  title: string;
  description?: string;
  auditType: string;
  plantId: number;
  departmentId: number;
  auditorId: number;
  scheduledDate: string;
  priority: string;
}

export interface UpdateAuditDto extends Partial<CreateAuditDto> {
  status?: string;
  startDate?: string;
  completionDate?: string;
  score?: number;
  maxScore?: number;
  findings?: string;
  recommendations?: string;
}

// Permit types
export interface Permit extends BaseEntity {
  permitNumber: string;
  title: string;
  description?: string;
  permitType: string;
  requestorId: number;
  requestor?: User;
  plantId: number;
  plant?: Plant;
  departmentId: number;
  department?: Department;
  status: string;
  priority: string;
  requestedDate: string;
  requiredDate?: string;
  approvedDate?: string;
  validFrom?: string;
  validTo?: string;
  approverId?: number;
  approver?: User;
  approvalComments?: string;
  rejectionReason?: string;
  workLocation?: string;
  safetyPrecautions?: string;
  equipmentRequired?: string;
  isEmergency: boolean;
}

export interface CreatePermitDto {
  title: string;
  description?: string;
  permitType: string;
  plantId: number;
  departmentId: number;
  requiredDate?: string;
  workLocation?: string;
  safetyPrecautions?: string;
  equipmentRequired?: string;
  isEmergency: boolean;
  priority: string;
}

export interface UpdatePermitDto extends Partial<CreatePermitDto> {
  status?: string;
  approvalComments?: string;
  rejectionReason?: string;
  validFrom?: string;
  validTo?: string;
}

// Master data types
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  type: string;
  isActive: boolean;
}

export interface Priority extends BaseEntity {
  name: string;
  description?: string;
  color: string;
  sortOrder: number;
}

export interface AuditType extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface PermitType extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

// Notification types
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId: number;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (message: string, type?: NotificationTypes) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export type NotificationTypes = 'success' | 'error' | 'warning' | 'info';

// Form types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

// Statistics types
export interface DashboardStats {
  totalObservations: number;
  openObservations: number;
  overdueObservations: number;
  completedAudits: number;
  pendingPermits: number;
  approvedPermits: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

// Filter types
export interface ObservationFilters {
  status?: string;
  priority?: string;
  observationType?: string;
  plantId?: number;
  departmentId?: number;
  reporterId?: number;
  assignedToId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditFilters {
  status?: string;
  auditType?: string;
  plantId?: number;
  departmentId?: number;
  auditorId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PermitFilters {
  status?: string;
  permitType?: string;
  plantId?: number;
  departmentId?: number;
  requestorId?: number;
  approverId?: number;
  dateFrom?: string;
  dateTo?: string;
  isEmergency?: boolean;
}

// Table types
export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => string;
  sortable?: boolean;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  pagination?: {
    page: number;
    rowsPerPage: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
  };
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: any) => void;
  actions?: Array<{
    label: string;
    icon?: string;
    onClick: (row: any) => void;
    disabled?: (row: any) => boolean;
  }>;
}

// Dialog types
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Theme types
export interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

// File upload types
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: FileList) => void;
  loading?: boolean;
  error?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress?: number;
}

// Settings types
export interface AppSettings {
  companyName: string;
  timezone: string;
  dateFormat: string;
  slaSettings: {
    observationResponseHours: number;
    auditCompletionDays: number;
    permitApprovalHours: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
  };
  security: {
    passwordExpireDays: number;
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Export utility type
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Partial<T> = {
  [P in keyof T]?: T[P];
};