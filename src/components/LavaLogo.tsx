import React from 'react';

interface LavaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  imgClassName?: string;
}

export const LavaLogo: React.FC<LavaLogoProps> = ({
  className = '',
  size = 'md',
  imgClassName = '',
}) => {
  // Dimension classes for the horizontal logo
  const sizeClasses = {
    xs: 'h-5 sm:h-6',
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11',
    lg: 'h-13 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const logoSrc = "/Logo%20Lava%20horizontal%20copy.png";

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
