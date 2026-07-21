import { createInitialState, clamp } from './utils.js';
export class Player {
  constructor(state = createInitialState()) { this.state = state; }
  addGold(amount) { this.state.gold = Math.max(0, this.state.gold + amount); }
  addItem(itemId) { if (!this.state.inventory.includes(itemId)) this.state.inventory.push(itemId); }
  recordRoute(route) { this.state.globalRoute[route] += 1; if (route === 's') this.state.secretCount += 1; }
  alterPsy(amount) { this.state.psy = clamp(this.state.psy + amount); }
  alterSpec(amount) { this.state.spec = clamp(this.state.spec + amount); }
}
