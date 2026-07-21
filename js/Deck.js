export class Deck {
  constructor(suits = ['♠','♣','♦','♥'], values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']) { this.suits = suits; this.values = values; this.cards = []; this.shuffle(); }
  shuffle() { this.cards = this.suits.flatMap((s) => this.values.map((v) => ({ v, s }))); for (let i = this.cards.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; } }
  draw() { if (this.cards.length < 10) this.shuffle(); return this.cards.pop(); }
}
