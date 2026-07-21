import { Game } from './Game.js';

const loadJson = (path) => fetch(path).then((response) => response.json());
const [enemies, items, memories, events, choiceTree] = await Promise.all([
  loadJson('data/enemies.json'),
  loadJson('data/items.json'),
  loadJson('data/memories.json'),
  loadJson('data/events.json'),
  loadJson('data/choice-tree.json')
]);

window.game = new Game({ enemies, items, memories, events, choiceTree });
window.game.boot();
['requestNewGame','newGame','loadGame','goMap','goShop','openBook','closeBook','closeBkEntry','startBattle','deal','hit','stand','useItem','askAiAdvice','openSettings','closeSettings','openRules','closeRules','saveSettings'].forEach((method) => {
  window[method] = (...args) => window.game[method](...args);
});
