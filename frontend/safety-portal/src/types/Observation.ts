export enum ObservationType {
  Safety = 'Safety',
  Environmental = 'Environmental',
  Quality = 'Quality',
  Security = 'Security',
  Other = 'Other'
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export enum ObservationStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export interface Observation {
  id: number;
  title: string;
  description: string;
  observationType: ObservationType;
  priority: Priority;
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
}

export interface CreateObservationDto {
  title: string;
  description: string;
  observationType: ObservationType;
  priority: Priority;
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
  priority?: Priority;
  status?: ObservationStatus;
  location?: string;
  dueDate?: string;
  resolutionNotes?: string;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
}

export interface ObservationFormData {
  title: string;
  description: string;
  observationType?: ObservationType;
  priority: Priority;
  location: string;
  dueDate?: string;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
}