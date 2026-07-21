export class SaveSystem {
  constructor(storageKey = 'ecos_do_vicio_save') { this.storageKey = storageKey; }
  save(state) { const payload = { ...state, saveTimestamp: new Date().toISOString() }; localStorage.setItem(this.storageKey, JSON.stringify(payload)); return payload; }
  load() { const raw = localStorage.getItem(this.storageKey); return raw ? JSON.parse(raw) : false; }
  exists() { return localStorage.getItem(this.storageKey) !== null; }
  clear() { localStorage.removeItem(this.storageKey); }
  getTimestamp() { const saved = this.load(); return saved && saved.saveTimestamp ? new Date(saved.saveTimestamp) : null; }
}
