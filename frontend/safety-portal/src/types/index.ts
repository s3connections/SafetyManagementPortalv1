export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: number;
  plantId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'supervisor' | 'employee' | 'auditor' | 'safety_officer';

// Observation Types
export interface Observation {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  observationType: ObservationType;
  status: ObservationStatus;
  priority: Priority;
  reportedBy: number;
  assignedTo?: number;
  plantId: number;
  departmentId: number;
  location: string;
  hazardCategoryId?: number;
  hazardTypeId?: number;
  imageUrl?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ObservationType = 'unsafe_act' | 'unsafe_condition' | 'near_miss' | 'good_practice';
export type ObservationStatus = 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface CreateObservationDto {
  title: string;
  description: string;
  observationType: ObservationType;
  priority: Priority;
  plantId: number;
  departmentId: number;
  location: string;
  hazardCategoryId?: number;
  hazardTypeId?: number;
  assignedTo?: number;
  dueDate?: string;
}

export interface UpdateObservationDto {
  title?: string;
  description?: string;
  priority?: Priority;
  assignedTo?: number;
  status?: ObservationStatus;
  dueDate?: string;
}

// Audit Types
export interface Audit {
  id: number;
  auditNumber: string;
  title: string;
  description: string;
  auditType: AuditType;
  status: AuditStatus;
  auditorId: number;
  plantId: number;
  departmentId: number;
  scheduledDate: string;
  completedAt?: string;
  findings?: string;
  recommendations?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuditType = 'internal' | 'external' | 'regulatory' | 'management_review';
export type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateAuditDto {
  title: string;
  description: string;
  auditType: AuditType;
  auditorId: number;
  plantId: number;
  departmentId: number;
  scheduledDate: string;
}

export interface UpdateAuditDto {
  title?: string;
  description?: string;
  auditorId?: number;
  scheduledDate?: string;
  status?: AuditStatus;
  findings?: string;
  recommendations?: string;
}

// Permit Types
export interface Permit {
  id: number;
  permitNumber: string;
  title: string;
  description: string;
  permitType: PermitType;
  status: PermitStatus;
  requestorId: number;
  approverId?: number;
  plantId: number;
  departmentId: number;
  startDate: string;
  endDate: string;
  hazardAssessment: string;
  controlMeasures: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type PermitType = 'hot_work' | 'confined_space' | 'height_work' | 'electrical' | 'excavation' | 'chemical';
export type PermitStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired' | 'cancelled';

export interface CreatePermitDto {
  title: string;
  description: string;
  permitType: PermitType;
  plantId: number;
  departmentId: number;
  startDate: string;
  endDate: string;
  hazardAssessment: string;
  controlMeasures: string;
}

export interface UpdatePermitDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  hazardAssessment?: string;
  controlMeasures?: string;
  status?: PermitStatus;
}

// Common Filter Types
export interface SearchFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  plantId?: number;
  departmentId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Statistics Types
export interface ObservationStatisticsDto {
  totalObservations: number;
  openObservations: number;
  completedObservations: number;
  overdueObservations: number;
  observationsByType: Record<ObservationType, number>;
  observationsByStatus: Record<ObservationStatus, number>;
  observationsByPriority: Record<Priority, number>;
}

export interface AuditStatisticsDto {
  totalAudits: number;
  completedAudits: number;
  scheduledAudits: number;
  overdueAudits: number;
  auditsByType: Record<AuditType, number>;
  auditsByStatus: Record<AuditStatus, number>;
}

export interface PermitStatisticsDto {
  totalPermits: number;
  activePermits: number;
  expiredPermits: number;
  rejectedPermits: number;
  permitsByType: Record<PermitType, number>;
  permitsByStatus: Record<PermitStatus, number>;
}