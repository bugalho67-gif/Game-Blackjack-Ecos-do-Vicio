 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/Player.js b/js/Player.js
new file mode 100644
index 0000000000000000000000000000000000000000..0434296e369bfc827f72837749826312723fdec4
--- /dev/null
+++ b/js/Player.js
@@ -0,0 +1,9 @@
+import { createInitialState, clamp } from './utils.js';
+export class Player {
+  constructor(state = createInitialState()) { this.state = state; }
+  addGold(amount) { this.state.gold = Math.max(0, this.state.gold + amount); }
+  addItem(itemId) { if (!this.state.inventory.includes(itemId)) this.state.inventory.push(itemId); }
+  recordRoute(route) { this.state.globalRoute[route] += 1; if (route === 's') this.state.secretCount += 1; }
+  alterPsy(amount) { this.state.psy = clamp(this.state.psy + amount); }
+  alterSpec(amount) { this.state.spec = clamp(this.state.spec + amount); }
+}
 
EOF
)
