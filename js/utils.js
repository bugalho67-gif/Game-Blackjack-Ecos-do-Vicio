export const ROUTES = Object.freeze({ GOOD: 'g', BAD: 'b', SECRET: 's' });
export const RED_SUITS = new Set(['♦', '♥']);

export const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
export const getRouteFor = (route) => route.s >= 2 ? ROUTES.SECRET : (route.g > route.b ? ROUTES.GOOD : ROUTES.BAD);
export const cardValue = (value) => ['J', 'Q', 'K'].includes(value) ? 10 : (value === 'A' ? 11 : Number.parseInt(value, 10));
export const handValue = (hand) => {
  let total = 0;
  let aces = 0;
  hand.forEach((card) => { total += cardValue(card.v); if (card.v === 'A') aces += 1; });
  while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
  return total;
};
export const createInitialState = () => ({
  curEnemy: 0,
  totalEnemies: 4,
  dealerFight: false,
  campaignDone: false,
  globalRoute: { g: 0, b: 0, s: 0 },
  gold: 3,
  inventory: [],
  savedRoutes: {},
  bookUnlocks: {},
  psy: 70,
  spec: 50,
  secretCount: 0,
  lastItemEarned: null,
  saveTimestamp: null
});
