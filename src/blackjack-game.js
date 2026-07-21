 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/blackjack-game.js b/src/blackjack-game.js
new file mode 100644
index 0000000000000000000000000000000000000000..c68b2db98f9abbec9cf81626d072d30735d84186
--- /dev/null
+++ b/src/blackjack-game.js
@@ -0,0 +1,509 @@
+import { AudioManager } from './audio-manager.js';
+import { StateMachine } from './state-machine.js';
+import { SaveSystem } from './save-system.js';
+import { UIController } from './ui-controller.js';
+import { RandomEventSystem } from './random-events.js';
+
+export class BlackjackGame {
+  constructor(data) {
+    this.data = data;
+    this.audio = new AudioManager();
+    this.saveSystem = new SaveSystem('blackjack-ecos-save');
+    this.ui = new UIController(document);
+    this.machine = new StateMachine('title', {
+      title: ['map', 'book'],
+      map: ['shop', 'battle', 'book', 'title', 'ending'],
+      shop: ['map'],
+      battle: ['map', 'ending'],
+      book: ['title', 'map'],
+      ending: ['title', 'map']
+    });
+    this.randomEvents = new RandomEventSystem();
+  this.state = {
+  screen:'t', enemies:['joao','mariana','andre','thais'],
+  curEnemy:0, phase:'map',
+  deck:[], pH:[], eH:[],
+  pSc:0, eSc:0, curHand:1, totalHands:6, handsDone:0, wins:0,
+  dlgIdx:0, route:{g:0,b:0,s:0}, globalRoute:{g:0,b:0,s:0},
+  psy:70, spec:50, gold:3, inventory:[], usedItem:false,
+  savedRoutes:{}, bookUnlocks:{}, campaignDone:false,
+  dealerFight:false, secretCount:0, legendSaved:false,
+  lastItemEarned:null, currentEnemy:null
+  };
+  }
+
+  /* ============================================================
+   UTILITÁRIOS
+   ============================================================ */
+  show(id){
+  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'));
+  document.getElementById(id).classList.add('on');
+  }
+  showTit(){ this.renderTit(); this.show('sT'); }
+  openBook(){ this.renderBook(); this.show('sBk'); }
+  closeBook(){ this.show(this.state.campaignDone ? 'sT' : 'sM'); }
+  closeBkEntry(){
+  document.getElementById('bkGrid').style.display = '';
+  document.getElementById('bkEntry').style.display = 'none';
+  }
+
+  /* ============================================================
+   NOVO JOGO / RESET
+   ============================================================ */
+  newGame(){
+  this.state = {
+    screen:'t', enemies:['joao','mariana','andre','thais'],
+    curEnemy:0, phase:'map',
+    deck:[], pH:[], eH:[],
+    pSc:0, eSc:0, curHand:1, totalHands:6, handsDone:0, wins:0,
+    dlgIdx:0, route:{g:0,b:0,s:0}, globalRoute:{g:0,b:0,s:0},
+    psy:70, spec:50, gold:3, inventory:[], usedItem:false,
+    savedRoutes:{}, bookUnlocks:{}, campaignDone:false,
+    dealerFight:false, secretCount:0, legendSaved:false,
+    lastItemEarned:null, currentEnemy:null
+  };
+  this.saveGame();
+  this.goMap();
+  }
+
+  /* ============================================================
+   BARALHO
+   ============================================================ */
+  buildDeck(){
+  let d = [];
+  for(let s of this.data.SUITS) for(let v of this.data.VALS) d.push({v, s});
+  for(let i = d.length-1; i>0; i--){
+    const j = Math.floor(Math.random()*(i+1));
+    [d[i], d[j]] = [d[j], d[i]];
+  }
+  return d;
+  }
+  cv(v){ if(['J','Q','K'].includes(v)) return 10; if(v==='A') return 11; return parseInt(v); }
+  hv(h){ let t=0,a=0; for(let c of h){ t+=this.cv(c.v); if(c.v==='A') a++; } while(t>21&&a>0){ t-=10; a--; } return t; }
+  drawCard(){ if(this.state.deck.length<10) this.state.deck=this.buildDeck(); return this.state.deck.pop(); }
+
+  /* ============================================================
+   RENDER CARTAS
+   ============================================================ */
+  renderCards(id, hand, hide){
+  const el = document.getElementById(id);
+  el.innerHTML = '';
+  hand.forEach((c, i) => {
+    const d = document.createElement('div');
+    if(hide && i===1){ d.className='card hid'; }
+    else { d.className='card'+(this.data.RED.includes(c.s)?' r':''); d.innerHTML=`<div class="ss">${c.s}</div><div class="sv">${c.v}</div>`; }
+    el.appendChild(d);
+  });
+  }
+
+  /* ============================================================
+   HUD
+   ============================================================ */
+  updScore(v, id){
+  const el = document.getElementById(id);
+  el.textContent = v;
+  el.className = 'sc-num';
+  if(v > 21) el.classList.add('sc-bust');
+  else if(v === 21) el.classList.add('sc-bj');
+  }
+  updHud(){ document.getElementById('hudHand').textContent = this.state.curHand+'/'+this.state.totalHands; }
+  updPsy(){ document.getElementById('hudPFill').style.width = Math.round(this.state.psy)+'%'; }
+  updSpec(){
+  document.getElementById('spFill').style.width = Math.round(this.state.spec)+'%';
+  document.getElementById('spVal').textContent = Math.round(this.state.spec)+'%';
+  }
+  showCtrl(h, s, d){
+  document.getElementById('bH').disabled = !h;
+  document.getElementById('bS').disabled = !s;
+  document.getElementById('bD').style.display = d ? 'inline-block' : 'none';
+  document.getElementById('bH').style.display = !d ? 'inline-block' : 'none';
+  document.getElementById('bS').style.display = !d ? 'inline-block' : 'none';
+  const hasUsable = this.state.inventory.length>0 && !this.state.usedItem;
+  document.getElementById('bItem').style.display = (h && hasUsable) ? 'inline-block' : 'none';
+  }
+  setMsg(tx, cl){
+  const el = document.getElementById('rMsg');
+  el.textContent = tx||'';
+  el.className = 'rm '+(cl||'');
+  }
+
+  /* ============================================================
+   MAPA
+   ============================================================ */
+  goMap(){
+  this.state.phase = 'map';
+  this.renderMap();
+  this.show('sM');
+  }
+
+  renderTit(){
+  const si = document.getElementById('tSavedInfo');
+  si.textContent = (this.state.savedRoutes && Object.keys(this.state.savedRoutes).length>0)
+    ? 'Jornada anterior registrada no Livro de Memórias' : '';
+  }
+
+  renderMap(){
+  const isDealer = this.state.curEnemy >= this.state.enemies.length;
+  const cur = isDealer ? this.data.DEALER : this.data.ENEMIES[this.state.curEnemy];
+  document.getElementById('mTitle').textContent = this.state.campaignDone
+    ? 'Campanha concluída — rotas reveladas'
+    : 'Mapa — cinza enquanto a jornada continua';
+
+  const track = document.getElementById('mTrack');
+  track.innerHTML = '';
+
+  this.data.ENEMIES.forEach((e, i) => {
+    if(i > 0){ const ln=document.createElement('div'); ln.className='m-ln'; ln.style.background=i<=this.state.curEnemy?e.col+'44':'#1e1828'; track.appendChild(ln); }
+    const nd = document.createElement('div');
+    nd.className = 'm-nd '+(i<this.state.curEnemy?'done':i===this.state.curEnemy&&!isDealer?'cur':'lock');
+    nd.style.borderColor = i<this.state.curEnemy?e.col+'44':i===this.state.curEnemy&&!isDealer?e.col:'#1e1828';
+    nd.innerHTML = `<div class="m-icon" style="color:${i<this.state.curEnemy?e.col+'88':i===this.state.curEnemy&&!isDealer?e.col:'#3a2a4a'}">${i<this.state.curEnemy?'✓':e.icon}</div><div class="m-lbl" style="color:${i<=this.state.curEnemy?e.col+'88':'#2a1a3a'}">${e.name}</div>`;
+    track.appendChild(nd);
+  });
+
+  const dln = document.createElement('div'); dln.className='m-ln'; dln.style.background=isDealer?this.data.DEALER.col+'44':'#1e1828'; track.appendChild(dln);
+  const dnd = document.createElement('div');
+  dnd.className = 'm-nd '+(isDealer?'cur':'lock');
+  dnd.style.borderColor = isDealer?this.data.DEALER.col:'#1e1828';
+  dnd.innerHTML = `<div class="m-icon" style="color:${isDealer?this.data.DEALER.col:'#3a2a4a'}">${this.data.DEALER.icon}</div><div class="m-lbl" style="color:${isDealer?this.data.DEALER.col+'88':'#2a1a3a'}">Dealer</div>`;
+  track.appendChild(dnd);
+
+  document.getElementById('mcName').textContent = cur.name;
+  document.getElementById('mcSub').textContent = cur.sub;
+  document.getElementById('mcBio').textContent = cur.bio;
+
+  const rs = document.getElementById('mcRoutes');
+  if(this.state.curEnemy > 0){
+    rs.innerHTML = `
+      <div class="m-rs"><div class="m-rs-n" style="color:#4a8a5a">${this.state.globalRoute.g}</div><div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#2a4a2a">Redenção</div></div>
+      <div class="m-rs"><div class="m-rs-n" style="color:#8a2020">${this.state.globalRoute.b}</div><div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#4a1a1a">Corrupção</div></div>
+      <div class="m-rs"><div class="m-rs-n" style="color:#6a3a8a">${this.state.globalRoute.s}</div><div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#3a1a5a">Segredo</div></div>`;
+  } else { rs.innerHTML=''; }
+
+  const ie = document.getElementById('mItemEarned');
+  if(this.state.lastItemEarned){ ie.style.display='block'; ie.innerHTML=`Item obtido: <strong style="color:#c9a84c">${this.state.lastItemEarned}</strong>`; ie.style.color='#8a7a5a'; this.state.lastItemEarned=null; }
+  else { ie.style.display='none'; }
+  }
+
+  /* ============================================================
+   LOJA
+   ============================================================ */
+  goShop(){
+  const gRouteKey = this.state.globalRoute.s>=2?'secret':this.state.globalRoute.g>this.state.globalRoute.b?'good':this.state.globalRoute.b>this.state.globalRoute.g?'bad':'neutral';
+  document.getElementById('shVendorTxt').textContent = this.data.VENDOR_TEXTS[gRouteKey]||this.data.VENDOR_TEXTS.neutral;
+  document.getElementById('shGold').textContent = this.state.gold;
+  const grid = document.getElementById('shGrid');
+  grid.innerHTML = '';
+  this.data.SHOP_ITEMS.forEach(it => {
+    const owned = this.state.inventory.includes(it.id);
+    const div = document.createElement('div');
+    div.className = 'sh-item'+(owned?' owned':'');
+    div.style.borderColor = owned?'#3a5a2a':'#2a2418';
+    div.innerHTML = `<div class="sh-irare" style="color:${it.col}">${it.rare}</div><div class="sh-iname" style="color:#c9a84c">${it.name}</div><div class="sh-idesc" style="color:#6a5a3a">${it.desc}</div><div class="sh-iprice" style="color:${owned?'#3a5a2a':this.state.gold>=it.price?'#c9a84c':'#5a3a2a'}">${owned?'Adquirido':'Fichas: '+it.price}</div>`;
+    if(!owned) div.onclick = ()=>this.buyItem(it);
+    grid.appendChild(div);
+  });
+  this.show('sSh');
+  }
+
+  buyItem(it){
+  if(this.state.gold < it.price) return;
+  this.audio.play('buy');
+  this.state.gold -= it.price;
+  this.state.inventory.push(it.id);
+  this.saveGame();
+  document.getElementById('shGold').textContent = this.state.gold;
+  this.goShop();
+  }
+
+  /* ============================================================
+   BATALHA — SETUP
+   ============================================================ */
+  startBattle(){
+  const isDealer = this.state.curEnemy >= this.state.enemies.length;
+  const en = isDealer ? this.data.DEALER : this.data.ENEMIES[this.state.curEnemy];
+  this.machine.state = 'map';
+  this.machine.transition('battle');
+  this.audio.play('ambient', { loop: true, volume: 0.25 });
+  this.state.phase='battle'; this.state.deck=this.buildDeck();
+  this.state.pH=[]; this.state.eH=[]; this.state.pSc=0; this.state.eSc=0;
+  this.state.curHand=1; this.state.totalHands=en.totalHands||6; this.state.handsDone=0; this.state.wins=0;
+  this.state.dlgIdx=0; this.state.route={g:0,b:0,s:0}; this.state.psy=70; this.state.spec=50;
+  this.state.usedItem=false; this.state.legendSaved=false; this.state.currentEnemy=en;
+
+  document.getElementById('hudPort').textContent = en.icon;
+  document.getElementById('hudPort').style.color = en.col;
+  document.getElementById('hudPort').style.borderColor = en.col+'44';
+  document.getElementById('hudName').textContent = en.name;
+  document.getElementById('hudName').style.color = en.col;
+  document.getElementById('hudSub').textContent = en.sub;
+  document.getElementById('tblELbl').textContent = en.name;
+  document.getElementById('hudPFill').style.background = en.col;
+  document.getElementById('specBar').style.display = 'flex';
+  document.getElementById('spLbl').textContent = en.spec||en.barLbl||'Estado';
+  document.getElementById('spFill').style.background = en.barCol||'#6a2a8a';
+
+  this.updHud(); this.updPsy(); this.updSpec();
+  document.getElementById('dlgArea').style.display='none';
+  document.getElementById('chArea').style.display='none';
+  this.show('sG');
+  this.deal();
+  }
+
+  /* ============================================================
+   BLACKJACK — MECÂNICA
+   ============================================================ */
+  deal(){
+  if(this.state.handsDone >= this.state.totalHands) return;
+  if(this.state.deck.length < 10) this.state.deck = this.buildDeck();
+  this.audio.play('card');
+  this.state.pH=[this.drawCard(),this.drawCard()]; this.state.eH=[this.drawCard(),this.drawCard()];
+  this.state.pSc=this.hv(this.state.pH); this.state.eSc=this.hv(this.state.eH); this.state.phase='player'; this.state.usedItem=false;
+  const hasPeek = this.state.inventory.includes('peek');
+  this.renderCards('pCards',this.state.pH,false);
+  this.renderCards('eCards',this.state.eH,!hasPeek);
+  this.updScore(this.state.pSc,'pScore');
+  this.showCtrl(true,true,false); this.setMsg();
+  document.getElementById('dlgArea').style.display='none';
+  document.getElementById('chArea').style.display='none';
+  }
+
+  hit(){
+  if(this.state.phase!=='player') return;
+  this.audio.play('card');
+  const c = this.drawCard(); this.state.pH.push(c); this.state.pSc=this.hv(this.state.pH);
+  this.renderCards('pCards',this.state.pH,false); this.updScore(this.state.pSc,'pScore');
+  this.state.spec = Math.min(100, this.state.spec+3); this.updSpec();
+  if(this.state.pSc > 21){
+    if(this.state.inventory.includes('shield') && !this.state.usedItem){
+      this.state.usedItem=true; this.state.pSc=21; this.state.pH[this.state.pH.length-1]={v:'?',s:'♥'};
+      this.renderCards('pCards',this.state.pH,false); this.updScore(this.state.pSc,'pScore'); this.setMsg('Escudo ativou!','rd'); return;
+    }
+    this.endHand();
+  } else if(this.state.pSc===21){ this.stand(); }
+  }
+
+  stand(){
+  if(this.state.phase!=='player') return;
+  this.state.phase='enemy';
+  if(this.state.inventory.includes('mirror') && !this.state.usedItem){ this.state.usedItem=true; this.state.pSc=this.state.eSc; this.updScore(this.state.pSc,'pScore'); this.setMsg('Espelho ativado','rd'); }
+  if(this.state.inventory.includes('anchor') && !this.state.usedItem){ this.state.usedItem=true; while(this.state.eSc<17){ this.state.eH.push(this.drawCard()); this.state.eSc=this.hv(this.state.eH); } if(this.state.eSc>17) this.state.eSc=17; }
+  else { while(this.state.eSc<17){ this.state.eH.push(this.drawCard()); this.state.eSc=this.hv(this.state.eH); } }
+  this.renderCards('eCards',this.state.eH,false);
+  this.endHand();
+  }
+
+  useItem(){
+  if(this.state.inventory.length===0 || this.state.usedItem) return;
+  const it = this.state.inventory[0];
+  if(it==='echo'){
+    this.state.usedItem=true;
+    const best = Math.max(...this.state.pH.map(c=>this.cv(c.v)));
+    this.setMsg('Eco: +'+Math.floor(best/3),'rd');
+    this.state.pSc=Math.min(21,this.state.pSc+Math.floor(best/3));
+    this.updScore(this.state.pSc,'pScore');
+  } else if(it==='legend'){
+    this.state.usedItem=true; this.state.legendSaved=true; this.setMsg('Ficha dourada ativa','rd');
+  }
+  this.showCtrl(true,true,false);
+  }
+
+  endHand(){
+  this.state.handsDone++; this.state.curHand=Math.min(this.state.handsDone+1,this.state.totalHands); this.updHud();
+  let msg='',mc=''; const ps=this.state.pSc, es=this.state.eSc; let win=false;
+  if(ps>21){ this.shakeTable(); msg='Estourou!'; mc='rl'; this.state.psy=Math.max(0,this.state.psy-12); this.state.spec=Math.min(100,this.state.spec+8); }
+  else if(es>21||ps>es){ this.audio.play('win'); win=true; msg='Você venceu'; mc='rw'; this.state.wins++; this.state.psy=Math.min(100,this.state.psy+5); this.state.spec=Math.max(0,this.state.spec-5); }
+  else if(ps===es){ msg='Empate'; mc='rd'; }
+  else { msg='Inimigo venceu'; mc='rl'; this.state.psy=Math.max(0,this.state.psy-8); this.state.spec=Math.min(100,this.state.spec+8); }
+  if(this.state.legendSaved && !win){ this.state.legendSaved=false; win=true; msg='Ficha dourada salvou!'; mc='rw'; this.state.wins++; this.state.inventory=this.state.inventory.filter(i=>i!=='legend'); }
+  this.updPsy(); this.updSpec(); this.setMsg(msg,mc);
+  const dlgs = this.state.currentEnemy.dlg||[];
+  const di = dlgs.findIndex(d=>d.h===this.state.handsDone);
+  if(di!==-1 && this.state.dlgIdx<=di){ this.state.dlgIdx=di+1; this.showCtrl(false,false,false); setTimeout(()=>this.showDlg(dlgs[di]),800); }
+  else if(this.state.handsDone>=this.state.totalHands){ this.showCtrl(false,false,false); setTimeout(()=>this.endBattle(),1200); }
+  else { this.showCtrl(false,false,true); }
+  }
+
+  /* ============================================================
+   DIÁLOGOS E ESCOLHAS
+   ============================================================ */
+  showDlg(d){
+  document.getElementById('dlgArea').style.display='block';
+  document.getElementById('dlgSp').textContent = this.state.currentEnemy.name;
+  document.getElementById('dlgTx').textContent = d.tx;
+  document.getElementById('chArea').style.display='block';
+  const g=document.getElementById('chGrid'); g.innerHTML='';
+  d.ch.forEach(c=>{
+    const b=document.createElement('button');
+    b.className='ch-btn '+c.tp; b.textContent=c.t;
+    b.onclick=()=>this.choose(c.tp); g.appendChild(b);
+  });
+  }
+
+  choose(tp){
+  this.state.route[tp]++; this.state.globalRoute[tp]++;
+  if(tp==='g'){ this.state.psy=Math.min(100,this.state.psy+8); this.state.spec=Math.max(0,this.state.spec-10); }
+  else if(tp==='b'){ this.state.psy=Math.max(0,this.state.psy-10); this.state.spec=Math.min(100,this.state.spec+6); }
+  else { this.state.spec=Math.min(100,this.state.spec+12); this.state.secretCount++; }
+  this.updPsy(); this.updSpec();
+  document.getElementById('chArea').style.display='none';
+  document.getElementById('dlgArea').style.display='none';
+  if(this.state.handsDone>=this.state.totalHands) setTimeout(()=>this.endBattle(),400);
+  else this.showCtrl(false,false,true);
+  }
+
+  /* ============================================================
+   FIM DE BATALHA
+   ============================================================ */
+  getRouteFor(r){ if(r.s>=2) return 's'; if(r.g>r.b) return 'g'; return 'b'; }
+
+  endBattle(){
+  const rt = this.getRouteFor(this.state.route);
+  const isDealer = this.state.currentEnemy === this.data.DEALER;
+  const en = this.state.currentEnemy;
+  this.state.savedRoutes[en.id||'dealer'] = rt;
+
+  this.saveGame();
+  if(!isDealer){
+    const items = en.items||{};
+    const itm = items[rt]||items.g;
+    this.state.lastItemEarned = itm ? itm.name : null;
+    this.state.gold += 2;
+    const bk = this.state.bookUnlocks[en.id]||{};
+    bk[rt]=true; if(rt==='g'||rt==='b') bk.both=true;
+    this.state.bookUnlocks[en.id]=bk;
+    this.state.curEnemy++;
+    this.goMap();
+  } else {
+    this.state.campaignDone=true;
+    this.state.bookUnlocks['dealer']={};
+    this.state.bookUnlocks['dealer'][rt]=true;
+    if(rt==='g'||rt==='b') this.state.bookUnlocks['dealer'].both=true;
+    this.showEnd(rt);
+  }
+  }
+
+  /* ============================================================
+   TELA FINAL
+   ============================================================ */
+  showEnd(rt){
+  const finals = {
+    g:{ orn:'♥ ♥ ♥', title:'O ciclo foi interrompido', badge:'Caminho da redenção', tc:'#4aaa6a',
+        txt:'Não é um final feliz. É um final honesto. Algumas cicatrizes fecharam. Outras ainda sangram. Mas o cassino, por uma noite, não lucrou com o desespero de ninguém.',
+        itemN:'Carta final — carta branca', itemD:'O Dealer entregou uma carta em branco. Não estava escrita. Talvez fosse só papel. Talvez fosse tudo.' },
+    b:{ orn:'♠ ♠ ♠', title:'O ciclo continua', badge:'Caminho da corrupção', tc:'#aa3a3a',
+        txt:'O Dealer deixou uma carta na mesa e foi embora. Não era de despedida — era de transferência. O cassino tem um novo rosto. O seu.',
+        itemN:'Carta final — tinta vermelha', itemD:'O nome do protagonista estava escrito nela. Com a caligrafia do Dealer.' },
+    s:{ orn:'♦ ♦ ♦', title:'O protagonista se tornou o sistema', badge:'Final secreto', tc:'#8a5ab8',
+        txt:'O Dealer se recusou a jogar a quarta rodada. Disse apenas: "Você já chegou onde precisava chegar." O protagonista está sentado à mesa com os outros.',
+        itemN:'Carta final — sem nome', itemD:'A carta está em branco nos dois lados. O Vendedor disse que isso nunca tinha acontecido antes.' }
+  };
+  const f = finals[rt]||finals.g;
+  document.getElementById('eOrn').textContent=f.orn;
+  document.getElementById('eTitle').textContent=f.title;
+  const b=document.getElementById('eBadge'); b.textContent=f.badge; b.style.color=f.tc; b.style.borderColor=f.tc;
+  document.getElementById('eTxt').textContent=f.txt;
+  document.getElementById('eSW').textContent=this.state.globalRoute.g;
+  document.getElementById('eSC').textContent=this.state.globalRoute.b;
+  document.getElementById('eSS').textContent=this.state.globalRoute.s;
+  document.getElementById('eItemN').textContent=f.itemN;
+  document.getElementById('eItemD').textContent=f.itemD;
+  const em=document.getElementById('eMap'); em.innerHTML='';
+  [...this.data.ENEMIES,this.data.DEALER].forEach(e=>{
+    const id=e.id||'dealer';
+    const r=this.state.savedRoutes[id];
+    const col=r==='g'?'#4aaa6a':r==='b'?'#aa3a3a':r==='s'?'#8a5ab8':e.col+'44';
+    const sym=r==='g'?'♥':r==='b'?'♠':r==='s'?'♦':'?';
+    const nd=document.createElement('div'); nd.className='e-mn';
+    nd.innerHTML=`<div class="e-mico" style="color:${col}">${e.icon}</div><div style="color:${col};font-size:9px;margin-top:2px">${sym}</div><div style="color:#3a2a4a;font-size:9px">${e.name||'Dealer'}</div>`;
+    em.appendChild(nd);
+  });
+  this.show('sE');
+  }
+
+  /* ============================================================
+   LIVRO DE MEMÓRIAS
+   ============================================================ */
+  renderBook(){
+  const grid=document.getElementById('bkGrid');
+  document.getElementById('bkEntry').style.display='none';
+  grid.style.display='';
+  grid.innerHTML='';
+  Object.entries(this.data.BOOK_ENTRIES).forEach(([id,e])=>{
+    const unlocked=this.state.bookUnlocks[id]&&Object.keys(this.state.bookUnlocks[id]).length>0;
+    const enData=this.data.ENEMIES.find(x=>x.id===id);
+    const col=enData?enData.col:this.data.DEALER.col;
+    const card=document.createElement('div');
+    card.className='bk-card'+(unlocked?'':' locked');
+    card.innerHTML=`<div class="bk-cicon" style="color:${unlocked?col:'#2a1a3a'}">${e.icon}</div><div class="bk-cname" style="color:${unlocked?'#c0a8d8':'#2a1a3a'}">${e.name}</div><div class="bk-csub" style="color:${unlocked?'#5a4a6a':'#1a1428'}">${e.sub}</div>`;
+    if(unlocked) card.onclick=()=>this.openEntry(id,e,col);
+    grid.appendChild(card);
+  });
+  }
+
+  openEntry(id,e,col){
+  document.getElementById('bkGrid').style.display='none';
+  const entry=document.getElementById('bkEntry'); entry.style.display='block';
+  document.getElementById('bkEName').textContent=e.name; document.getElementById('bkEName').style.color=col;
+  document.getElementById('bkESub').textContent=e.sub;
+  const cont=document.getElementById('bkEContent'); cont.innerHTML='';
+  const unlocks=this.state.bookUnlocks[id]||{};
+  e.sections.forEach(sec=>{
+    const avail=!sec.unlocked||(sec.unlocked==='g'&&unlocks.g)||(sec.unlocked==='b'&&unlocks.b)||(sec.unlocked==='s'&&unlocks.s)||(sec.unlocked==='both'&&unlocks.both);
+    const div=document.createElement('div'); div.className='bk-sec';
+    if(avail){
+      div.innerHTML=`<div class="bk-sec-lbl" style="color:${col}88;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">${sec.lbl}</div><div class="bk-sec-txt" style="color:#8a7a9a">${sec.txt}</div>`;
+    } else {
+      div.innerHTML=`<div class="bk-sec-lbl" style="color:#2a1a3a;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">${sec.lbl}</div><div class="bk-sec-txt" style="color:#1e1828;font-style:italic">[ Desbloqueado ao explorar este caminho ]</div>`;
+    }
+    cont.appendChild(div);
+  });
+  }
+
+  /* ============================================================
+   INIT
+   ============================================================ */
+
+
+  shakeTable() {
+    document.body.classList.add('shake');
+    window.setTimeout(() => document.body.classList.remove('shake'), 240);
+  }
+
+  applyRandomEvent() {
+    const event = this.randomEvents.roll();
+    if (!event) return;
+    this.state.psy = Math.max(0, Math.min(100, this.state.psy + (event.psy || 0)));
+    this.state.spec = Math.max(0, Math.min(100, this.state.spec + (event.spec || 0)));
+    this.state.gold += event.gold || 0;
+    this.setMsg(event.text, 'rd');
+  }
+
+  saveGame() {
+    this.saveSystem.save(this.state);
+  }
+
+  loadGame() {
+    const saved = this.saveSystem.load();
+    if (!saved) return false;
+    this.state = saved;
+    this.goMap();
+    return true;
+  }
+
+  clearSave() {
+    this.saveSystem.clear();
+  }
+}
+
+export async function bootstrapGame() {
+  const response = await fetch('data/game-data.json');
+  const data = await response.json();
+  window.game = new BlackjackGame(data);
+  window.game.renderTit();
+
+  ['showTit','openBook','closeBook','closeBkEntry','newGame','goMap','goShop','startBattle','deal','hit','stand','useItem'].forEach((method) => {
+    window[method] = (...args) => window.game[method](...args);
+  });
+}
+
 
EOF
)
