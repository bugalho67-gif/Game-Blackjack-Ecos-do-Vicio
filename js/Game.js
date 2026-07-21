import { StateMachine, STATES } from './StateMachine.js';
import { Player } from './Player.js';
import { Battle } from './Battle.js';
import { Dialog } from './Dialog.js';
import { Shop } from './Shop.js';
import { Map } from './Map.js';
import { Memories } from './Memories.js';
import { SaveSystem } from './SaveSystem.js';
import { AudioManager } from './AudioManager.js';
import { EventSystem } from './EventSystem.js';
import { UI } from './UI.js';
import { clamp, createInitialState } from './utils.js';
import { BlackjackAi } from './BlackjackAi.js';

export class Game {
  constructor(data) {
    this.data = data;
    this.state = createInitialState();
    this.player = new Player(this.state);
    this.machine = new StateMachine();
    this.map = new Map(data.enemies.enemies, data.enemies.dealer);
    this.shop = new Shop(data.items.shopItems, data.items.vendorTexts);
    this.memories = new Memories(data.memories);
    this.saveSystem = new SaveSystem();
    this.audio = new AudioManager();
    this.events = new EventSystem(data.events);
    this.ai = new BlackjackAi();
    this.ui = new UI();
    this.battle = null;
    this.dialog = null;
  }

  boot() { this.ui.showScreen('sT'); }
  requestNewGame() { if (this.saveSystem.exists() && !window.confirm('Um save antigo será apagado. O cassino não devolve fichas. Continuar?')) return; this.newGame(); }
  newGame() { this.state = createInitialState(); this.player = new Player(this.state); this.saveSystem.clear(); this.goMap(false); }
  save() { this.state = this.saveSystem.save(this.state); this.ui.flashSave(); }
  loadGame() { const loaded = this.saveSystem.load(); if (!loaded) return false; this.state = loaded; this.player = new Player(this.state); this.goMap(false); return true; }

  goMap(rollEvent = true) { this.machine.transition(STATES.MAP); const current = this.map.current(this.state.curEnemy); this.ui.renderMap(this.data.enemies.enemies, this.data.enemies.dealer, this.state, current); this.ui.showScreen('sM'); if (rollEvent) this.tryMapEvent(); }
  tryMapEvent() { const event = this.events.roll(0.4); if (!event) return; this.machine.transition(STATES.EVENT); this.ui.renderEvent(event, (effect) => this.applyEventEffect(effect)); }
  applyEventEffect(effect) { if (effect.gold) this.player.addGold(effect.gold); if (effect.psy) this.player.alterPsy(effect.psy); if (effect.spec) this.player.alterSpec(effect.spec); if (effect.route) this.player.recordRoute(effect.route); if (effect.item) this.player.addItem(effect.item); this.save(); this.ui.hideDialog(); this.goMap(false); }

  openBook() { this.machine.transition(STATES.MEMORY); this.ui.renderBook(this.data.memories, this.state.bookUnlocks); this.ui.showScreen('sBk'); this.save(); }
  closeBook() { this.goMap(false); }
  closeBkEntry() { this.openBook(); }
  openSettings() { this.ui.setSettingsValues(this.audio.musicVolume, this.audio.sfxVolume, this.audio.isMuted()); this.ui.showScreen('sSettings'); }
  closeSettings() { this.ui.showScreen('sT'); }
  saveSettings() { const settings = this.ui.readSettingsValues(); this.audio.setMusicVolume(settings.musicVolume); this.audio.setSFXVolume(settings.sfxVolume); this.audio.mute(settings.muted); this.ui.setMessage('Configurações de áudio salvas.', 'rd'); this.closeSettings(); }
  openRules() { this.ui.showScreen('sRules'); }
  closeRules() { this.ui.showScreen('sT'); }
  goShop() { this.machine.transition(STATES.SHOP); this.ui.renderShop(this.data.items.shopItems, this.state, this.shop.getVendorText(this.state.globalRoute), (item) => this.buyItem(item)); this.ui.showScreen('sSh'); }
  buyItem(item) { if (!this.shop.buy(item, this.player)) return; this.audio.sfx('item_buy'); this.save(); this.goShop(); }

  startBattle() { const enemy = this.map.current(this.state.curEnemy); this.machine.transition(STATES.BATTLE); this.audio.playMusic(enemy.id); this.battle = new Battle(enemy, this.data); this.dialog = new Dialog(enemy, this.data.choiceTree.enemies[enemy.id]); const snap = this.battle.deal(); this.audio.sfx('card_deal'); this.ui.hideDialog(); this.ui.renderBattle(enemy, snap, this.state, !this.state.inventory.includes('peek')); this.ui.setControls(true, true, false, this.state.inventory.length > 0); this.ui.showScreen('sG'); }
  deal() { const snap = this.battle.deal(); this.audio.sfx('card_deal'); this.ui.renderBattle(this.battle.enemy, snap, this.state, !this.state.inventory.includes('peek')); this.ui.setControls(true, true, false, this.state.inventory.length > 0); }
  hit() { const snap = this.battle.hit(); this.audio.sfx('card_deal'); this.state.spec = clamp(this.state.spec + 3); this.ui.renderBattle(this.battle.enemy, snap, this.state, !this.state.inventory.includes('peek')); if (snap.playerScore > 21) this.finishHand({ ...snap, result:'bust' }); }
  stand() { this.audio.sfx('card_flip'); this.finishHand(this.battle.stand()); }
  useItem() { this.audio.sfx('item_use'); this.ui.setMessage('O item pulsa, mas seu custo ainda será escrito.', 'rd'); }
  askAiAdvice() { if (!this.battle) return; const advice = this.ai.recommendMove(this.battle.playerHand, this.battle.enemyHand[0], this.state); const suspicions = this.ai.detectRuleBreak(this.battle.snapshot()); this.ui.setMessage(`IA: ${advice.action === 'hit' ? 'pedir carta' : 'parar'} — ${advice.reason}${suspicions.length ? ` Suspeita: ${suspicions.join(' ')}` : ''}`, 'rd'); }
  finishHand(result) { if (result.result === 'win') { this.audio.sfx('win_hand'); this.state.psy = clamp(this.state.psy + 5); this.state.spec = clamp(this.state.spec - 5); } if (result.result === 'bust' || result.result === 'lose') { this.audio.sfx('bust'); this.state.psy = clamp(this.state.psy - 10); this.state.spec = clamp(this.state.spec + 8); } this.ui.renderBattle(this.battle.enemy, result, this.state, false); this.ui.setMessage(result.result === 'win' ? 'Você venceu' : result.result === 'tie' ? 'Empate' : 'A casa cobrou', result.result === 'win' ? 'rw' : 'rl'); const dialog = this.dialog.forHand(this.battle.handsDone); if (dialog) { this.machine.transition(STATES.DIALOG); this.ui.setControls(false, false, false); this.ui.renderDialog(this.battle.enemy, dialog, (type) => this.recordChoice(type)); return; } if (this.battle.isComplete()) this.endBattle(); else this.ui.setControls(false, false, true); }
  recordChoice(type) { const activeDialog = this.dialog.forHand(this.battle.handsDone); const result = this.dialog.recordChoice(type, activeDialog); const effect = result.choice?.effect || {}; if (effect.psy) this.player.alterPsy(effect.psy); if (effect.spec) this.player.alterSpec(effect.spec); this.player.recordRoute(type); this.audio.sfx(`choice_${type}`); this.ui.setMessage(result.choice?.outcome || 'A escolha afunda na mesa e não volta igual.', type === 'g' ? 'rw' : type === 'b' ? 'rl' : 'rd'); this.ui.hideDialog(); if (this.battle.isComplete()) this.endBattle(); else this.ui.setControls(false, false, true); }
  endBattle() { const route = this.dialog.finalRoute(); const enemy = this.battle.enemy; this.state.savedRoutes[enemy.id] = route; if (!this.map.isDealer(this.state.curEnemy)) { const item = enemy.items?.[route]; if (item) { this.state.lastItemEarned = item.name; this.player.addGold(2); } this.memories.unlock(this.state, enemy.id, route); this.state.curEnemy += 1; this.save(); this.goMap(true); return; } this.memories.unlock(this.state, 'dealer', route); this.state.campaignDone = true; this.save(); this.showEnd(route); }
  showEnd(route) { const treeFinals = this.data.choiceTree.finals; const finals = { g:{orn:'♥ ♥ ♥', title:treeFinals.g.title, badge:'Caminho da redenção', txt:treeFinals.g.text, itemN:'Carta final — carta branca', itemD:'Talvez fosse só papel. Talvez fosse tudo.'}, b:{orn:'♠ ♠ ♠', title:treeFinals.b.title, badge:'Caminho da corrupção', txt:treeFinals.b.text, itemN:'Carta final — tinta vermelha', itemD:'Seu nome estava escrito nela.'}, s:{orn:'♦ ♦ ♦', title:treeFinals.s.title, badge:'Final secreto', txt:treeFinals.s.text, itemN:'Carta final — sem nome', itemD:'A carta está em branco dos dois lados.'} }; this.audio.sfx('campaign_end'); this.machine.transition(STATES.GAMEOVER); this.ui.renderEnd(finals[route], this.state); }
}
