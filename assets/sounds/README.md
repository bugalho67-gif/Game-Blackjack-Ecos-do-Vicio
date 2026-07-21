 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/assets/sounds/README.md b/assets/sounds/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..c7524a3678480cb75a9018113e8a544dfbbb1cea
--- /dev/null
+++ b/assets/sounds/README.md
@@ -0,0 +1,15 @@
+# SFX obrigatórios
+
+Arquivos esperados pelo `AudioManager`:
+
+- `card_deal.mp3`
+- `card_flip.mp3`
+- `chip_bet.mp3`
+- `win_hand.mp3`
+- `bust.mp3`
+- `choice_g.mp3`
+- `choice_b.mp3`
+- `choice_s.mp3`
+- `item_buy.mp3`
+- `item_use.mp3`
+- `campaign_end.mp3`
 
EOF
)
