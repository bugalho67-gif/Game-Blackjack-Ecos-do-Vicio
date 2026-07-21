 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/StateMachine.js b/js/StateMachine.js
new file mode 100644
index 0000000000000000000000000000000000000000..b28ad799ab260ec30e3515525dd682edc60488f1
--- /dev/null
+++ b/js/StateMachine.js
@@ -0,0 +1,6 @@
+export const STATES = Object.freeze({ MENU:'MENU', MAP:'MAP', BATTLE:'BATTLE', DIALOG:'DIALOG', SHOP:'SHOP', MEMORY:'MEMORY', EVENT:'EVENT', GAMEOVER:'GAMEOVER' });
+export class StateMachine {
+  constructor(initialState = STATES.MENU) { this.state = initialState; this.listeners = new Set(); }
+  transition(nextState, payload = {}) { const previous = this.state; this.state = nextState; this.listeners.forEach((listener) => listener({ previous, current: nextState, payload })); }
+  onChange(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
+}
 
EOF
)
