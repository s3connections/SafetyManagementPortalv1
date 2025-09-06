export * from '../types';

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

// ===================================
// USER TYPES
// ===================================
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  departmentId?: number;
  plantId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'supervisor' | 'employee' | 'auditor' | 'safety_officer';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  departmentId?: number;
  plantId?: number;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  phoneNumber?: string;
  departmentId?: number;
  plantId?: number;
}

// ===================================
// OBSERVATION TYPES
// ===================================
// ✅ FIXED: Match backend enum exactly
export enum ObservationType {
  Safety = 'Safety',
  Environmental = 'Environmental',
  Quality = 'Quality',
  Security = 'Security',
  Other = 'Other'
}

// ✅ FIXED: Match backend enum exactly (includes Resolved)
export enum ObservationStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

// ✅ FIXED: Priority as entity (not enum) - matches backend Priority model
export interface Priority {
  id: number;
  name: string;
  code: string;
  description?: string;
  color: string;
  sortOrder: number;
  slaHours: number;
  isActive: boolean;
}

// ✅ FIXED: Main Observation interface
export interface Observation {
  id: number;
  title: string;
  description: string;
  observationType: ObservationType;
  priority: Priority; // ✅ Full Priority entity
  status: ObservationStatus;
  location?: string;
  ticketNumber: string;
  dueDate?: string;
  completedDate?: string;
  resolutionNotes?: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
  
  // User information
  reportedByUserId: number;
  reportedByUserName: string;
  reportedByUserEmail: string;
  
  assignedToUserId?: number;
  assignedToUserName?: string;
  assignedToUserEmail?: string;
  
  // Plant and Department information
  plantId?: number;
  plantName?: string;
  
  departmentId?: number;
  departmentName?: string;

  // Navigation properties (for components)
  reporter?: User;
  assignedToUser?: User;
  plant?: Plant;
  department?: Department;
}

// ✅ FIXED: CreateObservationDto - EXPORTED and aligned with backend
export interface CreateObservationDto {
  title: string;
  description: string;
  observationType: ObservationType;
  priorityId: number; // ✅ Backend expects Priority ID, not entity
  location?: string;
  dueDate?: string;
  reportedByUserId: number;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
}

export interface UpdateObservationDto {
  title?: string;
  description?: string;
  observationType?: ObservationType;
  priorityId?: number; // ✅ Backend expects Priority ID
  status?: ObservationStatus;
  location?: string;
  dueDate?: string;
  resolutionNotes?: string;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
}

// ✅ FIXED: ObservationFormData with all required properties
export interface ObservationFormData {
  title: string;
  description: string;
  observationType: ObservationType;
  priorityId: number; // ✅ Form uses Priority ID
  location?: string;
  dueDate?: string;
  reportedByUserId: number;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
}

// ✅ ADDED: ObservationData interface for dashboard components
export interface ObservationData {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;
  observationType: ObservationType;
  status: ObservationStatus;
  priority: Priority;
  createdAt: string;
  reporter?: User;
}

// ===================================
// PLANT & DEPARTMENT TYPES
// ===================================
export interface Plant {
  id: number;
  name: string;
  code?: string;
  description?: string;
  location?: string;
  isActive: boolean;
}

export interface Department {
  id: number;
  name: string;
  code?: string;
  description?: string;
  plantId?: number;
  isActive: boolean;
  plant?: Plant;
}

// ===================================
// AUDIT TYPES
// ===================================
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

// ===================================
// PERMIT TYPES
// ===================================
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

// ===================================
// COMMON TYPES
// ===================================
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

// ===================================
// ROUTE CONSTANTS (Added missing routes)
// ===================================
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  SUPERVISOR: 'supervisor' as const,
  EMPLOYEE: 'employee' as const,
  AUDITOR: 'auditor' as const,
  SAFETY_MANAGER: 'safety_officer' as const
};

export const ROUTES = {
  DASHBOARD: '/dashboard',
  OBSERVATIONS: '/observations',
  OBSERVATIONS_CREATE: '/observations/create',
  OBSERVATIONS_DETAIL: '/observations/:id',
  AUDITS: '/audits',
  AUDITS_CREATE: '/audits/create',
  PERMITS: '/permits',
  PERMITS_CREATE: '/permits/create',
  REPORTS: '/reports',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_HIERARCHY: '/admin/hierarchy',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/login',
  LOGOUT: '/logout',
  // ✅ ADDED: Missing routes
  USERS: '/admin/users',
  CREATE_OBSERVATION: '/observations/create',
  CREATE_AUDIT: '/audits/create',
  CREATE_PERMIT: '/permits/create',
  UNAUTHORIZED: '/unauthorized'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];