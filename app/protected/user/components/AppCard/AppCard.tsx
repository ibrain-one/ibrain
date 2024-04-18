import Link from 'next/link';
import React from 'react';

export interface AppCardProps {
  title: string;
  description: string;
  icon: React.JSX.Element;
  link: string;
}

const AppCard: React.FC<AppCardProps> = ({
  title,
  description,
  link,
  icon
}) => {
  return (
    <Link href={link}>
      <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-5 text-white hover:bg-white/20 transition duration-300 ease-in-out h-34 w-80">
        <div className="flex justify-center">{icon}</div>
        <div className="flex justify-center">
          {' '}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>

        {/* <p>{description}</p> */}
      </div>
    </Link>
  );
};

export default AppCard;
