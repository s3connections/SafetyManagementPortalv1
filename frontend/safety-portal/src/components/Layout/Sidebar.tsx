import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { APP_CONFIG } from '../../config/appConfig';
import { USER_ROLES, getRoleColor } from '../../constants/userRoles';
import { ROUTES } from '../../constants/routes';

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  roles: string[];
  badge?: number;
}

interface QuickAction {
  name: string;
  icon: string;
  action: () => void;
  adminOnly?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Updated menu items with correct role references
  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: 'dashboard',
      roles: [], // Available to all authenticated users
    },
    {
      name: 'Observations',
      path: ROUTES.OBSERVATIONS,
      icon: 'observations',
      roles: [], // Available to all authenticated users
    },
    {
      name: 'Audits',
      path: ROUTES.AUDITS,
      icon: 'audits',
      roles: [USER_ROLES.ADMIN, USER_ROLES.SAFETY_MANAGER, USER_ROLES.SAFETY_OFFICER],
    },
    {
      name: 'Permits',
      path: ROUTES.PERMITS,
      icon: 'permits',
      roles: [USER_ROLES.ADMIN, USER_ROLES.SAFETY_MANAGER, USER_ROLES.RESPONSIBLE_ENGINEER],
    },
    {
      name: 'Users',
      path: ROUTES.PROFILE,
      icon: 'users',
      roles: [USER_ROLES.ADMIN, USER_ROLES.SAFETY_MANAGER],
    },
  ];

  const quickActions: QuickAction[] = [
    {
      name: 'New Observation',
      icon: 'plus',
      action: () => window.location.href = ROUTES.OBSERVATIONS_CREATE,
    },
    {
      name: 'New Audit',
      icon: 'audit',
      action: () => window.location.href = ROUTES.AUDITS_CREATE,
      adminOnly: true,
    },
    {
      name: 'New Permit',
      icon: 'permit',
      action: () => window.location.href = ROUTES.PERMITS_CREATE,
    },
  ];

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      dashboard: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z',
      observations: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      audits: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      permits: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      plus: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      audit: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      permit: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    };

    return iconMap[iconName] || iconMap.dashboard;
  };

  // ✅ FIXED: Helper function moved BEFORE usage
  const hasAccess = (item: MenuItem): boolean => {
    if (!user || !item.roles.length) return true;
    return item.roles.includes(user.role);
  };

  // ✅ FIXED: Filter menu items BEFORE JSX return
  const filteredMenuItems = menuItems.filter(hasAccess);

  if (!user) {
    return null;
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {APP_CONFIG.APP_NAME}
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions
              .filter(action => !action.adminOnly || user?.role === USER_ROLES.ADMIN)
              .map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d={getIcon(action.icon)} clipRule="evenodd" />
                </svg>
                <span>{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-medium">
              {getInitials(user.name || user.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Navigation
          </h3>
        )}
        {/* ✅ FIXED: filteredMenuItems is now properly defined */}
        {filteredMenuItems.map((item: MenuItem) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={isCollapsed ? item.name : ''}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d={getIcon(item.icon)} clipRule="evenodd" />
            </svg>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>{item.name}</span>
                {item.badge && item.badge > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;