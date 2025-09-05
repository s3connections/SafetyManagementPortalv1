export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T> {
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

// ✅ UPDATED: Observation Types - Now aligned with backend C# enums
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

// ✅ UPDATED: Match backend C# enum values (PascalCase)
export type ObservationType = 'UnsafeAct' | 'UnsafeCondition' | 'NearMiss' | 'GoodPractice';

// ✅ UPDATED: Match backend C# enum values (Resolved → Completed)
export type ObservationStatus = 'Open' | 'InProgress' | 'Completed' | 'Closed' | 'Cancelled';

// ✅ UPDATED: Match backend C# enum values (PascalCase)
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

// ✅ UPDATED: CreateObservationDto to match backend exactly
export interface CreateObservationDto {
  title: string;
  description: string;
  observationType: ObservationType;
  priority: Priority;
  location?: string;
  dueDate?: string;
  reportedByUserId: number; // ✅ FIXED: Match backend property name
  assignedToUserId?: number; // ✅ FIXED: Match backend property name
  plantId?: number;
  departmentId?: number;
}

// ✅ UPDATED: UpdateObservationDto to match backend exactly
export interface UpdateObservationDto {
  title?: string;
  description?: string;
  observationType?: ObservationType;
  priority?: Priority;
  status?: ObservationStatus;
  location?: string;
  dueDate?: string;
  resolutionNotes?: string;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
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
  createdAt: string;
  updatedAt: string;
}

export type PermitType = 'hot_work' | 'confined_space' | 'height_work' | 'electrical' | 'excavation' | 'chemical';
export type PermitStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired' | 'cancelled';

// ✅ UPDATED: Form Data Types to match new backend structure
export interface ObservationFormData {
  title: string;
  description: string;
  observationType: ObservationType;
  priority: Priority;
  location: string;
  dueDate?: string;
  reportedByUserId: number;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
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