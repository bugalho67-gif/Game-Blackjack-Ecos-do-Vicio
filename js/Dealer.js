 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/Dealer.js b/js/Dealer.js
new file mode 100644
index 0000000000000000000000000000000000000000..68578a3daa2fd6c5b709e093624fceda3b62bb49
--- /dev/null
+++ b/js/Dealer.js
@@ -0,0 +1,5 @@
+import { handValue } from './utils.js';
+export class Dealer {
+  constructor(enemy) { this.enemy = enemy; }
+  play(hand, deck) { while (handValue(hand) < 17) hand.push(deck.draw()); return hand; }
+}
 
EOF
)
