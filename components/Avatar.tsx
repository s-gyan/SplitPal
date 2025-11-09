
import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.avatarColor}`}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
};

export default Avatar;
