 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/Dialog.js b/js/Dialog.js
new file mode 100644
index 0000000000000000000000000000000000000000..e73af7695a064a4d5a4b2508292023b5d5135a2b
--- /dev/null
+++ b/js/Dialog.js
@@ -0,0 +1,28 @@
+import { getRouteFor } from './utils.js';
+
+export class Dialog {
+  constructor(enemy, tree = null) {
+    this.enemy = enemy;
+    this.tree = tree;
+    this.route = { g: 0, b: 0, s: 0 };
+    this.history = [];
+  }
+
+  forHand(handNumber) {
+    if (this.tree?.dialogs) {
+      return this.tree.dialogs.find((dialog) => dialog.triggerHand === handNumber) || null;
+    }
+    return (this.enemy.dlg || this.enemy.dialogs || []).find((dialog) => (dialog.h || dialog.triggerHand) === handNumber) || null;
+  }
+
+  recordChoice(type, dialog = null) {
+    this.route[type] += 1;
+    const choice = (dialog?.choices || dialog?.ch || []).find((item) => (item.type || item.tp) === type) || null;
+    this.history.push({ type, dialogId: dialog?.id || null, outcome: choice?.outcome || null });
+    return { route: this.route, choice };
+  }
+
+  finalRoute() {
+    return getRouteFor(this.route);
+  }
+}
 
EOF
)
