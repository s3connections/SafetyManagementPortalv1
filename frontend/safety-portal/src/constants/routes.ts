export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  OBSERVATIONS: '/observations',
  OBSERVATION_DETAILS: '/observations/:id',
  CREATE_OBSERVATION: '/observations/create',
  EDIT_OBSERVATION: '/observations/:id/edit',
  AUDITS: '/audits',
  AUDIT_DETAILS: '/audits/:id',
  CREATE_AUDIT: '/audits/create',
  PERMITS: '/permits',
  PERMIT_DETAILS: '/permits/:id',
  CREATE_PERMIT: '/permits/create',
  USERS: '/users',
  USER_DETAILS: '/users/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/login',
  LOGOUT: '/logout',
  UNAUTHORIZED: '/unauthorized'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export const checkIsCurrentPath = (routePath: string, currentPath: string): boolean => {
  if (routePath === currentPath) {
    return true;
  }

export const getRoute = (key: RouteKey, params?: Record<string, string | number>): string => {
  let route = ROUTES[key];
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      route = route.replace(`:${key}`, String(value)) as RoutePath;
    });
  }
  return route;
};

// ✅ FIXED: Get first element from split array
export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  if (routePath === ROUTES.DASHBOARD) {
    return currentPath === routePath;
  }
  
  
  const pathWithoutParams = routePath.split('/:')[0]; // Add [0]
return currentPath.startsWith(pathWithoutParams);
}
};