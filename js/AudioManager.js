 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/AudioManager.js b/js/AudioManager.js
new file mode 100644
index 0000000000000000000000000000000000000000..41d7070eae4ff5236203e9422f33e81ef3a6b6a7
--- /dev/null
+++ b/js/AudioManager.js
@@ -0,0 +1,9 @@
+export class AudioManager {
+  constructor() { this.musicVolume = 0.45; this.sfxVolume = 0.7; this.muted = false; this.currentMusic = null; this.music = { joao:'assets/music/joao_theme.mp3', mariana:'assets/music/mariana_theme.mp3', andre:'assets/music/andre_theme.mp3', thais:'assets/music/thais_theme.mp3', dealer:'assets/music/dealer_theme.mp3' }; this.effects = { card_deal:'assets/sounds/card_deal.mp3', card_flip:'assets/sounds/card_flip.mp3', chip_bet:'assets/sounds/chip_bet.mp3', win_hand:'assets/sounds/win_hand.mp3', bust:'assets/sounds/bust.mp3', choice_g:'assets/sounds/choice_g.mp3', choice_b:'assets/sounds/choice_b.mp3', choice_s:'assets/sounds/choice_s.mp3', item_buy:'assets/sounds/item_buy.mp3', item_use:'assets/sounds/item_use.mp3', campaign_end:'assets/sounds/campaign_end.mp3' }; }
+  playMusic(enemyId) { if (this.muted) return; const src = this.music[enemyId]; if (!src) return; if (this.currentMusic) this.currentMusic.pause(); this.currentMusic = new Audio(src); this.currentMusic.loop = true; this.currentMusic.volume = this.musicVolume; this.currentMusic.play().catch(() => {}); }
+  sfx(name) { if (this.muted || !this.effects[name]) return; const audio = new Audio(this.effects[name]); audio.volume = this.sfxVolume; audio.play().catch(() => {}); }
+  setMusicVolume(value) { this.musicVolume = value; if (this.currentMusic) this.currentMusic.volume = value; }
+  setSFXVolume(value) { this.sfxVolume = value; }
+  mute() { this.muted = true; if (this.currentMusic) this.currentMusic.pause(); }
+  isMuted() { return this.muted; }
+}
 
EOF
)
