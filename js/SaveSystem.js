 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/SaveSystem.js b/js/SaveSystem.js
new file mode 100644
index 0000000000000000000000000000000000000000..eb13c69ea0dedddb76c416c61160dfb15f54471b
--- /dev/null
+++ b/js/SaveSystem.js
@@ -0,0 +1,8 @@
+export class SaveSystem {
+  constructor(storageKey = 'ecos_do_vicio_save') { this.storageKey = storageKey; }
+  save(state) { const payload = { ...state, saveTimestamp: new Date().toISOString() }; localStorage.setItem(this.storageKey, JSON.stringify(payload)); return payload; }
+  load() { const raw = localStorage.getItem(this.storageKey); return raw ? JSON.parse(raw) : false; }
+  exists() { return localStorage.getItem(this.storageKey) !== null; }
+  clear() { localStorage.removeItem(this.storageKey); }
+  getTimestamp() { const saved = this.load(); return saved && saved.saveTimestamp ? new Date(saved.saveTimestamp) : null; }
+}
 
EOF
)
