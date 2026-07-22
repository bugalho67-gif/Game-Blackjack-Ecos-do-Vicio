 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/state-machine.js b/src/state-machine.js
new file mode 100644
index 0000000000000000000000000000000000000000..a71cc2a4dfcbd861b3986cafd6e09e63b3983d5b
--- /dev/null
+++ b/src/state-machine.js
@@ -0,0 +1,18 @@
+export class StateMachine {
+  constructor(initialState, transitions) {
+    this.state = initialState;
+    this.transitions = transitions;
+  }
+
+  can(nextState) {
+    return (this.transitions[this.state] || []).includes(nextState);
+  }
+
+  transition(nextState) {
+    if (!this.can(nextState)) {
+      throw new Error(`Transição inválida: ${this.state} -> ${nextState}`);
+    }
+    this.state = nextState;
+    return this.state;
+  }
+}
 
EOF
)
