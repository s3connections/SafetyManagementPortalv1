import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ROUTES, USER_ROLES, APP_CONFIG } from '../../constants';

/// <reference types="react" />

// Sidebar props interface
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Menu item interface
interface MenuItem {
  name: string;
  path: string;
  icon: string;
  roles: string[];
}

// Icon component
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
  const icons: Record<string, React.ReactElement> = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
    observations: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    audits: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    permits: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    reports: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };

  return icons[name] || icons.dashboard;
};

// Helper function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n)
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to get role color
const getRoleColor = (role: string): string => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    supervisor: 'bg-green-100 text-green-800',
    employee: 'bg-gray-100 text-gray-800',
    auditor: 'bg-purple-100 text-purple-800',
    safety_officer: 'bg-orange-100 text-orange-800',
  };
  return colors[role as keyof typeof colors] || colors.employee;
};

// Menu items configuration
const SIDEBAR_MENU_ITEMS: MenuItem[] = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    roles: [],
  },
  {
    name: 'Observations',
    path: ROUTES.OBSERVATIONS,
    icon: 'observations',
    roles: [],
  },
  {
    name: 'Audits',
    path: ROUTES.AUDITS,
    icon: 'audits',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AUDITOR],
  },
  {
    name: 'Permits',
    path: ROUTES.PERMITS,
    icon: 'permits',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.SUPERVISOR],
  },
  {
    name: 'Users',
    path: ROUTES.USERS,
    icon: 'users',
    roles: [USER_ROLES.ADMIN],
  },
];

// Quick actions component
const QuickActions: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess } = useNotification();

  const quickActions = [
    {
      name: 'New Observation',
      onClick: () => showSuccess('Quick Action', 'New Observation form will open'),
      adminOnly: false,
    },
    {
      name: 'Emergency Alert',
      onClick: () => showSuccess('Alert', 'Emergency alert sent'),
      adminOnly: true,
    },
  ];

  if (!user) return null;

  return (
    <div className="px-4 py-3 border-t border-gray-200">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {quickActions
          .filter(action => !action.adminOnly || user?.role === USER_ROLES.ADMIN)
          .map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            {action.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// User profile section
const UserProfileSection: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useNotification();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged Out', 'You have been successfully logged out.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200">
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

      <button
        onClick={handleLogout}
        className="w-full flex items-center px-3 py-2 text-sm text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
      >
        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  );
};

// Menu item component
const MenuItem: React.FC<{ item: MenuItem; onClick?: () => void }> = ({ item, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <li>
      <Link
        to={item.path}
        onClick={onClick}
        className={`
          group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
          ${isActive
            ? 'bg-blue-100 text-blue-900'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }
        `}
      >
        <Icon
          name={item.icon}
          className={`
            mr-3 h-5 w-5 transition-colors
            ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
          `}
        />
        {item.name}
      </Link>
    </li>
  );
};

// Main Sidebar component
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  // Check if user has access to menu item
  const hasAccess = (item: MenuItem): boolean => {
    if (!user || !item.roles.length) return true;
    return item.roles.includes(user.role);
  };

  // Filter menu items based on user role
  const filteredMenuItems = SIDEBAR_MENU_ITEMS.filter(hasAccess);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {APP_CONFIG.APP_NAME.split(' ')}
              </span>
            </Link>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {filteredMenuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  item={item}
                  onClick={onClose} // Close sidebar on mobile when item is clicked
                />
              ))}
            </ul>
          </nav>

          {/* Quick Actions */}
          <QuickActions />

          {/* User Profile Section */}
          <UserProfileSection />
        </div>
      </div>
    </>
  );
};

export default Sidebar;