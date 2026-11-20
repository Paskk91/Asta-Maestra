import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const rawHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const html = rawHtml.replace(/<script type="module"[^>]*><\/script>/, '');

const rawApp = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
const app = rawApp.replace(/^import \* as Sync.*$/m, '');

const syncStub = `
const Sync={
  configured:false,
  localRevision:()=>0,
  setLocalRevision:()=>{},
  currentUser:async()=>null,
  onAuthChange:()=>()=>{},
  pull:async()=>null,
  push:async()=>({accepted:true,revision:1,updatedAt:new Date().toISOString()}),
  signIn:async()=>null,
  signUp:async()=>null,
  signOut:async()=>{}
};`;

export function boot(opts = {}) {
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: opts.url || 'https://example.com/',
    beforeParse(w) {
      w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      w.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      w.AudioContext = class {
        state = 'running'; currentTime = 0; sampleRate = 44100;
        resume() {}
        createOscillator() { return { frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; }, start() {}, stop() {}, type: '' }; }
        createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; } }; }
        createBuffer() { return { getChannelData() { return new Float32Array(100); } }; }
        createBufferSource() { return { buffer: null, connect() { return this; }, start() {} }; }
        createBiquadFilter() { return { type: '', frequency: { value: 0 }, connect() { return this; } }; }
        get destination() { return {}; }
      };
      w.navigator.vibrate = () => true;
      if (!w.structuredClone) w.structuredClone = o => JSON.parse(JSON.stringify(o));
      w.DecompressionStream = class {};
      w.HTMLElement.prototype.scrollIntoView = function () {};
      w.HTMLElement.prototype.requestFullscreen = function () { return Promise.resolve(); };
      w.document.exitFullscreen = function () { return Promise.resolve(); };
      if (opts.seed) for (const [k, v] of Object.entries(opts.seed)) w.localStorage.setItem(k, v);
      w.addEventListener('error', e => errors.push(e.error?.stack || e.message));
    }
  });
  const w = dom.window;
  const script = w.document.createElement('script');
  script.textContent = syncStub + '\n' + app;
  w.document.head.appendChild(script);
  return { dom, w, d: w.document, errors };
}

export function click(w, selector) {
  const el = w.document.querySelector(selector);
  if (el) el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  return Boolean(el);
}

export function settle(ms = 650) {
  return new Promise(r => setTimeout(r, ms));
}
