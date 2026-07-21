 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/Map.js b/js/Map.js
new file mode 100644
index 0000000000000000000000000000000000000000..687e3897f0326c64a03356f38e80c6f8e17d47a8
--- /dev/null
+++ b/js/Map.js
@@ -0,0 +1 @@
+export class Map { constructor(enemies, dealer) { this.enemies = enemies; this.dealer = dealer; } current(index) { return index >= this.enemies.length ? this.dealer : this.enemies[index]; } isDealer(index) { return index >= this.enemies.length; } }
 
EOF
)
