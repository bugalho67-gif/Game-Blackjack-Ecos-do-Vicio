 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/Memories.js b/js/Memories.js
new file mode 100644
index 0000000000000000000000000000000000000000..c14040fef0aa7c788b28f73cbfbde123e6a72c6c
--- /dev/null
+++ b/js/Memories.js
@@ -0,0 +1 @@
+export class Memories { constructor(entries) { this.entries = entries; } unlock(state, id, route) { const entry = state.bookUnlocks[id] || {}; entry[route] = true; if (route === 'g' || route === 'b') entry.both = true; state.bookUnlocks[id] = entry; } }
 
EOF
)
