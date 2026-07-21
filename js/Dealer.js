import { handValue } from './utils.js';
export class Dealer {
  constructor(enemy) { this.enemy = enemy; }
  play(hand, deck) { while (handValue(hand) < 17) hand.push(deck.draw()); return hand; }
}
