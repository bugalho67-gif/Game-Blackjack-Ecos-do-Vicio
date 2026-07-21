 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/ui-controller.js b/src/ui-controller.js
new file mode 100644
index 0000000000000000000000000000000000000000..e61ae3e93238b7227ac42c8cb329291a3dad10a3
--- /dev/null
+++ b/src/ui-controller.js
@@ -0,0 +1,18 @@
+export class UIController {
+  constructor(documentRef) {
+    this.document = documentRef;
+  }
+
+  byId(id) {
+    return this.document.getElementById(id);
+  }
+
+  showScreen(id) {
+    this.document.querySelectorAll('.sc').forEach((screen) => screen.classList.remove('on'));
+    this.byId(id).classList.add('on');
+  }
+
+  setText(id, text) {
+    this.byId(id).textContent = text;
+  }
+}
 
EOF
)
