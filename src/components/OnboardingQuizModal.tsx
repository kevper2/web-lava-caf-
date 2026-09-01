import React, { useState } from 'react';
import { CoffeeBean, CartItem, GrindType, BagSize } from '../types';
import { COFFEE_BEANS } from '../data/coffeeData';
import { LavaLogo } from './LavaLogo';
import { X, Sparkles, ArrowRight, MessageCircle, Check, RefreshCw, Zap, Compass, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  beans?: CoffeeBean[];
  onSelectRecommended?: (bean: CoffeeBean) => void;
  onSelectBeanForCustomizer?: (bean: CoffeeBean) => void;
  onAddToCart?: (item: CartItem) => void;
  onDirectWhatsApp?: (item: CartItem) => void;
  onDirectWhatsAppOrder?: (bean: CoffeeBean, grind: GrindType, size: BagSize) => void;
}

interface PersonalityQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    description: string;
    targetBeanId: 'andes-colombianos' | 'serra-da-mantiqueira' | 'alpi-italiane';
  }[];
}

export const OnboardingQuizModal: React.FC<OnboardingQuizModalProps> = ({
  isOpen,
  onClose,
  beans = COFFEE_BEANS,
  onSelectRecommended,
  onSelectBeanForCustomizer,
  onAddToCart,
  onDirectWhatsApp,
  onDirectWhatsAppOrder,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultBean, setResultBean] = useState<CoffeeBean | null>(null);

  if (!isOpen) return null;

  const validBeans = beans && beans.length > 0 ? beans : COFFEE_BEANS;

  const questions: PersonalityQuestion[] = [
    {
      id: 1,
      question: '¿Cómo abordás tus mañanas y el inicio de una gran jornada?',
      subtitle: 'Definí tu energía primordial y tu estado mental de arranque.',
      options: [
        {
          text: 'Con lucidez quirúrgica y agudeza mental.',
          description: 'Busco claridad absoluta, planificar con visión y conectar ideas de vanguardia.',
          targetBeanId: 'andes-colombianos',
        },
        {
          text: 'Con serenidad, balance y disfrute pausado.',
          description: 'Aprecio la armonía, un momento de confort premium sin apuro antes de actuar.',
          targetBeanId: 'serra-da-mantiqueira',
        },
        {
          text: 'Con determinación, intensidad y ritmo imparable.',
          description: 'Foco total, decisiones ejecutivas firmes y acción directa desde el minuto cero.',
          targetBeanId: 'alpi-italiane',
        },
      ],
    },
    {
      id: 2,
      question: '¿Qué atmósfera o espacio define tu máxima inspiración?',
      subtitle: 'El entorno donde tus sentidos operan con mayor placer y distinción.',
      options: [
        {
          text: 'Espacios luminosos, arquitectura moderna y diseño minimalista.',
          description: 'Aire fresco, ventanales altos y pureza visual sin sobrecargas.',
          targetBeanId: 'andes-colombianos',
        },
        {
          text: 'Un living cálido con maderas nobles, cuero suave y buena música.',
          description: 'Texturas envolventes, elegancia atemporal y bienestar refinado.',
          targetBeanId: 'serra-da-mantiqueira',
        },
        {
          text: 'Un refugio de piedra en la alta cordillera o un despacho sobrio.',
          description: 'Presencia imponente, carácter sobrio y solidez indestructible.',
          targetBeanId: 'alpi-italiane',
        },
      ],
    },
    {
      id: 3,
      question: 'Ante un desafío o una decisión estratégica compleja, ¿cuál es tu instinto?',
      subtitle: 'Tu temperamento ante la incertidumbre y los grandes proyectos.',
      options: [
        {
          text: 'Explorar ángulos creativos y encontrar la solución más elegante.',
          description: 'El detalle no evidente que cambia el juego con distinción.',
          targetBeanId: 'andes-colombianos',
        },
        {
          text: 'Buscar el equilibrio maestro donde todas las partes fluyan.',
          description: 'Consistencia que perdura, relaciones de confianza y solidez.',
          targetBeanId: 'serra-da-mantiqueira',
        },
        {
          text: 'Avanzar con coraje implacable y marcar el rumbo sin titubear.',
          description: 'Impacto contundente, liderazgo natural y resultados directos.',
          targetBeanId: 'alpi-italiane',
        },
      ],
    },
    {
      id: 4,
      question: 'En una experiencia gastronómica de alta gama, ¿qué buscás despertar?',
      subtitle: 'El impacto sensorial que considerás inolvidable.',
      options: [
        {
          text: 'Notas brillantes, especiadas y matices aromáticos exóticos.',
          description: 'Un viaje sensorial chispeante que despierte la curiosidad.',
          targetBeanId: 'andes-colombianos',
        },
        {
          text: 'Cuerpo aterciopelado, dulzura envolvente de cacao y avellanas.',
          description: 'Una textura cremosa que acaricie el paladar de principio a fin.',
          targetBeanId: 'serra-da-mantiqueira',
        },
        {
          text: 'Densidad profunda, chocolate amargo 80% y retrogusto prolongado.',
          description: 'Un espresso con autoridad que permanezca en la memoria.',
          targetBeanId: 'alpi-italiane',
        },
      ],
    },
  ];

  const handleSelectOption = (targetBeanId: string) => {
    const nextAnswers = [...answers, targetBeanId];
    setAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winning bean by frequency
      const counts: Record<string, number> = {};
      nextAnswers.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });

      let topBeanId = 'andes-colombianos';
      let maxCount = 0;
      for (const [id, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          topBeanId = id;
        }
      }

      const matchedBean = validBeans.find((b) => b.id === topBeanId) || validBeans[0];
      setResultBean(matchedBean);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#d49a55', '#ffffff', '#c6894b'],
        });
      } catch (e) {
        // silent
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultBean(null);
  };

  const handleDirectWhatsAppResult = () => {
    if (!resultBean) return;

    if (onDirectWhatsAppOrder) {
      onDirectWhatsAppOrder(resultBean, 'Granos', '500g');
      onClose();
      return;
    }

    const cartItem: CartItem = {
      id: `${resultBean.id}-500g-Granos-${Date.now()}`,
      beanId: resultBean.id,
      beanName: resultBean.name,
      grind: 'Granos',
      size: '500g',
      unitPrice: resultBean.prices['500g'],
      quantity: 1,
      frequency: 'one_time',
    };
    if (onDirectWhatsApp) {
      onDirectWhatsApp(cartItem);
    }
    onClose();
  };

  const handleCustomizer = () => {
    if (!resultBean) return;
    if (onSelectRecommended) {
      onSelectRecommended(resultBean);
    } else if (onSelectBeanForCustomizer) {
      onSelectBeanForCustomizer(resultBean);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* Subtle lava ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#d49a55]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <LavaLogo size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c8276] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!resultBean ? (
          /* Step-by-step Personality Quiz */
          <div className="py-6 space-y-8">
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-[#8c8276]">
              <span className="uppercase tracking-widest text-[#d49a55] font-semibold">
                Pregunta {currentStep + 1} de {questions.length}
              </span>
              <span>Test de Arquetipo Sensorial</span>
            </div>
            
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#d49a55] h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question title */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#f7eedf] tracking-tight">
                {questions[currentStep].question}
              </h3>
              <p className="text-xs text-[#9e9386]">
                {questions[currentStep].subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {questions[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.targetBeanId)}
                  className="w-full p-5 rounded-2xl bg-[#111111] hover:bg-white/[0.06] border border-white/5 hover:border-[#d49a55]/40 text-left transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#f7eedf] group-hover:text-white transition-colors">
                        {option.text}
                      </h4>
                      <p className="text-xs text-[#8c8276] mt-1 font-normal leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5e554a] group-hover:text-[#d49a55] shrink-0 mt-1 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

          </div>
        ) : (
          /* Personality Result Presentation */
          <div className="py-6 space-y-6 animate-in zoom-in-95 duration-400">
            
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d49a55] font-semibold">
                Tu Arquetipo de Café LAVA
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#f7eedf]">
                {resultBean.personality.title}
              </h3>
              <p className="text-xs italic text-[#c9bba8] max-w-md mx-auto">
                {resultBean.personality.quote}
              </p>
            </div>

            {/* Matched Coffee Style Card */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] text-[#8c8276] uppercase tracking-wider block">
                    Estilo Recomendado
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {resultBean.name} · {resultBean.country}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#d49a55]/10 border border-[#d49a55]/30 text-[#d49a55]">
                  {resultBean.altitude}
                </span>
              </div>

              <p className="text-xs text-[#9e9386] leading-relaxed">
                {resultBean.personality.description}
              </p>

              {/* Ritual ideal */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#d6c9b8] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d49a55] shrink-0" />
                <span><strong>Ritual sugerido:</strong> {resultBean.personality.idealRitual}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDirectWhatsAppResult}
                className="w-full py-4 px-6 rounded-2xl bg-[#1b3820] hover:bg-[#234b2a] border border-[#2d6335] text-[#4ade80] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-[#4ade80]" />
                <span>Pedir este Café vía WhatsApp (500g)</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCustomizer}
                  className="py-3 rounded-xl border border-white/10 text-xs font-semibold text-[#d6c9b8] hover:text-white hover:border-[#d49a55]/40 transition-all cursor-pointer bg-white/[0.02]"
                >
                  Personalizar Molienda & Tamaño
                </button>

                <button
                  onClick={handleReset}
                  className="py-3 rounded-xl border border-white/5 text-xs font-medium text-[#7d7367] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rehacer Test</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
