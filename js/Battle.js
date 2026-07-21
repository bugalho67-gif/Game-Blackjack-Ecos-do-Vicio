import { Deck } from './Deck.js';
import { Dealer } from './Dealer.js';
import { handValue } from './utils.js';
export class Battle {
  constructor(enemy, data) { this.enemy = enemy; this.data = data; this.deck = new Deck(); this.playerHand = []; this.enemyHand = []; this.currentHand = 1; this.handsDone = 0; this.totalHands = enemy.totalHands || 6; this.route = { g:0, b:0, s:0 }; }
  deal() { this.playerHand = [this.deck.draw(), this.deck.draw()]; this.enemyHand = [this.deck.draw(), this.deck.draw()]; return this.snapshot(); }
  hit() { this.playerHand.push(this.deck.draw()); return this.snapshot(); }
  stand() { this.enemyHand = new Dealer(this.enemy).play(this.enemyHand, this.deck); return this.finishHand(); }
  finishHand() { this.handsDone += 1; this.currentHand = Math.min(this.handsDone + 1, this.totalHands); const playerScore = handValue(this.playerHand); const enemyScore = handValue(this.enemyHand); const playerWon = playerScore <= 21 && (enemyScore > 21 || playerScore > enemyScore); const tie = playerScore === enemyScore && playerScore <= 21; return { ...this.snapshot(), result: playerScore > 21 ? 'bust' : (playerWon ? 'win' : (tie ? 'tie' : 'lose')) }; }
  snapshot() { return { playerHand:this.playerHand, enemyHand:this.enemyHand, playerScore:handValue(this.playerHand), enemyScore:handValue(this.enemyHand), currentHand:this.currentHand, totalHands:this.totalHands, handsDone:this.handsDone }; }
  isComplete() { return this.handsDone >= this.totalHands; }
}
