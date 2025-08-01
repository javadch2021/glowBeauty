import React from 'react';
import { DashboardTab } from '../../atoms/types/CustomerTypes';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const tabs = [
  { key: 'profile' as const, label: 'Profile' },
  { key: 'orders' as const, label: 'Orders' },
  { key: 'tickets' as const, label: 'Support' },
  { key: 'history' as const, label: 'Purchase History' },
];

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-4 font-medium transition-colors ${
            activeTab === tab.key
              ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
              : 'text-gray-600 hover:text-pink-500'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
