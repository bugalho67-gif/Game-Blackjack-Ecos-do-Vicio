export class EventSystem {
  constructor(events) { this.events = events; this.lastEventId = null; this.seenOnce = new Set(); }
  roll(chance = 0.4) { if (Math.random() > chance) return null; const available = this.events.filter((event) => event.id !== this.lastEventId && (!event.once || !this.seenOnce.has(event.id))); if (!available.length) return null; const event = available[Math.floor(Math.random() * available.length)]; this.lastEventId = event.id; if (event.once) this.seenOnce.add(event.id); return event; }
}
