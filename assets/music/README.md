 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/assets/music/README.md b/assets/music/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..321c68426c0983c6a7f4a1e4a85d372e5953171c
--- /dev/null
+++ b/assets/music/README.md
@@ -0,0 +1,9 @@
+# Trilhas ambiente
+
+Arquivos esperados pelo `AudioManager`:
+
+- `joao_theme.mp3`
+- `mariana_theme.mp3`
+- `andre_theme.mp3`
+- `thais_theme.mp3`
+- `dealer_theme.mp3`
 
EOF
)
