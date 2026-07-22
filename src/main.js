 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/main.js b/src/main.js
new file mode 100644
index 0000000000000000000000000000000000000000..68e32a225d7a2f23e9b53b39e20fb656a69f2138
--- /dev/null
+++ b/src/main.js
@@ -0,0 +1,3 @@
+import { bootstrapGame } from './blackjack-game.js';
+
+bootstrapGame();
 
EOF
)
