export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee', 
  SAFETY_OFFICER = 'Safety_Officer',
  MANAGEMENT = 'Management',
  RESPONSIBLE_ENGINEER = 'Responsible_Engineer',
  CONTRACT_USER = 'Contract_User',
  HEAD_OF_DEPARTMENT = 'Head_of_Department',
  PERMIT_INITIATOR = 'Permit_Initiator',
  SHIFT_INCHARGE = 'Shift_Incharge',
  MEDICAL_OFFICER = 'Medical_Officer',
  INVESTIGATION_OFFICER = 'Investigation_Officer',
  PRESIDING_OFFICER = 'Presiding_Officer'
}

export interface User {
  id: number;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserRole;
  plantId?: number;
  departmentId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plant {
  id: number;
  name: string;
  code: string;
  location: string;
  isActive: boolean;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  plantId: number;
  isActive: boolean;
}

// Observation Types
export enum ObservationType {
  UNSAFE_ACT = 'Unsafe_Act',
  UNSAFE_CONDITION = 'Unsafe_Condition',
  WORK_STOPPAGE = 'Work_Stoppage', 
  NEAR_MISS = 'Near_Miss',
  GOOD_PRACTICE = 'Good_Practice'
}

export enum ObservationStatus {
  OPEN = 'Open',
  RE_ASSIGNED = 'Re_Assigned',
  UNSATISFIED = 'Unsatisfied',
  CLOSED = 'Closed',
  WRONGLY_ASSIGNED = 'Wrongly_Assigned'
}

export enum ObservationStage {
  OPEN = 'Open',
  IN_PROGRESS = 'In_Progress',
  CLOSED = 'Closed',
  RE_OPENED = 'Re_opened'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium', 
  LOW = 'Low'
}

export interface Observation {
  id: number;
  ticketNumber: string;
  observationType: ObservationType;
  hazardType?: string;
  priority: Priority;
  stage: ObservationStage;
  status: ObservationStatus;
  description: string;
  location: string;
  plantId: number;
  departmentId: number;
  reportedBy: number;
  assignedTo?: number;
  observationImages?: string[];
  resolutionImages?: string[];
  resolutionRemarks?: string;
  slaDeadline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Audit Types  
export enum AuditStatus {
  PENDING = 'AUDIT_PENDING',
  IN_PROGRESS = 'AUDIT_IN_PROGRESS', 
  COMPLETED = 'AUDIT_COMPLETED',
  CLOSED = 'AUDIT_CLOSED'
}

export interface Audit {
  id: number;
  auditNumber: string;
  auditType: string;
  departmentId: number;
  plantId: number;
  auditorId: number;
  status: AuditStatus;
  scheduledDate: string;
  completedDate?: string;
  score?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Permit Types
export enum PermitStatus {
  SUBMITTED = 'SUBMITTED',
  HOD_APPROVED = 'HOD_APPROVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface Permit {
  id: number;
  permitNumber: string;
  permitTemplateId: number;
  workDescription: string;
  startDateTime: string;
  endDateTime: string;
  equipmentInvolved?: string;
  initiatedById: number;
  status: PermitStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Investigation Types
export enum InvestigationStage {
  WORK_SLIP = 'WORK_SLIP',
  FIR = 'FIR', 
  INVESTIGATION = 'INVESTIGATION',
  CASE_CLOSED = 'CASE_CLOSED'
}

export interface Investigation {
  id: number;
  investigationNumber: string;
  employeeId: string;
  incidentDate: string;
  incidentType: string;
  reportedById: number;
  plantId: number;
  stage: InvestigationStage;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
