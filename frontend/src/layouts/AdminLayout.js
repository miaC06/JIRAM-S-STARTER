import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Home,
  FolderOpen,
  Users,
  BarChart3,
  FileText,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Get role-specific prefix
  const rolePrefix = user?.role?.toLowerCase() || 'admin';

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: `/${rolePrefix}/dashboard` },
    { icon: FolderOpen, label: 'All Cases', path: `/${rolePrefix}/cases` },
    { icon: Users, label: 'Users', path: `/${rolePrefix}/users` },
    { icon: BarChart3, label: 'Reports', path: `/${rolePrefix}/reports` },
    { icon: FileText, label: 'Documents', path: `/${rolePrefix}/documents` },
    { icon: Settings, label: 'Settings', path: `/${rolePrefix}/settings` },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      PROSECUTOR: 'bg-purple-100 text-purple-800',
      JUDGE: 'bg-blue-100 text-blue-800',
      REGISTRAR: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'md:justify-center'}`}>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-white text-lg">JIRAMS</span>
                  <p className="text-xs text-gray-400">Admin Portal</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  } ${!sidebarOpen && 'md:justify-center md:px-2'}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-gray-700">
            <div
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer ${
                !sidebarOpen && 'md:justify-center'
              }`}
              onClick={handleLogout}
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getRoleBadgeColor(user?.role)}`}>
                    {user?.role}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()} Portal
              </h1>
              <p className="text-xs text-gray-500">Case Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-600">
                    <p>No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
