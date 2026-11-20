import test from 'node:test';
import assert from 'node:assert/strict';
import { boot, click, settle } from './harness.js';

const seedPlayers = w => w.eval(`(()=>{
  const roles=['P','D','C','A'],rms={P:'Por',D:'Dc',C:'M',A:'Pc'};
  state.players=Array.from({length:20},(_,i)=>{const r=roles[i%4];return{key:'k'+i,name:'Giocatore '+i,role:r,rm:rms[r],team:'Squadra '+(i%5),qt:10+i,qti:8+i,diff:i-8,fvm:40+i*9,mantra:[]}});
  computeValues(state.players);renderAll();commit('setup');
})()`);

test('avvio pulito e assenza di errori', async () => {
  const { w, d, errors, dom } = boot();
  await settle();
  assert.equal(w.eval('state.players.length'), 0);
  assert.equal(w.eval('state.leagueName===""&&state.myName===""&&state.teams.every(t=>t.name==="")'), true);
  assert.ok(d.getElementById('pulseCard').classList.contains('hidden'));
  assert.ok(d.querySelector('[data-action="reset-all"]'));
  assert.ok(d.querySelector('[data-action="league-report"]'));
  assert.ok(d.getElementById('presentMode'));
  assert.equal(errors.length, 0);
  dom.window.close();
});

test('?fresh=1 rimuove i dati locali', async () => {
  const { w, d, dom, errors } = boot({
    url: 'https://example.com/?fresh=1',
    seed: { astamaestra_v5: JSON.stringify({ leagueName: 'Vecchia Lega', players: [], teams: [] }) }
  });
  await settle();
  assert.equal(w.eval('state.leagueName'), '');
  assert.ok(!(w.localStorage.getItem('astamaestra_v5') || '').includes('Vecchia Lega'));
  assert.ok(d.getElementById('guardBanner').classList.contains('show'));
  assert.equal(errors.length, 0);
  dom.window.close();
});

test('import CSV, acquisto, undo/redo e report', async () => {
  const { w, d, errors, dom } = boot();
  await settle();
  click(w, '[data-action="toggle-paste"]');
  d.getElementById('pasteCsv').value = 'Id,R,RM,Nome,Squadra,Qt.A,Qt.I,Diff.,FVM\n1,P,Por,Portiere Test,A,17,9,8,64\n2,D,Dc,Difensore Test,B,20,18,2,90\n3,C,M,Centro Test,A,25,22,3,96\n4,A,Pc,Attacco Test,B,30,28,2,110';
  click(w, '[data-action="paste-import"]');
  await settle(200);
  click(w, '#modalOkBtn');
  await settle(250);
  assert.equal(w.eval('state.players.length'), 4);
  assert.ok(d.getElementById('cheatSheet').textContent.includes('Portiere Test'));
  w.eval(`(()=>{const p=state.players[0];state.teams[0].players.push({...p,price:2,fair:20});commit('acquisto')})()`);
  assert.equal(w.eval('state.teams[0].players.length'), 1);
  w.eval('undo()');
  assert.equal(w.eval('state.teams[0].players.length'), 0);
  w.eval('redo()');
  assert.equal(w.eval('state.teams[0].players.length'), 1);
  click(w, '[data-action="league-report"]');
  assert.ok(d.getElementById('leagueReport').textContent.includes('CLASSIFICA FINALE'));
  assert.equal(errors.length, 0);
  dom.window.close();
});

test('override valore e tema presentazione', async () => {
  const { w, d, errors, dom } = boot();
  await settle();
  seedPlayers(w);
  await settle(150);
  const before = w.eval('state.players[2].value');
  w.eval('openDrawer("k2")');
  click(w, '[data-action="override-edit"]');
  d.getElementById('overrideVal').value = '95';
  click(w, '[data-action="override-save"]');
  assert.equal(w.eval('state.players[2].value'), 95);
  assert.ok(d.getElementById('drawerBody').textContent.includes('FORZATO'));
  w.eval('undo()');
  assert.equal(w.eval('state.players[2].value'), before);
  w.eval('redo()');
  assert.equal(w.eval('state.players[2].value'), 95);
  click(w, '#presentThemeBtn');
  assert.ok(d.getElementById('presentMode').classList.contains('light'));
  assert.equal(w.localStorage.getItem('astamaestra_present_theme'), 'light');
  assert.equal(errors.length, 0);
  dom.window.close();
});

test('stato asta: verdetto, reparti e badge console', async () => {
  const { w, d, errors, dom } = boot();
  await settle();
  seedPlayers(w);
  await settle(150);
  assert.ok(!d.getElementById('pulseCard').classList.contains('hidden'));
  assert.ok(d.getElementById('pulseBadge').textContent.length > 0);
  assert.equal(d.querySelectorAll('#pulseRoles .pulse-role').length, 4);
  assert.equal(d.getElementById('cPulse').textContent, d.getElementById('pulseBadge').textContent);
  w.eval('(()=>{state.teams[0].players=[];for(let i=0;i<12;i++)state.teams[0].players.push({...state.players[i],price:41,fair:fairOf(state.players[i].key)});renderAll()})()');
  assert.equal(d.getElementById('pulseBadge').textContent, 'Spendi troppo');
  click(w, '[data-action="pulse-hide"]');
  assert.ok(d.getElementById('pulseCard').classList.contains('hidden'));
  const chk = d.getElementById('setPulse');
  chk.checked = true;
  chk.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.ok(!d.getElementById('pulseCard').classList.contains('hidden'));
  assert.equal(errors.length, 0);
  dom.window.close();
});
