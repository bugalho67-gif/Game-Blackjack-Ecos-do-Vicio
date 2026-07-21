export const STATES = Object.freeze({ MENU:'MENU', MAP:'MAP', BATTLE:'BATTLE', DIALOG:'DIALOG', SHOP:'SHOP', MEMORY:'MEMORY', EVENT:'EVENT', GAMEOVER:'GAMEOVER' });
export class StateMachine {
  constructor(initialState = STATES.MENU) { this.state = initialState; this.listeners = new Set(); }
  transition(nextState, payload = {}) { const previous = this.state; this.state = nextState; this.listeners.forEach((listener) => listener({ previous, current: nextState, payload })); }
  onChange(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
}
