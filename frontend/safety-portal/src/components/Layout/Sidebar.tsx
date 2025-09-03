import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

// Sidebar props interface
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Menu item interface
interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
  children?: MenuItem[];
}

// Icon component
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
  const icons: Record<string, JSX.Element> = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    analytics: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    chevronRight: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    chevronDown: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
  };

  return icons[name] || icons.dashboard;
};

// Single menu item component
const MenuItem: React.FC<{
  item: MenuItem;
  isActive: boolean;
  hasAccess: boolean;
  onItemClick?: () => void;
}> = ({ item, isActive, hasAccess, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasAccess) {
    return null;
  }

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onItemClick?.();
    }
  };

  const itemClasses = `
    flex items-center justify-between w-full px-4 py-3 text-left rounded-lg transition-colors
    ${isActive 
      ? 'bg-blue-600 text-white shadow-sm' 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }
    ${hasChildren ? 'cursor-pointer' : ''}
  `;

  const content = (
    <div className={itemClasses} onClick={hasChildren ? handleClick : undefined}>
      <div className="flex items-center space-x-3">
        <Icon name={item.icon} className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
        <span className="font-medium text-sm">{item.label}</span>
      </div>
      {hasChildren && (
        <Icon 
          name={isExpanded ? "chevronDown" : "chevronRight"} 
          className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`}
        />
      )}
    </div>
  );

  return (
    <li className="mb-1">
      {hasChildren ? (
        content
      ) : (
        <Link to={item.path} onClick={onItemClick}>
          {content}
        </Link>
      )}

      {hasChildren && isExpanded && (
        <ul className="ml-6 mt-2 space-y-1">
          {item.children?.map((child, index) => (
            <MenuItem
              key={index}
              item={child}
              isActive={location.pathname === child.path}
              hasAccess={true} // Assume child access is already filtered
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Quick actions component
const QuickActions: React.FC = () => {
  const { showSuccess } = useNotification();

  const quickActions = [
    {
      label: 'New Report',
      icon: 'analytics',
      action: () => showSuccess('Coming Soon', 'Report creation feature will be available soon.'),
    },
    {
      label: 'Add User',
      icon: 'users',
      action: () => showSuccess('Coming Soon', 'User management feature will be available soon.'),
      adminOnly: true,
    },
  ];

  const { user } = useAuth();

  return (
    <div className="px-4 py-6 border-t border-gray-200">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {quickActions
          .filter(action => !action.adminOnly || user?.role === USER_ROLES.ADMIN)
          .map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Icon name={action.icon} className="w-4 h-4 text-gray-400" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// User info component
const UserInfo: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useNotification();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Signed Out', 'You have been successfully signed out.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-red-600 bg-red-100';
      case 'user':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="px-4 py-6 border-t border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-medium">
          {getInitials(user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </div>

      <div className="space-y-1">
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
        >
          <Icon name="users" className="w-4 h-4 text-gray-400" />
          <span>Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Main Sidebar component
export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Check if user has access to a menu item
  const hasAccess = (item: MenuItem): boolean => {
    if (!user || !item.roles.length) return true;
    return item.roles.includes(user.role);
  };

  // Filter menu items based on user role
  const filteredMenuItems = SIDEBAR_MENU_ITEMS.filter(hasAccess);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {APP_NAME.split(' ')[0]}
              </span>
            </Link>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {filteredMenuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  item={item}
                  isActive={location.pathname === item.path}
                  hasAccess={hasAccess(item)}
                  onItemClick={onClose}
                />
              ))}
            </ul>
          </nav>

          {/* Quick Actions */}
          <QuickActions />

          {/* User Info */}
          <UserInfo />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
