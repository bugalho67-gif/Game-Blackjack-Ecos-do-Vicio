 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/random-events.js b/src/random-events.js
new file mode 100644
index 0000000000000000000000000000000000000000..25df9a7ea19a95576b386ef956101931ae677603
--- /dev/null
+++ b/src/random-events.js
@@ -0,0 +1,14 @@
+export class RandomEventSystem {
+  constructor(events = []) {
+    this.events = events.length ? events : [
+      { id: 'luzes', text: 'As luzes do cassino piscam. A próxima carta parece mais pesada.', psy: -2, spec: 4 },
+      { id: 'sussurro', text: 'Um sussurro do Dealer atravessa a mesa.', psy: -3, spec: 3 },
+      { id: 'ficha', text: 'Uma ficha esquecida rola até seus pés.', gold: 1 }
+    ];
+  }
+
+  roll(chance = 0.15) {
+    if (Math.random() > chance) return null;
+    return this.events[Math.floor(Math.random() * this.events.length)];
+  }
+}
 
EOF
)
