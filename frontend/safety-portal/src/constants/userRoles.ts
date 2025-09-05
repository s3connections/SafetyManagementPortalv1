export const USER_ROLES = {
  ADMIN: 'Admin',
  SAFETY_MANAGER: 'Safety_Manager',
  SAFETY_OFFICER: 'Safety_Officer',
  RESPONSIBLE_ENGINEER: 'Responsible_Engineer',
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  AUDITOR: 'Auditor',
  SUPERVISOR: 'Supervisor'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.SAFETY_MANAGER]: 'Safety Manager',
    [USER_ROLES.SAFETY_OFFICER]: 'Safety Officer',
    [USER_ROLES.RESPONSIBLE_ENGINEER]: 'Responsible Engineer',
    [USER_ROLES.EMPLOYEE]: 'Employee',
    [USER_ROLES.MANAGER]: 'Manager',
    [USER_ROLES.AUDITOR]: 'Auditor',
    [USER_ROLES.SUPERVISOR]: 'Supervisor'
  };
  
  return roleMap[role] || role;
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'bg-red-100 text-red-800';
    case USER_ROLES.SAFETY_MANAGER:
      return 'bg-blue-100 text-blue-800';
    case USER_ROLES.SAFETY_OFFICER:
      return 'bg-green-100 text-green-800';
    case USER_ROLES.RESPONSIBLE_ENGINEER:
      return 'bg-purple-100 text-purple-800';
    case USER_ROLES.MANAGER:
      return 'bg-orange-100 text-orange-800';
    case USER_ROLES.AUDITOR:
      return 'bg-yellow-100 text-yellow-800';
    case USER_ROLES.SUPERVISOR:
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'bg-red-100 text-red-800 border border-red-300';
    case USER_ROLES.SAFETY_MANAGER:
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case USER_ROLES.SAFETY_OFFICER:
      return 'bg-green-100 text-green-800 border border-green-300';
    case USER_ROLES.RESPONSIBLE_ENGINEER:
      return 'bg-purple-100 text-purple-800 border border-purple-300';
    case USER_ROLES.MANAGER:
      return 'bg-orange-100 text-orange-800 border border-orange-300';
    case USER_ROLES.AUDITOR:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case USER_ROLES.SUPERVISOR:
      return 'bg-indigo-100 text-indigo-800 border border-indigo-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};