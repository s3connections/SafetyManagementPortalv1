export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// User Types
export enum UserRole {
  ADMIN = 'Admin',
  SAFETY_MANAGER = 'Safety_Manager',
  SAFETY_OFFICER = 'Safety_Officer',
  RESPONSIBLE_ENGINEER = 'Responsible_Engineer',
  EMPLOYEE = 'Employee'
}

export interface User {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userType: UserRole;
  departmentId?: number;
  plantId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  plant?: Plant;
}

// Plant and Department Types (with code property)
export interface Plant {
  id: number;
  name: string;
  code: string;
  location: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  plantId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  plant?: Plant;
}

// Observation Types
export enum ObservationType {
  UNSAFE_ACT = 'Unsafe_Act',
  UNSAFE_CONDITION = 'Unsafe_Condition',
  WORK_STOPPAGE = 'Work_Stoppage',
  NEAR_MISS = 'Near_Miss',
  GOOD_PRACTICE = 'Good_Practice'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum ObservationStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In_Progress',
  UNDER_REVIEW = 'Under_Review',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled'
}

export enum ObservationStage {
  REPORTED = 'Reported',
  INVESTIGATING = 'Investigating',
  ACTION_PLANNING = 'Action_Planning',
  IMPLEMENTATION = 'Implementation',
  VERIFICATION = 'Verification',
  CLOSED = 'Closed'
}

export interface HazardType {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Observation {
  id: number;
  ticketNumber: string;
  observationType: ObservationType;
  priority: Priority;
  status: ObservationStatus;
  stage: ObservationStage;
  description: string;
  location: string;
  plantId: number;
  departmentId: number;
  hazardType: string | HazardType;
  reportedBy: number;
  assignedTo?: User | number;
  slaDeadline?: string;
  resolutionRemarks?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related entities
  plant?: Plant;
  department?: Department;
  reporter?: User;
  assignee?: User;
}

// Incident Types
export enum IncidentSeverity {
  MINOR = 'Minor',
  MODERATE = 'Moderate',
  MAJOR = 'Major',
  CRITICAL = 'Critical'
}

export enum IncidentStatus {
  REPORTED = 'Reported',
  UNDER_INVESTIGATION = 'Under_Investigation',
  INVESTIGATION_COMPLETE = 'Investigation_Complete',
  CLOSED = 'Closed'
}

export interface Incident {
  id: number;
  incidentNumber: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurredAt: string;
  location: string;
  plantId: number;
  departmentId: number;
  reportedBy: number;
  investigatedBy?: number;
  injuredPersons?: number;
  propertyDamage?: number;
  environmentalImpact?: boolean;
  rootCause?: string;
  correctiveActions?: string;
  preventiveActions?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related entities
  plant?: Plant;
  department?: Department;
  reporter?: User;
  investigator?: User;
}

// Audit Types (with missing properties)
export enum AuditType {
  INTERNAL = 'Internal',
  EXTERNAL = 'External',
  COMPLIANCE = 'Compliance',
  PROCESS = 'Process'
}

export enum AuditStatus {
  PLANNED = 'Planned',
  IN_PROGRESS = 'In_Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Audit {
  id: number;
  auditNumber: string;
  auditType: AuditType; // Added missing property
  title: string;
  description: string;
  type: AuditType;
  status: AuditStatus;
  plannedStartDate: string;
  plannedEndDate: string;
  scheduledDate: string; // Added missing property
  actualStartDate?: string;
  actualEndDate?: string;
  plantId: number;
  departmentId: number;
  auditedBy: number;
  findingsCount: number;
  complianceScore?: number;
  createdAt: string;
  updatedAt: string;
  
  // Related entities
  plant?: Plant;
  department?: Department;
  auditor?: User;
}

// Permit Types
export enum PermitType {
  HOT_WORK = 'Hot_Work',
  CONFINED_SPACE = 'Confined_Space',
  HEIGHT_WORK = 'Height_Work',
  ELECTRICAL_WORK = 'Electrical_Work',
  EXCAVATION = 'Excavation',
  CHEMICAL_HANDLING = 'Chemical_Handling'
}

export enum PermitStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending_Approval',
  APPROVED = 'Approved',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired'
}

export interface Permit {
  id: number;
  permitNumber: string;
  title: string;
  description: string;
  type: PermitType;
  status: PermitStatus;
  requestedBy: number;
  approvedBy?: number;
  validFrom: string;
  validTo: string;
  location: string;
  plantId: number;
  departmentId: number;
  riskAssessment: string;
  safetyMeasures: string[];
  createdAt: string;
  updatedAt: string;
  
  // Related entities
  plant?: Plant;
  department?: Department;
  requester?: User;
  approver?: User;
}

// Form Data Types
export interface ObservationFormData {
  observationType?: ObservationType;
  priority?: Priority;
  description?: string;
  location?: string;
  plantId?: number;
  departmentId?: number;
  hazardType?: string;
  assignedTo?: number | string; // Fixed to allow string conversion
}

export interface IncidentFormData {
  title?: string;
  description?: string;
  severity?: IncidentSeverity;
  occurredAt?: string;
  location?: string;
  plantId?: number;
  departmentId?: number;
  injuredPersons?: number;
  propertyDamage?: number;
  environmentalImpact?: boolean;
}

export interface AuditFormData {
  title?: string;
  description?: string;
  type?: AuditType;
  plannedStartDate?: string;
  plannedEndDate?: string;
  plantId?: number;
  departmentId?: number;
  auditedBy?: number;
}

export interface PermitFormData {
  title?: string;
  description?: string;
  type?: PermitType;
  validFrom?: string;
  validTo?: string;
  location?: string;
  plantId?: number;
  departmentId?: number;
  riskAssessment?: string;
  safetyMeasures?: string[];
}

export interface UserFormData {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userType?: UserRole;
  departmentId?: number;
  plantId?: number;
}

// Component Props Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Props interfaces for route components
export interface AuditDetailsProps {
  auditId: string; // Changed to string for route params
}

export interface IncidentDetailsProps {
  incidentId: string; // Changed to string for route params
}

export interface PermitDetailsProps {
  permitId: string; // Changed to string for route params
}

export interface UserDetailsProps {
  userId: string; // Changed to string for route params
}

export interface AuditFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (audit?: Audit) => void;
  audit?: Audit;
  mode?: 'create' | 'edit';
}

export interface IncidentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (incident?: Incident) => void;
  incident?: Incident;
  mode?: 'create' | 'edit';
}

export interface PermitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (permit?: Permit) => void;
  permit?: Permit;
  mode?: 'create' | 'edit';
}

export interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (user?: User) => void;
  user?: User;
  mode?: 'create' | 'edit';
}

// Navigation Types
export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
  requiredRoles?: UserRole[];
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  percent?: number; // Added for pie chart
}

export interface TrendDataPoint {
  date: string;
  observations: number;
  incidents: number;
  audits: number;
}

// Notification Types  
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

// Dashboard Types
export interface DashboardStats {
  totalObservations: number;
  openObservations: number;
  overdueObservations: number;
  totalIncidents: number;
  openIncidents: number;
  totalAudits: number;
  completedAudits: number;
  activePermits: number;
}

export interface RecentActivity {
  id: string;
  type: 'observation' | 'incident' | 'audit' | 'permit';
  title: string;
  description: string;
  priority: Priority;
  date: string;
  status: string;
}

// Constants for notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  WARNING: 'warning' as const,
  INFO: 'info' as const,
};

export const APP_SETTINGS = {
  NOTIFICATION_TIMEOUT: 5000,
  MAX_NOTIFICATIONS: 10,
};

// Search filter interface
export interface SearchFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}