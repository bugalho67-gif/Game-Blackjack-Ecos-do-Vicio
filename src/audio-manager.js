 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/audio-manager.js b/src/audio-manager.js
new file mode 100644
index 0000000000000000000000000000000000000000..7e4236cfb6dfc9e0f3737f6ee773a10ec912e619
--- /dev/null
+++ b/src/audio-manager.js
@@ -0,0 +1,24 @@
+export class AudioManager {
+  constructor() {
+    this.sounds = {
+      ambient: 'assets/audio/ambient.mp3',
+      buy: 'assets/audio/buy.mp3',
+      win: 'assets/audio/win.mp3',
+      card: 'assets/audio/card.mp3',
+      chip: 'assets/audio/chip.mp3',
+      dealer: 'assets/audio/dealer.mp3'
+    };
+    this.players = new Map();
+  }
+
+  play(name, { loop = false, volume = 0.55 } = {}) {
+    const src = this.sounds[name];
+    if (!src) return;
+    const audio = this.players.get(name) || new Audio(src);
+    audio.loop = loop;
+    audio.volume = volume;
+    this.players.set(name, audio);
+    audio.currentTime = 0;
+    audio.play().catch(() => {});
+  }
+}
 
EOF
)
