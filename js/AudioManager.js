export class AudioManager {
  constructor() {
    this.musicVolume = Number.parseFloat(localStorage.getItem('ecos_music_volume') ?? '0.45');
    this.sfxVolume = Number.parseFloat(localStorage.getItem('ecos_sfx_volume') ?? '0.7');
    this.muted = localStorage.getItem('ecos_muted') === 'true';
    this.currentMusic = null;
    this.music = { joao:'assets/music/joao_theme.mp3', mariana:'assets/music/mariana_theme.mp3', andre:'assets/music/andre_theme.mp3', thais:'assets/music/thais_theme.mp3', dealer:'assets/music/dealer_theme.mp3' };
    this.effects = { card_deal:'assets/sounds/card_deal.mp3', card_flip:'assets/sounds/card_flip.mp3', chip_bet:'assets/sounds/chip_bet.mp3', win_hand:'assets/sounds/win_hand.mp3', bust:'assets/sounds/bust.mp3', choice_g:'assets/sounds/choice_g.mp3', choice_b:'assets/sounds/choice_b.mp3', choice_s:'assets/sounds/choice_s.mp3', item_buy:'assets/sounds/item_buy.mp3', item_use:'assets/sounds/item_use.mp3', campaign_end:'assets/sounds/campaign_end.mp3' };
  }
  playMusic(enemyId) { if (this.muted) return; const src = this.music[enemyId]; if (!src) return; if (this.currentMusic) this.currentMusic.pause(); this.currentMusic = new Audio(src); this.currentMusic.loop = true; this.currentMusic.volume = this.musicVolume; this.currentMusic.play().catch(() => {}); }
  sfx(name) { if (this.muted || !this.effects[name]) return; const audio = new Audio(this.effects[name]); audio.volume = this.sfxVolume; audio.play().catch(() => {}); }
  setMusicVolume(value) { this.musicVolume = Number(value); localStorage.setItem('ecos_music_volume', String(this.musicVolume)); if (this.currentMusic) this.currentMusic.volume = this.musicVolume; }
  setSFXVolume(value) { this.sfxVolume = Number(value); localStorage.setItem('ecos_sfx_volume', String(this.sfxVolume)); }
  mute(value = true) { this.muted = value; localStorage.setItem('ecos_muted', String(value)); if (this.currentMusic && value) this.currentMusic.pause(); }
  isMuted() { return this.muted; }
}
