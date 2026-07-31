#!/usr/bin/env node
/* Stay the Hire — UI smoke test (requires: npm install jsdom).
   Boots index.html in jsdom and clicks through: menu → name entry → role select →
   map → combat (plays cards, ends turns) → verifies screens render without errors.
   Run: node tests/ui-smoke.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;

let failures = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { failures++; console.error('  ✗ FAIL:', msg); } else console.log('  ✓', msg); };

for (const src of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1])) {
  window.eval(fs.readFileSync(path.join(root, src), 'utf8'));
}
const doc = window.document;
const click = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const text = () => doc.body.textContent;

/* menu */
ok(text().includes('STAY') && text().includes('HIRE'), 'main menu renders the game title');
ok(text().includes('Author: nedesblade'), 'author credit on main menu');
ok(/reorguelike deck-builder/i.test(text()), 'subtitle on main menu');

/* visual mode toggle */
ok(doc.querySelector('[data-act="mode-spire"]'), 'visual mode switch present on menu');
click(doc.querySelector('[data-act="mode-spire"]'));
ok(doc.body.dataset.theme === 'spire', 'Spire Satire mode activates');
click(doc.querySelector('[data-act="mode-pony"]'));
ok(doc.body.dataset.theme === 'pony', 'Office Pony mode restores');

/* credits */
click(doc.querySelector('[data-act="credits"]'));
ok(text().includes('Author: nedesblade'), 'author credit on credits screen');
click(doc.querySelector('[data-act="menu"]'));

/* new run → name entry */
click(doc.querySelector('[data-act="newrun"]'));
ok(doc.querySelector('#playername'), 'name entry screen appears for new player');
doc.querySelector('#playername').value = 'Smoke Tester';
click(doc.querySelector('[data-act="savename"]'));

/* role select */
ok(text().includes('Choose your starting role'), 'role selection screen renders');
ok(text().includes('Your New Employer'), 'procedural company profile shown');
ok(doc.querySelectorAll('[data-role]').length === 8, 'all 8 roles offered');
click(doc.querySelector('[data-role="developer"]'));

/* map */
ok(text().includes('Career Ladder'), 'career map renders');
ok(text().includes('Entry-Level Chaos'), 'Act 1 title shown');
const availNodes = doc.querySelectorAll('[data-node]');
ok(availNodes.length >= 1, 'map has clickable starting nodes');

/* deck viewer */
click(doc.querySelector('[data-act="viewdeck"]'));
ok(doc.querySelectorAll('#deckmodal .card').length >= 10, 'deck modal shows starting deck');
click(doc.querySelector('#deckmodal .btn'));

/* enter first fight (row 0 is always fights) */
click(doc.querySelector('[data-node]'));
ok(doc.querySelector('.enemy'), 'combat screen renders enemies');
ok(doc.querySelector('.intent'), 'enemy intent is visible');
ok(doc.querySelectorAll('.hand .card').length >= 5, 'opening hand rendered');
ok(text().includes('Influence'), 'influence shown');

/* play cards + end turns until combat resolves (bot-ish) */
(async () => {
let guard = 0;
while (doc.querySelector('.enemy') && !text().includes('Encounter Survived') && guard++ < 200) {
  const playable = doc.querySelector('.hand .card.playable');
  if (playable) {
    click(playable);
    await new Promise(r => setTimeout(r, 190)); // let the play animation timeout resolve
    const target = doc.querySelector('.enemy.targetable');
    if (target) { click(target); await new Promise(r => setTimeout(r, 190)); }
  } else {
    const end = doc.querySelector('[data-act="endturn"]');
    if (!end) break;
    click(end);
  }
  if (text().includes('Career Retrospective')) break; // burned out — also a valid outcome
}
const resolved = text().includes('Encounter Survived') || text().includes('Career Retrospective');
ok(resolved, 'first combat resolves via real card play (won or burned out)');

if (text().includes('Encounter Survived')) {
  const cardPick = doc.querySelector('[data-pick]');
  if (cardPick) click(cardPick);
  ok(text().includes('Career Ladder'), 'card reward claimed, back on the map');
}

/* personnel file persists name */
window.eval(`document.querySelector('#app').innerHTML='';`);
const profile = JSON.parse(window.localStorage.getItem('stayTheHire.profile.v1'));
ok(profile && profile.name === 'Smoke Tester', 'player name persisted to localStorage');

console.log(`\n${checks} checks, ${failures} failures`);
process.exit(failures ? 1 : 0);
})();
