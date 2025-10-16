import React from 'react';
import { View } from '../types';
import { CubeIcon, CogIcon, GiftIcon, LogoutIcon } from './icons';

interface AdminSidebarProps {
  activeView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setView, onLogout }) => {
  
  const navItems = [
    { view: 'admin' as View, label: 'Prodotti', icon: <CubeIcon className="h-5 w-5" /> },
    { view: 'siteManagement' as View, label: 'Gestione Configurazioni', icon: <CogIcon className="h-5 w-5" /> },
    { view: 'thankYouSettings' as View, label: 'Impostazioni Thank You Page', icon: <GiftIcon className="h-5 w-5" /> },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0]}> = ({ item }) => {
    const isActive = activeView === item.view;
    return (
      <button 
        onClick={() => setView(item.view)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors text-sm font-medium ${
            isActive 
            ? 'bg-mango-orange text-white' 
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    );
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-4 px-2">Menu Admin</h3>
      <nav className="space-y-2">
        {navItems.map(item => <NavLink key={item.view} item={item} />)}
      </nav>
      <div className="border-t my-4"></div>
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <LogoutIcon className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminSidebar;
