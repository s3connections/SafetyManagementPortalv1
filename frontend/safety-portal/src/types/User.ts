export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  department?: string;
  isEmailVerified?: boolean;
  lastLoginDate?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  department?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  department?: string;
}