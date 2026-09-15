import React from 'react';

interface RollingBannerProps {
  onOpenQuiz?: () => void;
  onNavigateCatalog?: () => void;
}

export const RollingBanner: React.FC<RollingBannerProps> = ({
  onOpenQuiz,
  onNavigateCatalog,
}) => {
  const marqueeItems = [
    {
      text: 'Envíos sin cargo en San Martín de los Andes comprando 500g o más',
      action: onNavigateCatalog,
      highlight: true,
    },
    {
      text: 'Pack Magma: Degustación de los 3 paquetes de 250g con 10% de descuento',
      action: onNavigateCatalog,
      highlight: false,
    },
    {
      text: 'Retiro sin costo por el Centro o Villa Vega San Martín',
      action: onNavigateCatalog,
      highlight: false,
    },
    {
      text: 'Hacé el test de personalidad para encontrar el café que mejor te representa',
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
