import { getRouteFor } from './utils.js';

export class Dialog {
  constructor(enemy, tree = null) {
    this.enemy = enemy;
    this.tree = tree;
    this.route = { g: 0, b: 0, s: 0 };
    this.history = [];
  }

  forHand(handNumber) {
    if (this.tree?.dialogs) {
      return this.tree.dialogs.find((dialog) => dialog.triggerHand === handNumber) || null;
    }
    return (this.enemy.dlg || this.enemy.dialogs || []).find((dialog) => (dialog.h || dialog.triggerHand) === handNumber) || null;
  }

  recordChoice(type, dialog = null) {
    this.route[type] += 1;
    const choice = (dialog?.choices || dialog?.ch || []).find((item) => (item.type || item.tp) === type) || null;
    this.history.push({ type, dialogId: dialog?.id || null, outcome: choice?.outcome || null });
    return { route: this.route, choice };
  }

  finalRoute() {
    return getRouteFor(this.route);
  }
}
