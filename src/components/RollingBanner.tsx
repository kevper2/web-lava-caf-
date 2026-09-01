import React from 'react';

interface RollingBannerProps {
  onOpenQuiz?: () => void;
  onNavigateClub?: () => void;
}

export const RollingBanner: React.FC<RollingBannerProps> = ({
  onOpenQuiz,
  onNavigateClub,
}) => {
  const marqueeItems = [
    {
      text: 'Envíos sin cargo en San Martín de los Andes comprando 500g o más',
      action: null,
      highlight: true,
    },
    {
      text: 'Beneficios exclusivos con la membresía del Club Magma',
      action: onNavigateClub,
      highlight: false,
    },
    {
      text: 'Hacé el test de personalidad para encontrar el estilo de café que te representa',
      action: onOpenQuiz,
      highlight: false,
    },
  ];

  return (
    <div className="w-full bg-[#0a0705] border-b border-[#d49a55]/15 overflow-hidden select-none py-1.5 z-50">
      <div className="animate-marquee whitespace-nowrap flex items-center text-[10.5px] sm:text-[11px] tracking-wide text-[#b8ab9a]">
        {/* Render twice for continuous infinite loop */}
        {[1, 2].map((loopIndex) => (
          <div key={loopIndex} className="flex items-center">
            {marqueeItems.map((item, idx) => (
              <span key={`${loopIndex}-${idx}`} className="inline-flex items-center mx-4 sm:mx-6">
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className={item.highlight ? 'text-[#c99454] font-medium' : ''}>
                      {item.text}
                    </span>
                  </button>
                ) : (
                  <span className={item.highlight ? 'text-[#c99454] font-medium' : ''}>
                    {item.text}
                  </span>
                )}
                <span className="ml-4 sm:ml-6 text-[#5c4a38] font-light">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
