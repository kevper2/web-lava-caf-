import confetti from 'canvas-confetti';

/**
 * Single Coffee Bean SVG Path
 * Features an organic coffee bean silhouette with the signature S-curved center crease.
 * Counter-clockwise inner winding ensures the center fissure stays an open, transparent slit.
 */
const SINGLE_COFFEE_BEAN_PATH = `
  M 50,4
  C 77,4 96,24 96,50
  C 96,76 77,96 50,96
  C 23,96 4,76 4,50
  C 4,24 23,4 50,4
  Z
  M 50,14
  C 44,26 40,38 45,50
  C 50,62 55,74 50,86
  L 56,86
  C 60,74 55,62 50,50
  C 45,38 49,26 56,14
  Z
`;

let singleBeanShapeCache: confetti.Shape | null = null;

const getSingleCoffeeBeanShape = (): confetti.Shape => {
  if (!singleBeanShapeCache) {
    try {
      singleBeanShapeCache = confetti.shapeFromPath({
        path: SINGLE_COFFEE_BEAN_PATH.replace(/\s+/g, ' ').trim(),
      });
    } catch {
      // Fallback to circle shape if path API is unsupported
      return 'circle';
    }
  }
  return singleBeanShapeCache;
};

/**
 * Fires confetti with authentic single coffee bean particles and a rich roast palette:
 * Dark espresso roast, medium Italian roast, warm roasted amber, and golden crema.
 */
export const triggerCoffeeBeanConfetti = (origin: { x?: number; y?: number } = { x: 0.5, y: 0.6 }) => {
  try {
    const singleBean = getSingleCoffeeBeanShape();

    // 1. Primary burst of single coffee beans (larger, authentic individual beans)
    confetti({
      shapes: [singleBean],
      scalar: 3.8, // Increased size for clear visibility of the single bean & its crease
      particleCount: 28,
      spread: 75,
      origin: { x: origin.x ?? 0.5, y: origin.y ?? 0.6 },
      ticks: 220,
      gravity: 0.82,
      drift: 0,
      colors: [
        '#2a160d', // Deep espresso roast
        '#3e2012', // Rich Italian roast
        '#5a3118', // Medium mountain roast
        '#784322', // Warm amber bean
        '#9e592c', // Roasted caramel tone
        '#c47e3d', // Golden crema bean
      ],
    });

    // 2. Secondary fine ambient burst of warm coffee-toned flakes
    confetti({
      particleCount: 26,
      spread: 60,
      origin: { x: origin.x ?? 0.5, y: origin.y ?? 0.6 },
      colors: [
        '#2d1810',
        '#4a2c11',
        '#6f4e37',
        '#8c5e34',
        '#d49a55',
      ],
      ticks: 150,
      gravity: 0.9,
      scalar: 1.2,
    });
  } catch {
    // Gracefully ignore if canvas isn't available
  }
};
