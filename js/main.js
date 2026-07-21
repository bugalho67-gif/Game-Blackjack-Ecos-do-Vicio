 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/main.js b/js/main.js
new file mode 100644
index 0000000000000000000000000000000000000000..3835a0c890e304910e9452d0f50ab0f584c68462
--- /dev/null
+++ b/js/main.js
@@ -0,0 +1,16 @@
+import { Game } from './Game.js';
+
+const loadJson = (path) => fetch(path).then((response) => response.json());
+const [enemies, items, memories, events, choiceTree] = await Promise.all([
+  loadJson('data/enemies.json'),
+  loadJson('data/items.json'),
+  loadJson('data/memories.json'),
+  loadJson('data/events.json'),
+  loadJson('data/choice-tree.json')
+]);
+
+window.game = new Game({ enemies, items, memories, events, choiceTree });
+window.game.boot();
+['requestNewGame','newGame','loadGame','goMap','goShop','openBook','closeBook','closeBkEntry','startBattle','deal','hit','stand','useItem'].forEach((method) => {
+  window[method] = (...args) => window.game[method](...args);
+});
 
EOF
)
