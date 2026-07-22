 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/assets/audio/README.md b/assets/audio/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..09c36710842ed495d360b41184ee834f74149673
--- /dev/null
+++ b/assets/audio/README.md
@@ -0,0 +1,12 @@
+# Audio placeholders
+
+Coloque aqui os arquivos finais de áudio do jogo com estes nomes:
+
+- `ambient.mp3` — música ambiente do cassino.
+- `buy.mp3` — compra na loja.
+- `win.mp3` — vitória de mão.
+- `card.mp3` — carta deslizando na mesa.
+- `chip.mp3` — fichas apostadas.
+- `dealer.mp3` — fala/impacto do Dealer.
+
+O `AudioManager` já aponta para estes caminhos em `src/audio-manager.js`.
 
EOF
)
