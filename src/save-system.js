 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/save-system.js b/src/save-system.js
new file mode 100644
index 0000000000000000000000000000000000000000..0c01b32bf03ccff899ed5aecffa29b1cff61fad2
--- /dev/null
+++ b/src/save-system.js
@@ -0,0 +1,18 @@
+export class SaveSystem {
+  constructor(storageKey) {
+    this.storageKey = storageKey;
+  }
+
+  save(state) {
+    localStorage.setItem(this.storageKey, JSON.stringify(state));
+  }
+
+  load() {
+    const raw = localStorage.getItem(this.storageKey);
+    return raw ? JSON.parse(raw) : null;
+  }
+
+  clear() {
+    localStorage.removeItem(this.storageKey);
+  }
+}
 
EOF
)
