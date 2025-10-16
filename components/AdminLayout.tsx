import React from 'react';
import AdminSidebar from './AdminSidebar';
import { View } from '../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  fullWidth?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeView, setView, onLogout, fullWidth }) => {
  const containerClasses = fullWidth
    ? "px-6 sm:px-8 lg:px-12 py-12"
    : "container mx-auto px-6 py-12";

  return (
    <div className={containerClasses}>
        <div className="flex flex-col md:flex-row-reverse gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                <div className="md:sticky md:top-28">
                    <AdminSidebar activeView={activeView} setView={setView} onLogout={onLogout} />
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    </div>
  );
};

export default AdminLayout;