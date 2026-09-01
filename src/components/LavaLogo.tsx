import React from 'react';

interface LavaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  imgClassName?: string;
  src?: string;
}

export const LavaLogo: React.FC<LavaLogoProps> = ({
  className = '',
  size = 'md',
  imgClassName = '',
  src,
}) => {
  // Dimension classes for the logo
  const sizeClasses = {
    xs: 'h-5 sm:h-6',
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11',
    lg: 'h-13 sm:h-16',
    xl: 'h-20 sm:h-28',
    '2xl': 'h-36 sm:h-48 md:h-56',
    '3xl': 'h-48 sm:h-64 md:h-80',
    '4xl': 'h-60 sm:h-80 md:h-96 lg:h-[420px]',
  };

  const logoSrc = src || "/Logo%20Lava%20horizontal%20copy.png";

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="LAVA"
        className={`w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_14px_rgba(212,154,85,0.18)] ${sizeClasses[size]} ${imgClassName}`}
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};
