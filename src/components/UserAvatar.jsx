import React, { useState } from 'react';
import { getInitials } from '../data/users';
import { Shield } from 'lucide-react';

export default function UserAvatar({
  user,
  size = 'md',
  className = '',
  showRing = true
}) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const tierClass = showRing && user?.tier ? `avatar-${user.tier}` : '';
  const initials = getInitials(user?.name || user?.username || 'Usuario');
  const hasValidImage = Boolean(user?.avatar && !imageError);

  if (hasValidImage) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${selectedSize} ${tierClass} ${className}`}>
        <img
          src={user.avatar}
          alt={user.name || 'Avatar'}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover"
        />
        {user?.isModerator && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full flex items-center justify-center shadow-xs"
            title="Moderador Oficial"
          >
            <Shield className="w-2 h-2 text-white fill-white" />
          </span>
        )}
      </div>
    );
  }

  // Renderizado con Iniciales en caso de no tener foto cargada
  const isMod = user?.isModerator || user?.role === 'moderator';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none font-black tracking-wider transition-all ${selectedSize} ${
        isMod
          ? 'bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white border-2 border-indigo-400 shadow-sm'
          : 'bg-linear-to-br from-slate-800 to-slate-750 text-amber-400 border border-amber-400/40 shadow-inner'
      } ${tierClass} ${className}`}
      aria-label={`Avatar con iniciales: ${initials}`}
    >
      <span>{initials}</span>

      {isMod && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-500 border border-slate-900 rounded-full flex items-center justify-center shadow-xs"
          title="Moderador Oficial"
        >
          <Shield className="w-2 h-2 text-white fill-white" />
        </span>
      )}
    </div>
  );
}
