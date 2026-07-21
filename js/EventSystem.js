 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/EventSystem.js b/js/EventSystem.js
new file mode 100644
index 0000000000000000000000000000000000000000..af5b52cc4774bba19f9dc338f17e6fbe9753290d
--- /dev/null
+++ b/js/EventSystem.js
@@ -0,0 +1,4 @@
+export class EventSystem {
+  constructor(events) { this.events = events; this.lastEventId = null; this.seenOnce = new Set(); }
+  roll(chance = 0.4) { if (Math.random() > chance) return null; const available = this.events.filter((event) => event.id !== this.lastEventId && (!event.once || !this.seenOnce.has(event.id))); if (!available.length) return null; const event = available[Math.floor(Math.random() * available.length)]; this.lastEventId = event.id; if (event.once) this.seenOnce.add(event.id); return event; }
+}
 
EOF
)
