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
  LOGOUT: '/logout'
} as const;

// Type for route keys
export type RouteKey = keyof typeof ROUTES;

// Type for route paths  
export type RoutePath = typeof ROUTES[RouteKey];

// ✅ FIXED: Added missing return statement and proper logic
export const checkIsCurrentPath = (routePath: string, currentPath: string): boolean => {
  if (routePath === currentPath) {
    return true;
  }
  
  // Handle dynamic routes like /observations/:id
  if (routePath.includes(':')) {
    const routePattern = routePath.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(currentPath);
  }
  
  return false;
};

// ✅ FIXED: Proper function declaration
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
  
  // For other routes, check if current path starts with the route
  const currentSegments = currentPath.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);
  
  if (routeSegments.length === 0) return false;
  
  // Match the first segment
  return currentSegments.length > 0 && currentSegments[0] === routeSegments[0];
};