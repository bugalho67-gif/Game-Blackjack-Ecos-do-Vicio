import { handValue } from './utils.js';

export class BlackjackAi {
  recommendMove(playerHand, visibleEnemyCard, context = {}) {
    const playerScore = handValue(playerHand);
    const dealerUpValue = visibleEnemyCard ? Math.min(10, visibleEnemyCard.v === 'A' ? 11 : Number.parseInt(visibleEnemyCard.v, 10) || 10) : 10;
    if (playerScore >= 17) return this.createAdvice('stand', playerScore, 'Sua mão já está forte. O risco de estourar é maior que a promessa da próxima carta.');
    if (playerScore <= 11) return this.createAdvice('hit', playerScore, 'Ainda há margem matemática para pedir carta sem quebrar.');
    if (playerScore >= 12 && playerScore <= 16 && dealerUpValue >= 7) return this.createAdvice('hit', playerScore, 'A carta visível da casa pressiona. Parar aqui entrega a mesa cedo demais.');
    if (context.psy < 25) return this.createAdvice('stand', playerScore, 'Sua barra psicológica está baixa. A decisão segura preserva a campanha.');
    return this.createAdvice('stand', playerScore, 'A matemática favorece esperar a casa se expor.');
  }

  detectRuleBreak(snapshot) {
    const issues = [];
    if (snapshot.playerScore > 31 || snapshot.enemyScore > 31) issues.push('Pontuação impossível detectada.');
    if (snapshot.enemyHand.length > 0 && snapshot.enemyScore < 17 && snapshot.result) issues.push('O Dealer parou antes de 17. Isso viola a regra da mesa.');
    if (snapshot.playerHand.length > 12 || snapshot.enemyHand.length > 12) issues.push('Quantidade de cartas suspeita para uma única mão.');
    return issues;
  }

  createAdvice(action, score, reason) {
    return { action, score, reason, warning: 'Conselho não é salvo-conduto. O cassino também sabe contar.' };
  }
}
