 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/Shop.js b/js/Shop.js
new file mode 100644
index 0000000000000000000000000000000000000000..eb000ec7fe841781f42ce6adfdd34615a15056eb
--- /dev/null
+++ b/js/Shop.js
@@ -0,0 +1,5 @@
+export class Shop {
+  constructor(items, vendorTexts) { this.items = items; this.vendorTexts = vendorTexts; }
+  getVendorText(route) { const key = route.s >= 2 ? 'secret' : route.g > route.b ? 'good' : route.b > route.g ? 'bad' : 'neutral'; return this.vendorTexts[key] || this.vendorTexts.neutral; }
+  buy(item, player) { if (player.state.gold < item.price || player.state.inventory.includes(item.id)) return false; player.addGold(-item.price); player.addItem(item.id); return true; }
+}
 
EOF
)
