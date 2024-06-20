// pages/index.tsx or components/AppGrid.tsx
import React from 'react';
import AppCard from './AppCard';
import { AreaChart, CircleUserRound, Database, LayoutDashboard, Settings, MessageCircleQuestion } from 'lucide-react';

const apps = [
  {
    title: 'Account',
    description: 'This is the first app.',
    icon:<CircleUserRound size={72} strokeWidth={1.5} />,
    link:"/account"
  },
  {
    title: 'Setting',
    description: 'This is the first app.',
    icon:<Settings size={72} strokeWidth={1.5} />,
    link:"/protected/settings"
  },
  {
    title: 'Database',
    description: 'This is the second app.',
    icon:<Database size={72} strokeWidth={1.5} />,
    link:"/protected/database"
  },
  {
    title: 'Dashboard',
    description: 'This is the second app.',
    icon:<LayoutDashboard size={72} strokeWidth={1.5} />,
    link:"/protected/dashboard"
  },
  {
    title: 'Visualization',
    description: 'This is the second app.',
    icon:<AreaChart size={72} strokeWidth={1.5} />,
    link:"/protected/visualization"
  },
  {
    title: 'Insights',
    description: 'This is the second app.',
    icon:<MessageCircleQuestion size={72} strokeWidth={1.5} />,
    link:"/protected/insights"
  },
  {
    title: 'Brainstorm',
    description: 'Discuss ideas and create structured documents with iBrain.',
    icon:<MessageCircleQuestion size={72} strokeWidth={1.5} />,
    link:"/protected/brainstorm"
  }
];

const AppGrid: React.FC = () => {
  return (
    <div className="bg-black p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  justify-items-center">
      {apps.map((app, index) => (
        <AppCard
          key={index}
          title={app.title}
          description={app.description}
          link={app.link}
          icon={app.icon}
        />
      ))}
    </div>
  );
};

export default AppGrid;
