export class Shop {
  constructor(items, vendorTexts) { this.items = items; this.vendorTexts = vendorTexts; }
  getVendorText(route) { const key = route.s >= 2 ? 'secret' : route.g > route.b ? 'good' : route.b > route.g ? 'bad' : 'neutral'; return this.vendorTexts[key] || this.vendorTexts.neutral; }
  buy(item, player) { if (player.state.gold < item.price || player.state.inventory.includes(item.id)) return false; player.addGold(-item.price); player.addItem(item.id); return true; }
}
