/* Pine — 调酒应用主程序（原生 JS，无需构建） */
(() => {
  'use strict';
  const D = window.PINE_DATA, W = window.PINE_WIKI;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uniq = a => [...new Set(a)];
  const fmt = n => (Math.round(n * 10) / 10).toString();

  // ---------------------------------------------------------------- 图标
  const P = {
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    find: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    bar: '<path d="M9 2h6M10 2v4l-2 3v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9l-2-3V2"/><path d="M8 13h8"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    heart: '<path d="M12 20s-7-4.5-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
    heartf: '<path fill="currentColor" d="M12 20s-7-4.5-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
    shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    share: '<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4 2v-8z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.4 11h11.2L21 7H6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    party: '<path d="M4 20l5-14 9 9z"/><path d="M14 4l1-2M19 9l2-1M17 5l3-3"/>',
    swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-15-1 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
  };
  const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;
  const LOGO = `<svg viewBox="0 0 64 64"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c987"/><stop offset="1" stop-color="#c58a3c"/></linearGradient></defs><path d="M32 6 L46 24 H39 L50 38 H41 L52 52 H12 L23 38 H14 L25 24 H18 Z" fill="url(#lg)"/><rect x="29" y="52" width="6" height="7" rx="1.5" fill="#6fa585"/></svg>`;

  // ---------------------------------------------------------------- 存储
  const KEY = 'pine.v1';
  const DEF_SET = { unit: 'ml', theme: 'auto', flex: true, staples: true, brands: true, age: false };
  let store;
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  store = Object.assign({ favs: [], notes: {}, rate: {}, made: {}, hist: [], bar: [], mine: [], party: [] }, store);
  store.set = Object.assign({}, DEF_SET, store.set || {});
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { toast('存储空间不可用，本次修改不会被保存'); } };

  // ---------------------------------------------------------------- 材料
  const ING = Object.fromEntries(D.ingredients.map(x => [x.id, x]));
  const KIDS = {};
  D.ingredients.forEach(x => { if (x.parent) (KIDS[x.parent] = KIDS[x.parent] || []).push(x.id); });
  const desc = id => (KIDS[id] || []).flatMap(k => [k, ...desc(k)]);
  const anc = id => { const out = []; let p = ING[id] && ING[id].parent; while (p) { out.push(p); p = ING[p].parent; } return out; };
  const CAT_L = Object.fromEntries(D.cats);
  const BASE_L = Object.fromEntries(D.bases);
  const ingName = id => (ING[id] || {}).zh || id;
  const EQUIV = { lime: 'lime_juice', lime_juice: 'lime', lemon: 'lemon_juice', lemon_juice: 'lemon', sugar: 'simple_syrup', simple_syrup: 'sugar' };
  // 可替换：同父级兄弟、父级、子级、配方给出的替代（strict 的材料不推荐兄弟替换）
  function swaps(id, extra = []) {
    const g = ING[id]; if (!g) return [];
    let out = [...extra, ...desc(id)];
    if (g.parent) {
      out.push(g.parent);
      if (!g.strict) out.push(...(KIDS[g.parent] || []).filter(k => !ING[k].strict));
    }
    if (EQUIV[id]) out.push(EQUIV[id]);
    return uniq(out).filter(x => x !== id && ING[x] && x !== 'citrus');
  }

  // ---------------------------------------------------------------- 标签
  const METHOD_ZH = { build: '兑和', stir: '搅拌', shake: '摇和', dry_shake: '干摇', throw: '抛酒', roll: '滚动', muddle: '捣压', blend: '搅打', float: '漂浮', swizzle: '旋搅', heat: '加热', carbonate: '充气' };
  const METHOD_EN = Object.fromEntries(W.methods.map(m => [m.id, m.en]));
  const methodL = m => `${METHOD_EN[m] || m} ${METHOD_ZH[m] || ''}`.trim();
  const GLASS = Object.fromEntries(W.glasses.map(g => [g.id, g]));
  const glassL = g => (GLASS[g] || {}).zh || '';
  const ICE_L = Object.fromEntries(W.ice.map(g => [g.id, g.zh]));
  const FAM = Object.fromEntries(D.families.map(f => [f.id, f]));
  const FLAVOR_L = { sour: '酸', sweet: '甜', bitter: '苦', fruity: '果香', herbal: '草本', floral: '花香', smoky: '烟熏', creamy: '奶香', coffee: '咖啡', spicy: '辛香', nutty: '坚果', savory: '咸鲜', fresh: '清爽', dry: '干爽', strong: '浓烈', hot: '热饮' };
  const STR_L = { zero: '无酒精', low: '低度', medium: '中度', strong: '高度' };
  const SRC_L = Object.assign({}, D.src, { mine: '我的配方' });
  const BASE_COLOR = { gin: '#cfe3e0', vodka: '#e5ebf0', rum: '#c98a3c', agave: '#d9cf82', whisky: '#b5651d', brandy: '#8e3b1d', baijiu: '#efe6c8', other: '#9cc13c', low: '#e0705e', zero: '#7fc6a4' };

  // ---------------------------------------------------------------- 计算
  const UNIT_ML = { ml: 1, dash: 0.8, drop: 0.05, bsp: 5, tsp: 5 };
  const SUGARS = new Set(['sugar', 'brown_sugar', 'sugar_cube']);
  function grams(x) { return x.unit === 'g' ? x.amt : x.unit === 'tsp' || x.unit === 'bsp' ? x.amt * 4 : x.unit === 'pc' ? x.amt * 4 : x.amt * 0.8; }
  function volOf(x, r) {
    const g = ING[x.i] || ING.other;
    if (x.unit === 'top') return ['mixer', 'wine'].includes(g.cat) ? (r && r.glass === 'highball' ? 100 : 60) : 0;
    if (x.amt == null) return 0;
    if (SUGARS.has(x.i)) return grams(x) * 0.6;
    if (UNIT_ML[x.unit]) return x.amt * UNIT_ML[x.unit];
    if (x.unit === 'g') return g.cat === 'syrup' ? x.amt * 0.7 : ['juice'].includes(g.cat) ? x.amt : 0;
    if (x.unit === 'pc' && (x.i === 'lime' || x.i === 'lemon')) return x.amt * 6;
    return 0;
  }
  const DIL = { shake: 0.28, dry_shake: 0.3, stir: 0.2, throw: 0.15, roll: 0.15, blend: 0.45, swizzle: 0.25, muddle: 0.15, build: 0.1, heat: 0, carbonate: 0.05, float: 0 };
  function analyze(r) {
    let vol = 0, alc = 0, sweet = 0, sour = 0, bitter = 0;
    for (const x of r.ings) {
      const g = ING[x.i] || ING.other, v = volOf(x, r);
      vol += v; alc += v * (g.abv || 0) / 100;
      sweet += SUGARS.has(x.i) && x.amt != null ? grams(x) * 1.5 : v * (g.sw || 0);
      sour += v * (g.so || 0);
      bitter += v * (g.bi || 0) * (g.cat === 'bitters' ? 3 : 1);
    }
    const ms = r.methods || [];
    let dil = Math.max(0, ...ms.map(m => DIL[m] ?? 0.1));
    if (r.ice === 'none' && ms.every(m => ['build', 'float', 'heat'].includes(m))) dil = 0;
    if (r.batch) dil = 0;
    let abv = vol ? alc / (vol * (1 + dil)) * 100 : 0;
    let abvSrc = '估算';
    if (r.abvSheet != null && !isNaN(r.abvSheet)) { abv = +r.abvSheet; abvSrc = '标注'; }
    const base = Math.max(vol, 1) / 100;
    return { vol, alc, abv, abvSrc, dil, sweet: sweet / base, sour: sour / base, bitter: bitter / base };
  }
  function inferTags(r, a) {
    const t = new Set(r.tags || []);
    const ids = r.ings.map(x => x.i), has = (...k) => k.some(i => ids.includes(i));
    const cats = ids.map(i => (ING[i] || {}).cat);
    if (a.sour >= 10) t.add('sour');
    if (a.sweet >= 14 || (a.sweet > 6 && a.sweet > a.sour * 1.4)) t.add('sweet');
    if (a.bitter >= 8) t.add('bitter');
    if (has('pineapple_juice', 'passion_puree', 'cranberry_juice', 'orange_juice', 'grapefruit_juice', 'peach_juice', 'grape_juice', 'apple_juice', 'pear_juice', 'strawberry', 'berries', 'raspberry_liqueur', 'blackberry_liqueur', 'cassis', 'peach_liqueur', 'melon_liqueur', 'banana_liqueur', 'apricot_liqueur', 'cherry_liqueur', 'lychee_liqueur', 'coconut_liqueur', 'coconut_cream', 'jam', 'passion_syrup', 'raspberry_syrup', 'yuzu_liqueur', 'umeshu', 'limoncello', 'sloe_gin', 'apple_liqueur', 'pear_liqueur')) t.add('fruity');
    if (has('chartreuse_green', 'chartreuse_yellow', 'benedictine', 'mint', 'basil', 'shiso', 'rosemary', 'absinthe', 'fernet', 'drambuie', 'menthe', 'pimms', 'gentian', 'cynar', 'mastiha')) t.add('herbal');
    if (has('mezcal', 'peated_scotch')) t.add('smoky');
    if (has('cream', 'milk', 'egg_yolk', 'egg', 'irish_cream', 'coconut_cream', 'yogurt', 'oat_milk') || (has('egg_white') && !t.has('sour'))) t.add('creamy');
    if (has('espresso', 'coffee', 'coffee_liqueur')) t.add('coffee');
    if (has('ginger', 'ginger_beer', 'ginger_ale', 'ginger_honey', 'chili', 'hot_sauce', 'cinnamon', 'cinnamon_syrup', 'pepper', 'allspice_dram', 'clove')) t.add('spicy');
    if (has('elderflower', 'violette', 'osmanthus', 'orange_flower_water', 'lychee_liqueur', 'elderflower_syrup')) t.add('floral');
    if (has('amaretto', 'orgeat', 'hazelnut_liqueur')) t.add('nutty');
    if (has('salt', 'tomato_juice', 'olive_brine', 'olive', 'worcestershire')) t.add('savory');
    if (cats.includes('mixer') && a.abv < 14 && !has('cola', 'milk')) t.add('fresh');
    if (a.abv >= 24) t.add('strong');
    if (a.sweet < 4 && a.sour < 4 && a.abv > 18) t.add('dry');
    if ((r.methods || []).includes('heat') || r.glass === 'hot' || r.hot) t.add('hot');
    return [...t];
  }
  const COLORS = {
    campari: ['#c8102e', 3], aperol: ['#f26b21', 3], aperitivo: ['#c8102e', 3], grenadine: ['#b0122b', 4], cranberry_juice: ['#b3243b', 2],
    tomato_juice: ['#b6311f', 3], raspberry_liqueur: ['#8a1538', 3], blackberry_liqueur: ['#4a0f2a', 4], cassis: ['#4a0f2a', 4], red_wine: ['#5a1222', 3],
    sweet_vermouth: ['#7a2e12', 2], coffee_liqueur: ['#2b160c', 4], espresso: ['#2b160c', 4], coffee: ['#3b1d0e', 3], cola: ['#3b1d0e', 3],
    orange_juice: ['#f0a020', 2], blood_orange_juice: ['#d2452b', 2], pineapple_juice: ['#f3d36b', 1.5], passion_puree: ['#f2b83b', 2], grapefruit_juice: ['#f4a38a', 1.5],
    menthe: ['#2e9e52', 4], chartreuse_green: ['#9cc13c', 3], chartreuse_yellow: ['#e3c84a', 2], melon_liqueur: ['#7cc142', 3], violette: ['#8d86c9', 3],
    curacao: ['#e7a33c', 1], cream: ['#f3ead8', 2], milk: ['#f3ead8', 2], irish_cream: ['#d9b98c', 2], coconut_cream: ['#f5f0e4', 2], egg_yolk: ['#f2cf5b', 2],
    bourbon: ['#b5651d', 1.2], rye: ['#b5651d', 1.2], scotch: ['#c07a2a', 1.2], peated_scotch: ['#c08a3a', 1], whisky: ['#b5651d', 1.2], irish: ['#c98a3c', 1],
    cognac: ['#9a4a1c', 1.2], brandy: ['#9a4a1c', 1.2], aged_rum: ['#9a541c', 1.2], dark_rum: ['#5e2c0c', 2], spiced_rum: ['#8a4a1a', 1.2], gold_rum: ['#c98a3c', 1],
    amaro: ['#4a2010', 2], averna: ['#3a180c', 2], fernet: ['#2b1a10', 2], montenegro: ['#b8642a', 1.5], cynar: ['#3a2410', 2], tea: ['#a0602a', 1.5],
    absinthe: ['#b7c98a', 1], sloe_gin: ['#8a1538', 3], cherry_liqueur: ['#6a0f1f', 3], maraschino: ['#efe9dc', .5], benedictine: ['#c8862e', 1],
    apricot_liqueur: ['#e3a04a', 1.5], amaretto: ['#b5651d', 1.2], drambuie: ['#c8862e', 1], honey_syrup: ['#e6b24c', .6], maple_syrup: ['#a8601c', 1],
    peach_juice: ['#f3b27a', 1.5], apple_juice: ['#e8c66a', 1], grape_juice: ['#5a1a4a', 3], lillet_blanc: ['#efd98a', .6], sparkling_wine: ['#f1e3a6', .6],
    yogurt: ['#f4efe6', 2], oat_milk: ['#eadcc0', 2], dubonnet: ['#5a1222', 3], beer: ['#e0a63a', 2], lime_juice: ['#e3ec9a', .4], lemon_juice: ['#f1ec9a', .4],
  };
  function colorOf(r) {
    let R = 0, G = 0, B = 0, wt = 0;
    for (const x of r.ings) {
      const c = COLORS[x.i]; if (!c) continue;
      const w = Math.max(volOf(x, r), 2) * c[1];
      const n = parseInt(c[0].slice(1), 16);
      R += (n >> 16) * w; G += ((n >> 8) & 255) * w; B += (n & 255) * w; wt += w;
    }
    if (!wt) return '#d8cfb6';
    // 清澈的部分把颜色往浅处拉
    const clear = r.ings.reduce((s, x) => s + (COLORS[x.i] ? 0 : volOf(x, r)), 0);
    const k = wt / (wt + clear * 0.35);
    const mix = (v, i) => Math.round(v / wt * k + [232, 226, 206][i] * (1 - k));
    return '#' + [mix(R, 0), mix(G, 1), mix(B, 2)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const shade = (hex, p) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v + (p < 0 ? v : 255 - v) * p))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
  const grad = c => `linear-gradient(155deg, ${shade(c, .25)} 0%, ${c} 45%, ${shade(c, -.55)} 100%)`;
  function basesOf(r) {
    const b = uniq(r.ings.filter(x => { const g = ING[x.i]; return g && g.base && (g.cat === 'spirit' || x.i === 'soju') && (volOf(x, r) >= 7.5 || x.unit === 'pc'); }).map(x => ING[x.i].base));
    return b;
  }

  // ---------------------------------------------------------------- 配方索引
  let ALL = [], BY = {}, META = new Map();
  function reindex() {
    ALL = [...D.recipes, ...store.mine.map(m => Object.assign({ src: 'mine' }, m))];
    BY = Object.fromEntries(ALL.map(r => [r.id, r]));
    META = new Map();
    for (const r of ALL) {
      const a = analyze(r);
      let bases = basesOf(r);
      if (!bases.length) bases = [a.abv < 0.5 && !r.abvSheet ? 'zero' : 'low'];
      if (r.abvSheet === 0) bases = ['zero'];
      const strength = a.abv < 0.5 ? 'zero' : a.abv < 12 ? 'low' : a.abv < 22 ? 'medium' : 'strong';
      const ids = new Set(r.ings.map(x => x.i));
      const text = [r.zh, r.en, r.by, ...r.ings.map(x => ingName(x.i) + ' ' + (x.raw || '')), r.garnish].join(' ').toLowerCase();
      META.set(r.id, { a, bases, strength, tags: inferTags(r, a), color: colorOf(r), ids, text });
    }
  }
  const M = r => META.get(r.id);

  // ---------------------------------------------------------------- 吧台匹配
  let BAR = new Set(store.bar);
  function ingStatus(x) {
    const g = ING[x.i] || ING.other;
    if (x.opt) return 'skip';
    if (store.set.staples && (g.staple || ['water', 'salt', 'pepper'].includes(x.i))) return 'ok';
    if (BAR.has(x.i) || (EQUIV[x.i] && BAR.has(EQUIV[x.i]))) return 'ok';
    if (desc(x.i).some(d => BAR.has(d))) return 'ok';
    const up = anc(x.i);
    if (up.some(a => BAR.has(a))) return g.strict ? (store.set.flex ? 'sub' : 'miss') : 'ok';
    if (store.set.flex) {
      if ((x.alts || []).some(a => BAR.has(a))) return 'sub';
      if (!g.strict && g.parent && desc(g.parent).some(d => BAR.has(d) && !ING[d].strict)) return 'sub';
    }
    return 'miss';
  }
  function barCheck(r) {
    const miss = [], sub = [];
    for (const x of r.ings) { const s = ingStatus(x); if (s === 'miss') miss.push(x.i); else if (s === 'sub') sub.push(x.i); }
    return { miss: uniq(miss), sub: uniq(sub) };
  }
  function barSummary() {
    const can = [], one = [], two = [], buy = {};
    if (!BAR.size) return { can, one, two, buy: [] };
    for (const r of ALL) {
      const c = barCheck(r);
      if (!c.miss.length) can.push(r); else if (c.miss.length === 1) { one.push(r); buy[c.miss[0]] = (buy[c.miss[0]] || 0) + 1; } else if (c.miss.length === 2) two.push(r);
    }
    return { can, one, two, buy: Object.entries(buy).sort((a, b) => b[1] - a[1]).slice(0, 10) };
  }

  // ---------------------------------------------------------------- 用量显示
  function amtText(x, mult = 1) {
    if (x.unit === 'top') return '加满';
    if (x.amt == null) return x.text && x.text.length < 6 ? x.text : '适量';
    const u = store.set.unit;
    const a = x.amt * mult, mx = x.max ? x.max * mult : null;
    const num = v => {
      if (x.unit === 'ml' && u === 'oz') { const oz = v / 30; const q = Math.round(oz * 4) / 4; return (q === Math.floor(q) ? q : q.toFixed(2).replace(/0$/, '')) ; }
      return fmt(v);
    };
    const UNIT = { ml: u === 'oz' ? 'oz' : 'ml', dash: 'dash', drop: '滴', bsp: '吧勺', tsp: '茶匙', g: 'g', pc: '' };
    let unit = UNIT[x.unit] ?? '';
    if (x.unit === 'pc') { const m = (x.text || '').match(/[块片个颗根瓣枝撮份杯半]/); unit = m ? m[0] : '个'; }
    const range = x.min != null ? `${num(x.min * mult)}~${num((x.max || x.amt) * mult)}` : mx ? `${num(a)}~${num(mx)}` : num(a);
    return range + ' ' + unit;
  }

  // ---------------------------------------------------------------- 酒杯图
  const GL = {
    cocktail: ['M10 15 L90 15 L52 62 L48 62 Z', 'M50 62 V105 M32 108 H68', 24],
    coupe: ['M12 30 Q12 62 50 64 Q88 62 88 30 Z', 'M50 64 V106 M32 108 H68', 37],
    nicknora: ['M24 18 Q22 64 50 66 Q78 64 76 18 Z', 'M50 66 V106 M32 108 H68', 30],
    rocks: ['M18 50 L82 50 L78 108 L22 108 Z', '', 64],
    highball: ['M28 10 L72 10 L70 112 L30 112 Z', '', 24],
    flute: ['M38 8 L62 8 Q64 60 50 72 Q36 60 38 8 Z', 'M50 72 V108 M36 110 H64', 18],
    wine: ['M22 12 Q18 66 50 70 Q82 66 78 12 Z', 'M50 70 V107 M32 109 H68', 38],
    margarita: ['M8 18 L92 18 Q80 40 62 42 Q56 44 56 54 Q56 62 50 64 Q44 62 44 54 Q44 44 38 42 Q20 40 8 18 Z', 'M50 64 V106 M32 108 H68', 24],
    tiki: ['M26 12 L74 12 Q80 60 72 110 L28 110 Q20 60 26 12 Z', '', 22],
    hurricane: ['M30 8 L70 8 Q58 40 66 70 Q72 92 56 98 L44 98 Q28 92 34 70 Q42 40 30 8 Z', 'M50 98 V108 M34 110 H66', 20],
    mug: ['M18 28 L72 28 L72 110 L18 110 Z', 'M72 45 Q94 45 94 70 Q94 92 72 92', 40],
    julep: ['M24 20 L76 20 L72 110 L28 110 Z', '', 26],
    hot: ['M22 40 L76 40 L72 106 L26 106 Z', 'M76 52 Q92 52 90 72 Q88 90 73 90', 50],
    shot: ['M32 58 L68 58 L64 108 L36 108 Z', '', 66],
    snifter: ['M30 22 Q12 50 24 70 Q36 82 50 82 Q64 82 76 70 Q88 50 70 22 Z', 'M50 82 V106 M34 108 H66', 56],
    special: ['M32 18 Q20 30 22 60 Q24 100 50 108 Q76 100 78 60 Q80 30 68 18 Z', '', 38],
  };
  let glId = 0;
  function glassSvg(g, color, cls = 'glass-art') {
    const s = GL[g] || GL.rocks; const id = 'gc' + (++glId);
    return `<svg class="${cls}" viewBox="0 0 100 125"><defs><clipPath id="${id}"><path d="${s[0]}"/></clipPath></defs>
      <rect x="0" y="${s[2]}" width="100" height="125" fill="${color}" opacity=".92" clip-path="url(#${id})"/>
      <path d="${s[0]}" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.9)" stroke-width="2.4" stroke-linejoin="round"/>
      ${s[1] ? `<path d="${s[1]}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.4" stroke-linecap="round"/>` : ''}</svg>`;
  }

  // ---------------------------------------------------------------- 通用 UI
  let toastT;
  function toast(msg, onClick) {
    let el = $('.toast'); if (el) el.remove();
    el = document.createElement('div'); el.className = 'toast'; el.innerHTML = msg;
    if (onClick) el.onclick = onClick;
    document.body.appendChild(el); clearTimeout(toastT);
    toastT = setTimeout(() => el.remove(), onClick ? 9000 : 2200);
  }
  function sheet(html, onMount) {
    closeSheet();
    const m = document.createElement('div'); m.className = 'sheet-mask';
    const s = document.createElement('div'); s.className = 'sheet'; s.innerHTML = '<div class="grab"></div>' + html;
    m.onclick = closeSheet;
    document.body.append(m, s);
    requestAnimationFrame(() => { m.classList.add('show'); s.classList.add('show'); });
    onMount && onMount(s);
    return s;
  }
  function closeSheet() {
    $$('.sheet-mask,.sheet').forEach(e => { e.classList.remove('show'); setTimeout(() => e.remove(), 220); });
  }
  const tagsHtml = (tags, n = 4) => tags.slice(0, n).map(t => `<span class="tag">${FLAVOR_L[t] || t}</span>`).join('');
  function card(r, extra = '') {
    const m = M(r);
    const ings = uniq(r.ings.filter(x => !['herb', 'fruit', 'other'].includes((ING[x.i] || {}).cat) || x.unit === 'ml').map(x => ingName(x.i))).slice(0, 5).join(' · ');
    return `<a class="rc" href="#/r/${encodeURIComponent(r.id)}">
      <div class="sw" style="background:${grad(m.color)}"></div>
      <div class="grow"><div class="t"><b>${esc(r.zh)}</b><i>${esc(r.en || '')}</i></div>
      <div class="ings">${esc(ings)}</div>
      <div class="tags">${r.src !== 'classic' ? `<span class="tag gold">${r.src === 'mine' ? '我的' : '特调'}</span>` : ''}${(r.methods || []).slice(0, 2).map(x => `<span class="tag pine">${METHOD_EN[x] || x}</span>`).join('')}${tagsHtml(m.tags, 2)}</div>${extra}</div>
      <div class="abv"><b>${m.a.abv < 0.5 ? '0' : fmt(m.a.abv)}%</b><span>${STR_L[m.strength]}</span></div></a>`;
  }
  const topbar = (title, back = true, right = '') => `<div class="topbar">${back ? `<button class="back" data-act="back">${ic('back')}</button>` : ''}<h1>${title}</h1>${right}</div>`;

  // ---------------------------------------------------------------- 路由
  const ROUTES = [];
  const route = (re, fn, tab) => ROUTES.push({ re, fn, tab });
  let lastHash = '';
  function render() {
    const h = location.hash.slice(1) || '/';
    let [path, qs] = h.split('?');
    path = path.split('#')[0];
    const q = Object.fromEntries(new URLSearchParams(qs || ''));
    for (const r of ROUTES) {
      const m = path.match(r.re);
      if (m) {
        const app = $('#app');
        stopTimers();
        app.innerHTML = `<div class="page">${r.fn(m.slice(1).map(decodeURIComponent), q)}</div>`;
        $$('.tabbar a').forEach(a => a.classList.toggle('on', a.dataset.tab === r.tab));
        if (h !== lastHash && !h.startsWith('/search')) window.scrollTo(0, 0);
        lastHash = h;
        AFTER.forEach(f => f()); AFTER.length = 0;
        return;
      }
    }
    location.hash = '#/';
  }
  const AFTER = [];
  const after = f => AFTER.push(f);
  const go = h => { location.hash = h; };

  // ================================================================= 发现
  let pickId = null;
  function randomPick(pool) {
    pool = pool && pool.length ? pool : ALL.filter(r => r.src !== 'mine' && !r.batch);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  route(/^\/$/, () => {
    if (!pickId || !BY[pickId]) pickId = randomPick().id;
    const p = BY[pickId], pm = M(p);
    const hr = new Date().getHours();
    const greet = hr < 5 ? '夜深了，来杯睡前酒？' : hr < 11 ? '早上好，今天也要清醒地微醺' : hr < 17 ? '下午好，来点开胃的？' : hr < 21 ? '晚上好，吧台已就绪' : '夜色正好，来一杯';
    const bs = barSummary();
    const colls = [['classic', '经典鸡尾酒', '历久弥新的标准配方'], ['signature', '创意特调', '浸泡 · 奶洗 · 低温慢煮']];
    const smart = [['easy', '新手入门', '≤4 种材料，无需自制'], ['fresh', '清爽气泡', '高球 · 菲士 · Spritz'], ['aperitif', '餐前开胃', '低度 · 微苦 · 起泡'],
      ['dessert', '餐后甜点', '奶香 · 咖啡 · 坚果'], ['zero', '无酒精', '人人都能喝'], ['hot', '热饮', '冬日暖身']];
    return `<div class="hello"><div class="logo">${LOGO}<h1 class="serif">Pine</h1></div><p>${greet}</p></div>
      <a class="search" href="#/search?focus=1">${ic('find')}<input placeholder="搜酒名、材料、品牌…" readonly tabindex="-1"></a>
      <div class="gap"></div>
      <div class="hero-pick" style="background:${grad(pm.color)}" data-act="open" data-id="${esc(p.id)}">
        <span class="lbl">今晚来一杯</span>
        <button class="shuffle" data-act="shuffle">${ic('shuffle')}换一杯</button>
        ${glassSvg(p.glass, 'rgba(255,255,255,.35)')}
        <h2 class="serif">${esc(p.zh)}</h2><div class="en">${esc(p.en || '')}</div>
        <div class="meta">${fmt(pm.a.abv)}% · ${(p.methods || []).map(x => METHOD_EN[x]).join(' + ')} · ${glassL(p.glass) || '—'}</div>
      </div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="motion">${ic('phone')}摇一摇换酒</button><button class="btn sm" data-act="quiz">${ic('quiz')}帮我选一杯</button></div>

      <div class="sec-title"><h2>按基酒</h2><a href="#/search">全部筛选 ›</a></div>
      <div class="grid-base">${D.bases.map(([id, zh]) => `<a href="#/search?base=${id}"><span class="dot" style="background:${BASE_COLOR[id]}"></span>${zh.split('/')[0]}</a>`).join('')}</div>

      <div class="sec-title"><h2>按调制方法</h2></div>
      <div class="chips scroll">${['build', 'stir', 'shake', 'throw', 'roll', 'muddle', 'blend', 'float', 'swizzle', 'heat'].map(m => `<a class="chip" href="#/search?method=${m}">${methodL(m)}</a>`).join('')}</div>
      <div class="sec-title"><h2>想要的味道</h2></div>
      <div class="chips scroll">${Object.entries(FLAVOR_L).map(([k, v]) => `<a class="chip" href="#/search?flavor=${k}">${v}</a>`).join('')}</div>
      <div class="sec-title"><h2>酒精度</h2></div>
      <div class="chips scroll">${Object.entries(STR_L).map(([k, v]) => `<a class="chip" href="#/search?str=${k}">${v}</a>`).join('')}</div>

      <div class="sec-title"><h2>我的吧台</h2><a href="#/bar">管理 ›</a></div>
      <a class="card bar-cta" href="#/bar" style="color:inherit">
        ${BAR.size ? `<div class="num">${bs.can.length}</div><div class="grow"><b>款现在就能调</b><div class="faint">还有 ${bs.one.length} 款只差 1 样材料</div></div>` :
        `<div class="num">${ic('bar')}</div><div class="grow"><b>告诉 Pine 你有哪些酒</b><div class="faint">按库存找出能调的鸡尾酒和采购建议</div></div>`}<span class="muted">›</span></a>

      <div class="sec-title"><h2>精选合集</h2></div>
      <div class="collections">${colls.map(([k, t, s]) => `<a class="coll" href="#/search?src=${k}"><b>${t}</b><span>${s} · ${ALL.filter(r => r.src === k).length} 款</span></a>`).join('')}
        ${smart.map(([k, t, s]) => `<a class="coll" href="#/search?smart=${k}"><b>${t}</b><span>${s}</span></a>`).join('')}</div>

      <div class="sec-title"><h2>配方骨架</h2><a href="#/wiki/families">全部 ›</a></div>
      <div class="chips scroll">${D.families.filter(f => f.slots.length).map(f => `<a class="chip" href="#/wiki/families#${f.id}">${f.zh}</a>`).join('')}</div>
      <p class="faint" style="margin-top:22px;text-align:center">理性饮酒 · 未成年人请勿饮酒 · 共收录 ${ALL.length} 款</p>`;
  }, 'home');

  // ================================================================= 找酒（筛选）
  const F = newFilter();
  function newFilter() { return { q: '', base: new Set(), baseAll: false, src: new Set(), method: new Set(), fin: new Set(), fout: new Set(), glass: new Set(), fam: new Set(), str: new Set(), ingIn: [], ingOut: [], abvMin: 0, abvMax: 45, can: false, noPrep: false, fav: false, smart: '', sort: 'def' }; }
  function applyQuery(q) {
    if (!Object.keys(q).length || q.focus) return;
    Object.assign(F, newFilter());
    if (q.base) q.base.split(',').forEach(x => F.base.add(x));
    if (q.method) F.method.add(q.method);
    if (q.flavor) F.fin.add(q.flavor);
    if (q.src) F.src.add(q.src);
    if (q.fam) F.fam.add(q.fam);
    if (q.str) F.str.add(q.str);
    if (q.ing) F.ingIn.push(q.ing);
    if (q.glass) F.glass.add(q.glass);
    if (q.smart) F.smart = q.smart;
    if (q.q) F.q = q.q;
    if (q.fav) F.fav = true;
  }
  function matchIng(m, id) { return m.ids.has(id) || desc(id).some(d => m.ids.has(d)); }
  function runFilter() {
    const q = F.q.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    let out = [];
    for (const r of ALL) {
      const m = M(r);
      if (F.src.size && !F.src.has(r.src)) continue;
      if (F.base.size && !(F.baseAll ? [...F.base].every(b => m.bases.includes(b)) : m.bases.some(b => F.base.has(b)))) continue;
      if (F.method.size && !(r.methods || []).some(x => F.method.has(x))) continue;
      if (F.fin.size && ![...F.fin].every(t => m.tags.includes(t))) continue;
      if (F.fout.size && [...F.fout].some(t => m.tags.includes(t))) continue;
      if (F.glass.size && !F.glass.has(r.glass)) continue;
      if (F.fam.size && !F.fam.has(r.family)) continue;
      if (F.str.size && !F.str.has(m.strength)) continue;
      if (m.a.abv < F.abvMin - 0.01 || (F.abvMax < 45 && m.a.abv > F.abvMax + 0.01)) continue;
      if (F.ingIn.some(id => !matchIng(m, id))) continue;
      if (F.ingOut.some(id => matchIng(m, id))) continue;
      if (F.noPrep && r.ings.some(x => x.prep)) continue;
      if (F.fav && !store.favs.includes(r.id)) continue;
      if (F.can && barCheck(r).miss.length) continue;
      if (F.smart === 'easy' && (r.ings.filter(x => !x.opt).length > 4 || r.ings.some(x => x.prep) || r.batch)) continue;
      if (F.smart === 'zero' && m.strength !== 'zero') continue;
      if (F.smart === 'hot' && !m.tags.includes('hot')) continue;
      if (F.smart === 'fresh' && !(['highball', 'fizz', 'spritz', 'mule'].includes(r.family) && m.a.abv < 15)) continue;
      if (F.smart === 'aperitif' && !(m.a.abv < 18 && m.strength !== 'zero' && (m.tags.includes('bitter') || ['spritz', 'negroni'].includes(r.family) || ['vermouth'].includes((ING[r.ings[0].i] || {}).cat)))) continue;
      if (F.smart === 'dessert' && !(m.strength !== 'zero' && ['creamy', 'coffee', 'nutty'].some(t => m.tags.includes(t)) && !m.tags.includes('fresh'))) continue;
      let score = 0;
      if (terms.length) {
        let ok = true;
        for (const t of terms) {
          const name = (r.zh + ' ' + (r.en || '')).toLowerCase();
          if (name.startsWith(t)) score += 10; else if (name.includes(t)) score += 6;
          else if (m.text.includes(t) || r.ings.some(x => (ING[x.i].aliases || []).concat(ING[x.i].brands || [], [ING[x.i].en]).join(' ').toLowerCase().includes(t))) score += 2;
          else { ok = false; break; }
        }
        if (!ok) continue;
      }
      out.push([r, score]);
    }
    const s = F.sort;
    const hist = store.hist;
    out.sort((A, B) => {
      const a = A[0], b = B[0];
      if (s === 'name') return a.zh.localeCompare(b.zh, 'zh');
      if (s === 'abvUp') return M(a).a.abv - M(b).a.abv;
      if (s === 'abvDown') return M(b).a.abv - M(a).a.abv;
      if (s === 'few') return a.ings.length - b.ings.length;
      if (s === 'recent') return (hist.indexOf(a.id) + 1 || 1e4) - (hist.indexOf(b.id) + 1 || 1e4);
      return B[1] - A[1];
    });
    return out.map(x => x[0]);
  }
  function activeChips() {
    const c = [];
    F.base.forEach(v => c.push(['base', v, BASE_L[v]]));
    F.src.forEach(v => c.push(['src', v, SRC_L[v]]));
    F.method.forEach(v => c.push(['method', v, methodL(v)]));
    F.fin.forEach(v => c.push(['fin', v, '要' + FLAVOR_L[v]]));
    F.fout.forEach(v => c.push(['fout', v, '不要' + FLAVOR_L[v]]));
    F.glass.forEach(v => c.push(['glass', v, glassL(v)]));
    F.fam.forEach(v => c.push(['fam', v, FAM[v].zh]));
    F.str.forEach(v => c.push(['str', v, STR_L[v]]));
    F.ingIn.forEach(v => c.push(['ingIn', v, '含 ' + ingName(v)]));
    F.ingOut.forEach(v => c.push(['ingOut', v, '不含 ' + ingName(v)]));
    if (F.abvMin > 0 || F.abvMax < 45) c.push(['abv', '', `${F.abvMin}%~${F.abvMax >= 45 ? '45%+' : F.abvMax + '%'}`]);
    if (F.can) c.push(['can', '', '吧台能调']);
    if (F.noPrep) c.push(['noPrep', '', '无需自制']);
    if (F.fav) c.push(['fav', '', '我的收藏']);
    if (F.smart) c.push(['smart', '', { easy: '新手入门', zero: '无酒精', hot: '热饮', fresh: '清爽气泡', aperitif: '餐前开胃', dessert: '餐后甜点' }[F.smart]]);
    return c;
  }
  const PAGE = 40;
  let shown = PAGE;
  route(/^\/search$/, (_, q) => {
    applyQuery(q); shown = PAGE;
    if (q.focus || Object.keys(q).length) after(() => history.replaceState(null, '', '#/search'));
    if (q.focus) after(() => $('#q').focus());
    after(bindSearch);
    return `<div class="filter-bar">
      <div class="row"><label class="search grow">${ic('find')}<input id="q" type="search" placeholder="酒名 / 材料 / 品牌，空格分隔多个" value="${esc(F.q)}" enterkeyhint="search" autocomplete="off"></label>
      <button class="icon-btn" data-act="filters">${ic('filter')}</button></div>
      <div class="chips scroll" id="active"></div></div>
      <div class="result-head"><span id="count"></span>
      <select id="sort">${[['def', '默认排序'], ['name', '按名称'], ['abvUp', '酒精度 低→高'], ['abvDown', '酒精度 高→低'], ['few', '材料少优先'], ['recent', '最近看过']].map(([k, v]) => `<option value="${k}" ${F.sort === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="list" id="results"></div><div id="more"></div>`;
  }, 'find');
  function bindSearch() {
    const q = $('#q');
    let t;
    q.oninput = () => { clearTimeout(t); t = setTimeout(() => { F.q = q.value; shown = PAGE; drawResults(); }, 120); };
    q.onkeydown = e => { if (e.key === 'Enter') q.blur(); };
    $('#sort').onchange = e => { F.sort = e.target.value; drawResults(); };
    drawResults();
  }
  function drawResults() {
    const res = runFilter();
    const ac = activeChips();
    $('#active').innerHTML = ac.length ? ac.map(([k, v, l]) => `<button class="chip sm on" data-act="unf" data-k="${k}" data-v="${esc(v)}">${esc(l)}<span class="x">×</span></button>`).join('') + `<button class="chip sm" data-act="unf" data-k="all">清除全部</button>` : '';
    $('#active').classList.toggle('hide', !ac.length);
    $('#count').textContent = `共 ${res.length} 款`;
    $('#results').innerHTML = res.length ? res.slice(0, shown).map(r => {
      let extra = '';
      if (BAR.size && (F.can || ac.length === 0)) { const c = barCheck(r); if (c.miss.length && c.miss.length <= 2) extra = `<div class="miss">缺：${c.miss.map(ingName).join('、')}</div>`; }
      return card(r, extra);
    }).join('') : emptyHint();
    $('#more').innerHTML = res.length > shown ? `<button class="btn block" data-act="more" style="margin-top:12px">再显示 ${Math.min(PAGE, res.length - shown)} 款（剩 ${res.length - shown}）</button>` : '';
  }
  function emptyHint() {
    let tip = '';
    if (F.abvMin > 0 || F.abvMax < 45) { const keep = [F.abvMin, F.abvMax]; F.abvMin = 0; F.abvMax = 45; const n = runFilter().length; [F.abvMin, F.abvMax] = keep; if (n) tip = `放宽酒精度范围后有 ${n} 款`; }
    if (!tip && F.fin.size > 1) tip = '试试减少口味条件';
    if (!tip && F.can) tip = '去吧台再添几种材料，或关闭“吧台能调”';
    return `<div class="empty">${ic('find')}<p>没有找到符合条件的鸡尾酒</p><p class="faint">${tip}</p></div>`;
  }
  function filterSheet() {
    const chipSet = (key, items) => items.map(([v, l]) => `<button class="chip ${F[key].has(v) ? 'on' : ''}" data-fk="${key}" data-fv="${v}">${esc(l)}</button>`).join('');
    const flavorChips = Object.entries(FLAVOR_L).map(([k, v]) => `<button class="chip ${F.fin.has(k) ? 'on' : F.fout.has(k) ? 'no' : ''}" data-flv="${k}">${v}</button>`).join('');
    const usedGlass = uniq(ALL.map(r => r.glass).filter(Boolean));
    const s = sheet(`<h3>筛选</h3>
      <div class="fgroup"><h4>基酒 <small><label><input type="checkbox" id="baseAll" ${F.baseAll ? 'checked' : ''}> 必须全部包含</label></small></h4><div class="chips">${chipSet('base', D.bases)}</div></div>
      <div class="fgroup"><h4>调制方法</h4><div class="chips">${chipSet('method', Object.keys(METHOD_ZH).map(m => [m, methodL(m)]))}</div></div>
      <div class="fgroup"><h4>酒精度 <small id="abvOut"></small></h4>
        <div class="chips" style="margin-bottom:8px">${chipSet('str', Object.entries(STR_L))}</div>
        <div class="range"><span class="faint">最低</span><input type="range" id="abvMin" min="0" max="45" step="1" value="${F.abvMin}"><span class="faint">最高</span><input type="range" id="abvMax" min="0" max="45" step="1" value="${F.abvMax}"></div></div>
      <div class="fgroup"><h4>口味 <small>点一次“要”，再点一次“不要”</small></h4><div class="chips">${flavorChips}</div></div>
      <div class="fgroup"><h4>材料 / 水果 <small>包含或排除</small></h4>
        <label class="search">${ic('find')}<input id="ingQ" placeholder="输入材料，如 青柠、金巴利、薄荷"></label>
        <div class="chips" id="ingSug" style="margin-top:8px"></div>
        <div class="chips" id="ingSel" style="margin-top:8px"></div></div>
      <div class="fgroup"><h4>载杯</h4><div class="chips">${chipSet('glass', usedGlass.map(g => [g, glassL(g)]))}</div></div>
      <div class="fgroup"><h4>酒系 / 配方骨架</h4><div class="chips">${chipSet('fam', D.families.map(f => [f.id, f.zh]))}</div></div>
      <div class="fgroup"><h4>来源</h4><div class="chips">${chipSet('src', Object.entries(SRC_L).filter(([k]) => ALL.some(r => r.src === k)))}</div></div>
      <div class="fgroup"><h4>其他</h4><div class="chips">
        <button class="chip ${F.can ? 'on' : ''}" data-tog="can">只看吧台能调</button>
        <button class="chip ${F.noPrep ? 'on' : ''}" data-tog="noPrep">无需自制备料</button>
        <button class="chip ${F.fav ? 'on' : ''}" data-tog="fav">只看收藏</button></div></div>
      <div class="sheet-foot"><button class="btn" data-act="freset">重置</button><button class="btn primary grow" data-act="fdone" id="fdone">查看结果</button></div>`);
    const upd = () => { $('#fdone', s).textContent = `查看 ${runFilter().length} 款`; $('#abvOut', s).textContent = `${F.abvMin}% ~ ${F.abvMax >= 45 ? '45%+' : F.abvMax + '%'}`; };
    s.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.fk) { const set = F[b.dataset.fk], v = b.dataset.fv; set.has(v) ? set.delete(v) : set.add(v); b.classList.toggle('on'); }
      if (b.dataset.flv) { const k = b.dataset.flv; if (F.fin.has(k)) { F.fin.delete(k); F.fout.add(k); b.className = 'chip no'; } else if (F.fout.has(k)) { F.fout.delete(k); b.className = 'chip'; } else { F.fin.add(k); b.className = 'chip on'; } }
      if (b.dataset.tog) { F[b.dataset.tog] = !F[b.dataset.tog]; b.classList.toggle('on'); }
      if (b.dataset.ing) { const [mode, id] = b.dataset.ing.split(':'); const L = mode === 'in' ? F.ingIn : F.ingOut; if (!L.includes(id)) L.push(id); $('#ingQ', s).value = ''; $('#ingSug', s).innerHTML = ''; drawSel(); }
      if (b.dataset.rmIng) { const [mode, id] = b.dataset.rmIng.split(':'); const L = mode === 'in' ? F.ingIn : F.ingOut; L.splice(L.indexOf(id), 1); drawSel(); }
      upd();
    });
    const drawSel = () => { $('#ingSel', s).innerHTML = F.ingIn.map(i => `<button class="chip on" data-rm-ing="in:${i}">含 ${ingName(i)} ×</button>`).join('') + F.ingOut.map(i => `<button class="chip no" data-rm-ing="out:${i}">不含 ${ingName(i)} ×</button>`).join(''); };
    drawSel();
    $('#baseAll', s).onchange = e => { F.baseAll = e.target.checked; upd(); };
    $('#ingQ', s).oninput = e => {
      const t = e.target.value.trim().toLowerCase();
      $('#ingSug', s).innerHTML = t ? searchIngs(t).slice(0, 8).map(id => `<span class="row" style="gap:4px"><button class="chip sm" data-ing="in:${id}">+ ${ingName(id)}</button><button class="chip sm" data-ing="out:${id}" title="排除">−</button></span>`).join('') : '';
    };
    const mn = $('#abvMin', s), mx = $('#abvMax', s);
    mn.oninput = () => { F.abvMin = Math.min(+mn.value, F.abvMax); mn.value = F.abvMin; upd(); };
    mx.oninput = () => { F.abvMax = Math.max(+mx.value, F.abvMin); mx.value = F.abvMax; upd(); };
    upd();
  }
  function searchIngs(t) {
    const used = new Set(ALL.flatMap(r => r.ings.map(x => x.i)).flatMap(i => [i, ...anc(i)]));
    return D.ingredients.filter(x => x.id !== 'other' && used.has(x.id) && [x.zh, x.en, ...(x.aliases || []), ...(x.brands || [])].join(' ').toLowerCase().includes(t)).map(x => x.id);
  }

  // ================================================================= 详情
  let serv = 1;
  route(/^\/r\/(.+)$/, ([id]) => {
    const r = BY[id];
    if (!r) return topbar('找不到这款酒') + '<div class="empty">它可能已被删除。</div>';
    if (store.hist[0] !== id) { store.hist = [id, ...store.hist.filter(x => x !== id)].slice(0, 60); save(); }
    if (serv < 1) serv = 1;
    const m = M(r), fav = store.favs.includes(id);
    const fam = FAM[r.family];
    const bc = BAR.size ? true : false;
    const steps = genSteps(r);
    const made = store.made[id] || 0;
    const rate = store.rate[id] || 0;
    const ingRows = r.ings.map((x, k) => {
      const st = bc ? ingStatus(x) : 'none';
      const g = ING[x.i] || ING.other;
      const showRaw = store.set.brands && x.raw && x.raw.replace(/\s/g, '') !== g.zh;
      const sw = swaps(x.i, x.alts).length;
      return `<li><span class="st ${st === 'skip' ? 'none' : st}" title="${{ ok: '吧台有', sub: '可用替代', miss: '缺少', skip: '可选', none: '' }[st]}"></span>
        <span class="amt">${amtText(x, serv)}</span>
        <button class="nm" data-act="ing" data-id="${x.i}" style="text-align:left"><b>${esc(g.zh)}</b>${x.opt ? ' <span class="tag">可选</span>' : ''}${x.prep ? ' <span class="tag gold">自制</span>' : ''}${x.note ? ` <span class="tag">${esc(x.note)}</span>` : ''}
        ${showRaw ? `<span class="raw">原配方：${esc(x.raw)}</span>` : ''}</button>
        ${sw ? `<button class="swap" data-act="swaps" data-k="${k}">替换</button>` : ''}</li>`;
    }).join('');
    const versions = (r.versions || []).map(v => BY[v]).filter(Boolean);
    const kids = ALL.filter(x => x.parent === id);
    const parent = r.parent && BY[r.parent];
    const related = (r.related || []).map(v => BY[v]).filter(Boolean);
    const sim = similar(r);
    return `<div class="detail-hero" style="background:${grad(m.color)}">
        <div class="bar"><button data-act="back">${ic('back')}</button>
        <div class="row"><button data-act="share">${ic('share')}</button><button data-act="fav" data-id="${esc(id)}" style="color:${fav ? '#ff8b7a' : '#fff'}">${ic(fav ? 'heartf' : 'heart')}</button></div></div>
        ${glassSvg(r.glass, 'rgba(255,255,255,.32)')}
        <div class="ttl"><span class="src">${esc(SRC_L[r.src] || '')}</span>
        <h1 class="serif">${esc(r.zh)}</h1><div class="en">${esc(r.en || '')}</div></div></div>
      <div class="stats">
        <div class="stat"><b>${m.a.abv < 0.5 ? '0' : fmt(m.a.abv)}%</b><span>${m.a.abvSrc}酒精度</span></div>
        <div class="stat"><b>${(r.methods || []).map(x => METHOD_EN[x]).join('+') || '—'}</b><span>调制方法</span></div>
        <div class="stat"><b>${(glassL(r.glass) || '—').split('/')[0]}</b><span>载杯</span></div>
        <div class="stat"><b>${fam ? fam.zh.split(' ')[0] : '—'}</b><span>酒系</span></div></div>
      <div class="actions"><button class="btn primary" data-act="stepmode">${ic('play')}开始调制</button><button class="btn" data-act="lab" data-id="${esc(id)}">${ic('flask')}调整配方</button><button class="btn" data-act="made" data-id="${esc(id)}">${ic('check')}调过${made ? ' ' + made : ''}</button></div>
      <div class="chips" style="margin-bottom:12px">${m.bases.map(b => `<a class="chip sm" href="#/search?base=${b}">${BASE_L[b]}</a>`).join('')}${m.tags.map(t => `<a class="chip sm" href="#/search?flavor=${t}">${FLAVOR_L[t] || t}</a>`).join('')}</div>
      ${r.batch ? `<div class="card small">这是<b>批量预调</b>配方（表中为整批用量）${r.serve ? `，出品时每杯取 <b>${r.serve}ml</b>` : ''}。下方可按比例缩放。</div>` : ''}
      <div class="card"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3 style="margin:0">材料</h3>
        <div class="serv"><div class="stepper"><button data-act="serv" data-d="-1">−</button><span>${serv}${r.batch ? '×' : '杯'}</span><button data-act="serv" data-d="1">+</button></div>
        <div class="seg"><button class="${store.set.unit === 'ml' ? 'on' : ''}" data-act="unit" data-u="ml">ml</button><button class="${store.set.unit === 'oz' ? 'on' : ''}" data-act="unit" data-u="oz">oz</button></div></div></div>
        <ul class="ing-list">${ingRows}</ul>
        ${bc ? `<p class="faint" style="margin:8px 0 0">● 绿=吧台有 ● 黄=可用同类替代 ● 红=缺少</p>` : ''}
        <p class="faint" style="margin:6px 0 0">基酒不限品牌：点材料名查看可用品牌，点“替换”看同类替代。</p></div>
      <div class="card"><h3>做法</h3><dl class="kv">
        <dt>调制</dt><dd>${(r.methods || []).map(methodL).join(' → ')}${r.methodGuess ? ' <span class="faint">(按酒系推断)</span>' : ''}</dd>
        <dt>载杯</dt><dd>${esc(r.glassRaw || glassL(r.glass) || '—')}</dd>
        ${r.ice || r.iceRaw ? `<dt>冰</dt><dd>${esc(ICE_L[r.ice] || r.iceRaw || '')}</dd>` : ''}
        <dt>装饰</dt><dd>${esc(r.garnish || '—')}</dd>
        ${r.methodRaw && r.methodRaw.length > 8 ? `<dt>做法备注</dt><dd style="white-space:pre-line">${esc(r.methodRaw)}</dd>` : ''}
        ${(r.notes || []).length ? `<dt>备注</dt><dd>${esc(r.notes.join('；'))}</dd>` : ''}</dl>
        <ol class="steps" style="margin-top:12px">${steps.list.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        ${steps.auto ? '<p class="faint" style="margin:4px 0 0">步骤根据调制方法自动生成，仅供参考。</p>' : ''}</div>
      ${(r.preps || []).length ? `<div class="card"><h3>自制材料</h3>${r.preps.map(p => `<div class="prep"><b>${esc(p.name)}</b><p>${esc(p.how)}</p></div>`).join('')}</div>` : ''}
      <div class="card"><h3>风味</h3>${profileHtml(m.a)}</div>
      ${r.story ? `<div class="card"><h3>故事</h3><p class="story" style="margin:0">${esc(r.story)}</p></div>` : ''}
      ${(r.variants || []).length || versions.length || kids.length || parent || related.length ? `<div class="card"><h3>变化与改编</h3>
        ${versions.map(v => `<a class="var-item" href="#/r/${v.id}"><b>另一版本 ›</b><p>${esc(v.ings.map(x => ingName(x.i) + ' ' + amtText(x)).join('、'))}</p></a>`).join('')}
        ${parent ? `<a class="var-item" href="#/r/${parent.id}"><b>原版：${esc(parent.zh)} ›</b></a>` : ''}
        ${kids.map(v => `<a class="var-item" href="#/r/${v.id}"><b>衍生：${esc(v.zh)} ›</b></a>`).join('')}
        ${(r.variants || []).map(v => v.ref && BY[v.ref] ? `<a class="var-item" href="#/r/${v.ref}"><b>${esc(v.t)} ›</b><p>${esc(v.d)}</p></a>` : `<div class="var-item"><b>${esc(v.t)}</b><p>${esc(v.d)}</p></div>`).join('')}
        ${related.map(v => `<a class="var-item" href="#/r/${v.id}"><b>源自：${esc(v.zh)} ›</b></a>`).join('')}
        ${fam && fam.slots.length ? `<a class="var-item" href="#/wiki/families#${fam.id}"><b>${esc(fam.zh)}骨架 ›</b><p>${esc(fam.core)}：${esc(fam.ratio)}。换掉任意一个位置的材料，就是一款新酒。</p></a>` : ''}</div>` : ''}
      <div class="card"><h3>我的笔记</h3>
        <div class="stars row" style="margin-bottom:8px">${[1, 2, 3, 4, 5].map(n => `<button class="${n <= rate ? 'on' : ''}" data-act="rate" data-id="${esc(id)}" data-n="${n}">★</button>`).join('')}</div>
        <textarea class="note" id="note" placeholder="例如：下次糖浆减 5ml；客人喜欢多一点柠檬">${esc(store.notes[id] || '')}</textarea>
        <div class="row" style="margin-top:10px"><button class="btn sm" data-act="party-add" data-id="${esc(id)}">${ic('party')}加入派对清单</button>
        ${r.src === 'mine' ? `<button class="btn sm" data-act="lab" data-id="${esc(id)}" data-edit="1">${ic('edit')}编辑</button><button class="btn sm" data-act="del-mine" data-id="${esc(id)}">${ic('trash')}删除</button>` : ''}</div></div>
      ${sim.length ? `<div class="sec-title"><h2>相似的酒</h2></div><div class="list">${sim.map(x => card(x)).join('')}</div>` : ''}`;
  }, 'find');
  function profileHtml(a) {
    const row = (l, v, max, cls) => `<span>${l}</span><div class="meter ${cls}"><i style="width:${Math.min(100, v / max * 100)}%"></i></div><span class="faint">${Math.round(Math.min(100, v / max * 100))}</span>`;
    return `<div class="prof">${row('甜', a.sweet, 32, '')}${row('酸', a.sour, 32, 'sour')}${row('苦', a.bitter, 22, 'bitter')}${row('烈', a.abv, 40, 'strong')}</div>
      <p class="faint" style="margin:8px 0 0">按材料估算：单杯约 ${Math.round(a.vol * (1 + a.dil))}ml（含化水），纯酒精约 ${fmt(a.alc * 0.789)}g。</p>`;
  }
  function similar(r) {
    const m = M(r), skip = new Set([r.id, ...(r.versions || [])]);
    return ALL.filter(x => !skip.has(x.id)).map(x => {
      const n = M(x); let s = 0;
      m.ids.forEach(i => { if (n.ids.has(i)) s += ['spirit', 'liqueur', 'amaro', 'vermouth'].includes(ING[i].cat) ? 3 : 1; });
      if (x.family === r.family) s += 3;
      if (n.bases.some(b => m.bases.includes(b))) s += 2;
      return [x, s];
    }).filter(x => x[1] >= 6).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
  }
  function genSteps(r) {
    if (r.steps && r.steps.length) return { list: r.steps, auto: false };
    const ms = r.methods || [], L = [];
    const g = glassL(r.glass) || '杯', ice = ICE_L[r.ice];
    const isMixer = x => ['mixer'].includes(ING[x.i].cat) || (x.i === 'sparkling_wine' && ms.length > 1) || x.unit === 'top';
    const mixers = r.ings.filter(isMixer).filter(x => x.i !== 'water' || ms.includes('build'));
    const muddled = r.ings.filter(x => ['fruit', 'herb'].includes(ING[x.i].cat) || (SUGARS.has(x.i) && ms.includes('muddle')));
    const main = r.ings.filter(x => !mixers.includes(x) && !(ms.includes('muddle') && muddled.includes(x)) && !['salt'].includes(x.i));
    const names = a => a.map(x => ingName(x.i)).join('、');
    if (r.batch) L.push(`提前按表中比例整批制作${r.ings.some(x => ['milk', 'yogurt'].includes(x.i)) ? '（奶洗：静置后滤布/咖啡滤纸过滤至清澈）' : ''}，冷藏保存`);
    if ((r.preps || []).length) L.push(`提前准备自制材料：${r.preps.map(p => p.name.split(/[：:（(]/)[0]).join('、')}`);
    if (/盐边|糖边|辣盐/.test(r.garnish || '')) L.push(`杯口抹柠檬/青柠后蘸上${(r.garnish.match(/(辣?盐|糖)边/) || ['盐边'])[0]}（可只做半圈）`);
    if (r.ice === 'none' || (!ice && ['cocktail', 'coupe', 'nicknora', 'flute'].includes(r.glass))) L.push(`冰镇${g}`);
    if (ms.includes('heat')) {
      L.push(`将${names(main)}加热至约 65℃（勿沸腾）`); L.push(`倒入预热过的${g}`);
    } else if (ms.includes('blend')) {
      L.push(`把${names(main)}与一杯碎冰放入搅拌机`); L.push('高速搅打至顺滑'); L.push(`倒入${g}`);
    } else if (ms.includes('shake') || ms.includes('dry_shake')) {
      if (ms.includes('muddle') && muddled.length) L.push(`在摇壶中轻压${names(muddled)}，压出汁液与香气`);
      L.push(`将${names(main)}倒入摇酒壶`);
      if (r.ings.some(x => ['egg_white', 'egg', 'egg_yolk'].includes(x.i)) || ms.includes('dry_shake')) L.push('先不加冰干摇约 10 秒，打发蛋清');
      L.push('加满冰块，用力摇和 10~15 秒至壶身结霜');
      L.push(`${ice ? `${g}中加入${ice}，` : ''}双重过滤倒入${g}`);
    } else if (ms.includes('stir')) {
      if (ms.includes('muddle') && muddled.length) L.push(`杯中放入${names(muddled)}轻压出香`);
      L.push(`调酒杯加满冰，倒入${names(main)}`); L.push('搅拌约 20~30 秒至充分冰凉');
      L.push(`滤入${g}${ice ? `（杯中加${ice}）` : ''}`);
    } else if (ms.includes('throw') || ms.includes('roll')) {
      L.push(`将${names(main)}倒入加冰的听`);
      L.push(ms.includes('throw') ? '在两个听之间拉开距离来回抛酒 5~6 次' : `在两个听之间来回滚动 6~8 次`);
      L.push(`滤入${g}${ice ? `（加${ice}）` : ''}`);
    } else if (ms.includes('swizzle')) {
      L.push(`${g}中放入${names(r.ings.filter(x => !mixers.includes(x)))}`); L.push('加满碎冰，用 swizzle 棒旋搅至杯壁结霜'); L.push('补满碎冰');
    } else {
      if (ms.includes('muddle') && muddled.length) L.push(`${g}中放入${names(muddled)}，轻轻捣压`);
      L.push(`${g}中加入${ice || '冰块'}`);
      if (main.length) L.push(`依次倒入${names(main)}`);
    }
    if (mixers.length) L.push(`注入${names(mixers)}，吧勺轻轻提拉一次保留气泡`);
    if (ms.includes('float')) { const fl = [...r.ings].reverse().find(x => ['liqueur', 'wine', 'amaro'].includes(ING[x.i].cat)); if (fl) L.push(`沿吧勺背缓慢倒入${ingName(fl.i)}，使其漂浮在表层`); }
    if (r.garnish) L.push(`装饰：${r.garnish}`);
    return { list: L, auto: true };
  }

  // ---------------------------------------------------------------- 分步模式
  let wake = null, timerI = null;
  function stopTimers() { clearInterval(timerI); timerI = null; }
  function stepMode(r) {
    const steps = genSteps(r).list;
    const ingStep = '准备材料：' + r.ings.map(x => `${ingName(x.i)} ${amtText(x, serv)}`).join('；');
    const all = [ingStep, ...steps];
    let i = 0;
    const el = document.createElement('div'); el.className = 'stepmode';
    document.body.appendChild(el);
    try { navigator.wakeLock && navigator.wakeLock.request('screen').then(w => wake = w).catch(() => { }); } catch (e) { }
    const close = () => { el.remove(); stopTimers(); try { wake && wake.release(); } catch (e) { } wake = null; };
    const draw = () => {
      const s = all[i];
      const t = /摇和|干摇/.test(s) ? 12 : /搅拌约/.test(s) ? 25 : /静置/.test(s) ? 0 : 0;
      el.innerHTML = `<div class="top"><button class="back" data-x="close">${ic('close')}</button><b>${esc(r.zh)}</b><span class="faint">${i + 1}/${all.length}</span></div>
        <div class="progress"><i style="width:${(i + 1) / all.length * 100}%"></i></div>
        <div class="body"><div class="n">STEP ${i + 1}</div><h2>${esc(s)}</h2>
        ${t ? `<div class="timer" id="tm">${t}</div><div><button class="btn" data-x="timer" data-t="${t}">${ic('clock')}开始计时 ${t} 秒</button></div>` : ''}</div>
        <div class="ctrl"><button class="btn" data-x="prev" ${i ? '' : 'disabled'}>上一步</button><button class="btn primary" data-x="next">${i === all.length - 1 ? '完成 🍸' : '下一步'}</button></div>`;
    };
    el.onclick = e => {
      const b = e.target.closest('[data-x]'); if (!b) return;
      const x = b.dataset.x;
      if (x === 'close') close();
      if (x === 'prev' && i > 0) { i--; stopTimers(); draw(); }
      if (x === 'next') { if (i < all.length - 1) { i++; stopTimers(); draw(); } else { close(); store.made[r.id] = (store.made[r.id] || 0) + 1; save(); toast('已记录“调过一次” 🍸'); render(); } }
      if (x === 'timer') {
        let t = +b.dataset.t; stopTimers(); const tm = $('#tm', el);
        timerI = setInterval(() => { t--; tm.textContent = Math.max(t, 0); if (t <= 0) { stopTimers(); tm.textContent = '好了！'; try { navigator.vibrate && navigator.vibrate([200, 80, 200]); } catch (e) { } } }, 1000);
      }
    };
    let sx = 0;
    el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) { if (dx < 0 && i < all.length - 1) i++; else if (dx > 0 && i > 0) i--; stopTimers(); draw(); } });
    draw();
  }

  // ---------------------------------------------------------------- 材料信息弹层
  function ingSheet(id) {
    const g = ING[id]; if (!g) return;
    const uses = ALL.filter(r => matchIng(M(r), id));
    const sw = swaps(id);
    const chain = [...anc(id).reverse(), id].map(ingName).join(' › ');
    const inBar = BAR.has(id);
    sheet(`<h3>${esc(g.zh)} <span class="faint">${esc(g.en)}</span></h3>
      <div class="chips" style="margin-bottom:12px"><span class="tag">${CAT_L[g.cat]}</span>${g.abv ? `<span class="tag">约 ${g.abv}%</span>` : ''}${g.strict ? '<span class="tag red">风味独特，不建议随意替换</span>' : ''}</div>
      <p class="faint" style="margin:0 0 10px">${esc(chain)}</p>
      ${(g.brands || []).length ? `<div class="fgroup"><h4>常见品牌（任选其一）</h4><div class="chips">${g.brands.map(b => `<span class="chip sm">${esc(b)}</span>`).join('')}</div></div>` : ''}
      ${desc(id).length ? `<div class="fgroup"><h4>细分种类</h4><div class="chips">${desc(id).map(k => `<button class="chip sm" data-act="ing" data-id="${k}">${ingName(k)}</button>`).join('')}</div></div>` : ''}
      ${sw.length ? `<div class="fgroup"><h4>可替代</h4><div class="chips">${sw.map(k => `<button class="chip sm" data-act="ing" data-id="${k}">${ingName(k)}</button>`).join('')}</div></div>` : ''}
      ${(g.aliases || []).length ? `<p class="faint">也叫：${esc(g.aliases.join('、'))}</p>` : ''}
      <div class="sheet-foot"><button class="btn" data-act="bar-tog" data-id="${id}">${inBar ? '从吧台移除' : '加入我的吧台'}</button><a class="btn primary grow" href="#/search?ing=${id}" data-act="close">用到它的 ${uses.length} 款酒</a></div>`);
  }
  function swapSheet(r, k) {
    const x = r.ings[k];
    const list = swaps(x.i, x.alts);
    sheet(`<h3>替换 ${ingName(x.i)}</h3><p class="faint" style="margin-top:-6px">同类材料可以直接替换，风味会有所变化。想保存修改，可以用“调整配方”。</p>
      ${list.map(id => { const g = ING[id]; const n = ALL.filter(q => matchIng(M(q), id)).length; return `<button class="ing-item" data-act="ing" data-id="${id}"><span><b>${g.zh}</b> <span class="faint">${g.en}</span><br><span class="faint">${(g.brands || []).slice(0, 3).join(' / ')}</span></span><span class="row">${BAR.has(id) ? '<span class="tag pine">吧台有</span>' : ''}<span class="faint">${n} 款</span></span></button>`; }).join('')}
      <div class="sheet-foot"><button class="btn primary block" data-act="lab" data-id="${esc(r.id)}">在配方实验室中替换</button></div>`);
  }

  // ================================================================= 吧台
  const PRESETS = {
    '入门家庭吧': ['london_dry_gin', 'vodka', 'white_rum', 'bourbon', 'blanco_tequila', 'triple_sec', 'sweet_vermouth', 'dry_vermouth', 'campari', 'angostura', 'simple_syrup', 'lemon_juice', 'lime_juice', 'soda', 'tonic', 'ginger_beer', 'mint', 'orange_juice'],
    '专业吧台': ['london_dry_gin', 'old_tom_gin', 'sloe_gin', 'vodka', 'white_rum', 'aged_rum', 'dark_rum', 'gold_rum', 'blanco_tequila', 'mezcal', 'bourbon', 'rye', 'scotch', 'peated_scotch', 'cognac', 'pisco', 'triple_sec', 'curacao', 'maraschino', 'apricot_liqueur', 'amaretto', 'coffee_liqueur', 'white_cacao', 'chartreuse_green', 'chartreuse_yellow', 'benedictine', 'drambuie', 'elderflower', 'violette', 'campari', 'aperol', 'fernet', 'montenegro', 'sweet_vermouth', 'dry_vermouth', 'lillet_blanc', 'fino_sherry', 'absinthe', 'angostura', 'orange_bitters', 'peychauds', 'simple_syrup', 'honey_syrup', 'agave_syrup', 'grenadine', 'orgeat', 'lemon_juice', 'lime_juice', 'orange_juice', 'grapefruit_juice', 'pineapple_juice', 'cranberry_juice', 'egg_white', 'cream', 'milk', 'soda', 'tonic', 'ginger_beer', 'cola', 'mint', 'sparkling_wine', 'espresso'],
  };
  let barView = 'can';
  route(/^\/bar$/, (_, q) => {
    if (q.v) barView = q.v;
    const bs = barSummary();
    const list = barView === 'one' ? bs.one : barView === 'two' ? bs.two : bs.can;
    const used = new Set(ALL.flatMap(r => r.ings.map(x => x.i)).flatMap(i => [i, ...anc(i)]));
    const byCat = D.cats.map(([c, l]) => [c, l, D.ingredients.filter(x => x.cat === c && used.has(x.id) && !['other', 'citrus', 'liqueur_other'].includes(x.id))]).filter(x => x[2].length);
    after(() => { const s = $('#barQ'); s && (s.oninput = () => { const t = s.value.trim().toLowerCase(); $$('[data-bar-item]').forEach(b => { b.classList.toggle('hide', t && !b.dataset.barItem.includes(t)); }); $$('.cat-block').forEach(d => { if (t) d.open = true; }); }); });
    return topbar('我的吧台', false, `<span class="faint">${BAR.size} 种</span>`) +
      (BAR.size ? `<div class="bar-sum">
        <a href="#/bar?v=can" class="${barView === 'can' ? 'on' : ''}"><b>${bs.can.length}</b><span>现在就能调</span></a>
        <a href="#/bar?v=one" class="${barView === 'one' ? 'on' : ''}"><b>${bs.one.length}</b><span>只差 1 样</span></a>
        <a href="#/bar?v=two" class="${barView === 'two' ? 'on' : ''}"><b>${bs.two.length}</b><span>只差 2 样</span></a></div>
        ${bs.buy.length ? `<div class="card"><h3>${ic('cart')} 采购建议</h3><p class="faint" style="margin:-4px 0 6px">再买一样，能多解锁的酒款数</p>${bs.buy.slice(0, 5).map(([id, n]) => `<div class="buy"><span class="n">+${n}</span><button class="grow" style="text-align:left" data-act="ing" data-id="${id}"><b>${ingName(id)}</b><br><span class="faint">${(ING[id].brands || []).slice(0, 2).join(' / ') || CAT_L[ING[id].cat]}</span></button><button class="btn sm" data-act="bar-tog" data-id="${id}">已买</button></div>`).join('')}</div>` : ''}
        <div class="list">${list.slice(0, 60).map(r => { const c = barCheck(r); return card(r, c.miss.length ? `<div class="miss">缺：${c.miss.map(ingName).join('、')}</div>` : c.sub.length ? `<div class="miss" style="color:var(--pine)">用同类替代：${c.sub.map(ingName).join('、')}</div>` : ''); }).join('') || '<div class="empty">这一栏暂时没有酒款</div>'}</div>` :
        `<div class="card"><h3>先告诉 Pine 你有什么</h3><p class="muted" style="margin:0 0 10px">勾选你拥有的酒和材料。选“金酒”这样的大类，所有用金酒的配方都算你能调；品牌只是参考，不影响匹配。</p>
        <div class="row wrap">${Object.keys(PRESETS).map(k => `<button class="btn sm" data-act="preset" data-k="${k}">一键导入：${k}</button>`).join('')}</div></div>`) +
      `<div class="sec-title"><h2>库存</h2><span class="row"><button data-act="bar-clear">清空</button></span></div>
      <label class="search">${ic('find')}<input id="barQ" placeholder="搜索材料或品牌"></label>
      <div class="card" style="margin-top:10px;padding:2px 14px">${byCat.map(([c, l, items]) => {
        const n = items.filter(x => BAR.has(x.id)).length;
        return `<details class="cat-block" ${['spirit', 'liqueur'].includes(c) ? 'open' : ''}><summary>${l}<span>${n ? n + ' 种 ·' : ''} ${items.length} ›</span></summary><div class="chips">${items.map(x =>
          `<button class="chip ${BAR.has(x.id) ? 'on' : ''} ${x.parent && ING[x.parent].cat === c ? 'child' : ''}" data-act="bar-chip" data-id="${x.id}" data-bar-item="${esc([x.zh, x.en, ...(x.aliases || []), ...(x.brands || [])].join(' ').toLowerCase())}">${x.zh}</button>`).join('')}</div></details>`;
      }).join('')}</div>
      <div class="card"><h3>匹配方式</h3>
        <label class="row" style="justify-content:space-between;padding:6px 0"><span>允许同类替代<br><span class="faint">如没有波本时用黑麦，青柠汁与柠檬汁互替</span></span><input type="checkbox" data-set="flex" ${store.set.flex ? 'checked' : ''}></label>
        <label class="row" style="justify-content:space-between;padding:6px 0"><span>常备材料视为已有<br><span class="faint">水、糖、单糖浆、盐、苏打水、黑胡椒</span></span><input type="checkbox" data-set="staples" ${store.set.staples ? 'checked' : ''}></label></div>`;
  }, 'bar');

  // ================================================================= 配方实验室
  let LAB = null;
  function labFrom(r, edit) {
    LAB = { name: edit ? r.zh : r.zh + '（我的版本）', en: edit ? (r.en || '') : '', family: r.family, methods: [...(r.methods || [])], glass: r.glass || '', ice: r.ice || '', garnish: r.garnish || '',
      ings: r.ings.map(x => Object.assign({}, x)), story: edit ? (r.story || '') : '', parent: edit ? r.parent : r.id, editId: edit ? r.id : null, origin: r.id };
  }
  function labFromFamily(fid) {
    const f = FAM[fid];
    LAB = { name: '我的' + f.zh.split(' ')[0], en: '', family: fid, methods: (f.method || 'shake').split(','), glass: f.glass || '', ice: '', garnish: '', story: '', parent: null, editId: null,
      ings: f.slots.map((s, k) => ({ i: f.defaults[k] || 'other', amt: s[2] || null, unit: s[0] === 'bitters' ? 'dash' : s[0] === 'herb' ? 'pc' : 'ml', slot: s[1], opt: s[2] ? 0 : 1 })).filter(x => x.amt) };
  }
  route(/^\/lab$/, (_, q) => {
    if (q.from && BY[q.from]) labFrom(BY[q.from], q.edit === '1');
    else if (q.fam && FAM[q.fam]) labFromFamily(q.fam);
    else if (!LAB || q.new) LAB = { name: '我的新酒', en: '', family: 'other', methods: ['shake'], glass: 'coupe', ice: '', garnish: '', story: '', ings: [], parent: null, editId: null };
    if (Object.keys(q).length) after(() => history.replaceState(null, '', '#/lab'));
    after(drawLab);
    const f = FAM[LAB.family];
    return topbar('配方实验室', true) +
      `<div class="card"><input class="txt" id="labName" value="${esc(LAB.name)}" placeholder="给这杯酒起个名字">
        ${f && f.core ? `<p class="faint" style="margin:8px 0 0">骨架：<b style="color:var(--gold2)">${esc(f.zh)}</b> — ${esc(f.core)}（${esc(f.ratio)}）</p>` : ''}</div>
      <div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">材料</h3><button class="btn sm" data-act="lab-add">${ic('plus')}添加材料</button></div>
        <div id="labIngs"></div></div>
      <div class="card"><h3>做法</h3>
        <div class="fgroup"><h4>调制方法</h4><div class="chips" id="labMethods">${Object.keys(METHOD_ZH).map(m => `<button class="chip ${LAB.methods.includes(m) ? 'on' : ''}" data-lm="${m}">${methodL(m)}</button>`).join('')}</div></div>
        <div class="fgroup"><h4>载杯</h4><select class="txt" id="labGlass">${W.glasses.map(g => `<option value="${g.id}" ${LAB.glass === g.id ? 'selected' : ''}>${g.zh}</option>`).join('')}</select></div>
        <div class="fgroup"><h4>冰</h4><select class="txt" id="labIce"><option value="">默认</option>${W.ice.map(g => `<option value="${g.id}" ${LAB.ice === g.id ? 'selected' : ''}>${g.zh}</option>`).join('')}</select></div>
        <div class="fgroup"><h4>装饰</h4><input class="txt" id="labGarnish" value="${esc(LAB.garnish)}" placeholder="如 柠檬皮、薄荷尖"></div>
        <div class="fgroup"><h4>笔记 / 灵感</h4><textarea class="note" id="labStory">${esc(LAB.story)}</textarea></div></div>
      <div class="lab-panel" id="labPanel"></div>
      <div class="row" style="margin-top:12px"><button class="btn primary grow" data-act="lab-save">${ic('check')}${LAB.editId ? '保存修改' : '保存到我的配方'}</button></div>`;
  }, 'me');
  function drawLab() {
    const box = $('#labIngs'); if (!box) return;
    box.innerHTML = LAB.ings.length ? LAB.ings.map((x, k) => {
      const g = ING[x.i] || ING.other;
      const step = x.unit === 'ml' ? 2.5 : 1;
      return `<div class="lab-row"><button class="nm" data-act="lab-swap" data-k="${k}"><b>${esc(g.zh)} ${ic('swap', '').replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px;color:var(--pine)"')}</b><small>${x.slot ? `<span class="slot-hint">${esc(x.slot)}</span> · ` : ''}${esc(x.raw && x.raw !== g.zh ? x.raw : CAT_L[g.cat])}</small></button>
        <div class="amt"><button data-act="lab-amt" data-k="${k}" data-d="-${step}">−</button><input inputmode="decimal" data-lab-amt="${k}" value="${x.amt ?? ''}" placeholder="${x.unit === 'top' ? '加满' : '适量'}"><button data-act="lab-amt" data-k="${k}" data-d="${step}">+</button></div>
        <select class="unit" data-lab-unit="${k}" style="background:none;border:0;width:46px">${['ml', 'dash', 'drop', 'bsp', 'tsp', 'g', 'pc', 'top'].map(u => `<option value="${u}" ${x.unit === u ? 'selected' : ''}>${{ ml: 'ml', dash: 'dash', drop: '滴', bsp: '吧勺', tsp: '茶匙', g: 'g', pc: '个', top: '加满' }[u]}</option>`).join('')}</select>
        <button class="del" data-act="lab-del" data-k="${k}">${ic('close')}</button></div>`;
    }).join('') : '<div class="empty" style="padding:20px">还没有材料，点“添加材料”开始</div>';
    $$('[data-lab-amt]').forEach(inp => inp.oninput = () => { const v = parseFloat(inp.value); LAB.ings[+inp.dataset.labAmt].amt = isNaN(v) ? null : v; drawPanel(); });
    $$('[data-lab-unit]').forEach(s => s.onchange = () => { LAB.ings[+s.dataset.labUnit].unit = s.value; drawPanel(); });
    $('#labName').oninput = e => LAB.name = e.target.value;
    $('#labGlass').onchange = e => { LAB.glass = e.target.value; drawPanel(); };
    $('#labIce').onchange = e => { LAB.ice = e.target.value; drawPanel(); };
    $('#labGarnish').oninput = e => LAB.garnish = e.target.value;
    $('#labStory').oninput = e => LAB.story = e.target.value;
    $('#labMethods').onclick = e => { const b = e.target.closest('[data-lm]'); if (!b) return; const m = b.dataset.lm; LAB.methods = LAB.methods.includes(m) ? LAB.methods.filter(x => x !== m) : [...LAB.methods, m]; b.classList.toggle('on'); drawPanel(); };
    drawPanel();
  }
  function drawPanel() {
    const r = { ings: LAB.ings.filter(x => ING[x.i]), methods: LAB.methods, glass: LAB.glass, ice: LAB.ice };
    const a = analyze(r);
    const orig = LAB.origin && BY[LAB.origin] ? M(BY[LAB.origin]).a : null;
    let hint = '', ok = false;
    if (a.sour > 4) {
      const ratio = a.sweet / a.sour;
      if (ratio < 0.55) hint = `偏酸（甜酸比 ${ratio.toFixed(2)}），可加 ${Math.max(2.5, Math.round((0.75 * a.sour - a.sweet) * a.vol / 100 / 2.5) * 2.5)}ml 单糖浆`;
      else if (ratio > 1.25) hint = `偏甜（甜酸比 ${ratio.toFixed(2)}），可加 ${Math.max(2.5, Math.round((a.sweet / 0.95 - a.sour) * a.vol / 100 / 2.5) * 2.5)}ml 柠檬/青柠汁`;
      else { hint = `甜酸平衡（甜酸比 ${ratio.toFixed(2)}，酸酒常见 0.6~1.1）`; ok = true; }
    } else if (a.vol) {
      if (a.abv > 30) hint = '酒精度很高，可适当延长搅拌/摇和时间增加化水';
      else if (a.sweet > 25) hint = '甜度较高，可加苦精或柑橘皮平衡';
      else { hint = '结构清晰'; ok = true; }
    }
    $('#labPanel').innerHTML = `<div class="row" style="justify-content:space-between"><div><div class="big">${fmt(a.abv)}%</div><div class="faint">估算酒精度${orig ? `（原版 ${fmt(orig.abv)}%）` : ''}</div></div>
      <div style="text-align:right"><div class="big" style="font-size:20px">${Math.round(a.vol * (1 + a.dil))}ml</div><div class="faint">含化水约 ${Math.round(a.dil * 100)}%</div></div></div>
      <div class="prof" style="margin-top:8px">${['甜', '酸', '苦'].map((l, k) => { const v = [a.sweet, a.sour, a.bitter][k], mx = [32, 32, 22][k]; return `<span>${l}</span><div class="meter ${['', 'sour', 'bitter'][k]}"><i style="width:${Math.min(100, v / mx * 100)}%"></i></div><span class="faint">${Math.round(Math.min(100, v / mx * 100))}</span>`; }).join('')}</div>
      ${hint ? `<div class="hint ${ok ? 'ok' : ''}">${hint}</div>` : ''}`;
  }
  function pickIngredient(title, current, cb) {
    const sw = current ? swaps(current) : [];
    const used = new Set(ALL.flatMap(r => r.ings.map(x => x.i)).flatMap(i => [i, ...anc(i)]));
    const s = sheet(`<h3>${title}</h3><label class="search">${ic('find')}<input id="pq" placeholder="搜索材料 / 品牌"></label>
      ${sw.length ? `<div class="fgroup" style="margin-top:12px"><h4>同类替换</h4><div class="chips">${sw.map(id => `<button class="chip" data-pick="${id}">${ingName(id)}</button>`).join('')}</div></div>` : ''}
      <div id="plist" style="margin-top:8px"></div>`);
    const draw = t => {
      const items = D.ingredients.filter(x => x.id !== 'citrus' && (used.has(x.id) || x.cat === 'spirit') && (!t || [x.zh, x.en, ...(x.aliases || []), ...(x.brands || [])].join(' ').toLowerCase().includes(t)));
      $('#plist', s).innerHTML = D.cats.map(([c, l]) => { const its = items.filter(x => x.cat === c); return its.length ? `<div class="fgroup"><h4>${l}</h4><div class="chips">${its.map(x => `<button class="chip sm" data-pick="${x.id}">${x.zh}</button>`).join('')}</div></div>` : ''; }).join('');
    };
    draw('');
    $('#pq', s).oninput = e => draw(e.target.value.trim().toLowerCase());
    s.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) { closeSheet(); cb(b.dataset.pick); } });
  }

  // ================================================================= 百科
  route(/^\/wiki$/, () => {
    const preps = allPreps();
    return topbar('调酒百科', false) + `<div class="wiki-nav">
      <a href="#/wiki/families"><b>配方骨架</b><span>${D.families.filter(f => f.slots.length).length} 种母体，学会一个就会一家</span></a>
      <a href="#/wiki/methods"><b>调制方法</b><span>Build / Stir / Shake / Throw…</span></a>
      <a href="#/wiki/ingredients"><b>基酒与材料</b><span>${D.ingredients.length} 种材料与品牌</span></a>
      <a href="#/wiki/glass"><b>载杯与冰</b><span>${W.glasses.length} 种杯型</span></a>
      <a href="#/wiki/preps"><b>自制备料</b><span>${preps.length} 种糖浆、浸泡、奶洗</span></a>
      <a href="#/wiki/training"><b>技法训练</b><span>Jigger / Stir / Shake 标准</span></a>
      <a href="#/wiki/terms"><b>术语表</b><span>Dash、Twist、奶洗…</span></a>
      <a href="#/wiki/responsible"><b>理性饮酒</b><span>须知</span></a></div>`;
  }, 'wiki');
  function allPreps() {
    const seen = new Map();
    ALL.forEach(r => (r.preps || []).forEach(p => { const k = p.name.split(/[：:（(]/)[0].trim(); if (!seen.has(k)) seen.set(k, { name: p.name, how: p.how, from: [] }); seen.get(k).from.push(r); }));
    return [...seen.values()];
  }
  route(/^\/wiki\/(\w+)$/, ([sec]) => {
    if (sec === 'families') {
      after(() => { const h = location.hash.split('#')[2]; if (h) { const el = document.getElementById('fam-' + h); el && el.scrollIntoView({ block: 'start' }); } });
      return topbar('配方骨架') + `<p class="muted" style="margin-top:-6px">鸡尾酒的配方从来不是死的。每一款酒都可以看作某个“骨架”上的一种填法：换基酒、换甜味剂、换柑橘、调比例，就是新的一杯。</p>` +
        D.families.filter(f => f.slots.length).map(f => {
          const mem = ALL.filter(r => r.family === f.id);
          return `<div class="card fam" id="fam-${f.id}"><h3>${esc(f.zh)}</h3><div class="core">${esc(f.core)} · ${esc(f.ratio)}</div><p class="muted small" style="margin:4px 0 8px">${esc(f.desc)}</p>
            <div class="small" style="margin-bottom:8px">${f.slots.map(s => `<span class="tag">${esc(s[1])} ${s[3] === s[4] ? s[3] : s[3] + '~' + s[4]}${s[0] === 'bitters' ? 'dash' : s[0] === 'herb' ? '片' : 'ml'}</span>`).join(' ')}</div>
            <div class="chips" style="margin-bottom:10px">${mem.slice(0, 10).map(r => `<a class="chip sm" href="#/r/${r.id}">${esc(r.zh)}</a>`).join('')}${mem.length > 10 ? `<a class="chip sm" href="#/search?fam=${f.id}">全部 ${mem.length} 款 ›</a>` : ''}</div>
            <a class="btn sm" href="#/lab?fam=${f.id}">${ic('flask')}用这个骨架创作</a></div>`;
        }).join('');
    }
    if (sec === 'methods') return topbar('调制方法') + W.methods.map(m => `<div class="card"><h3>${m.zh}</h3><p class="muted small" style="margin:0 0 6px">适用：${m.when}</p><ol class="steps">${m.how.map(s => `<li>${s}</li>`).join('')}</ol><p class="small" style="color:var(--gold2);margin:4px 0 8px">💡 ${m.tip}</p><a class="chip sm" href="#/search?method=${m.id}">${ALL.filter(r => (r.methods || []).includes(m.id)).length} 款使用 ›</a></div>`).join('');
    if (sec === 'glass') return topbar('载杯与冰') + `<div class="list">${W.glasses.map(g => `<a class="rc" href="#/search?glass=${g.id}"><div class="sw" style="background:var(--card2);display:grid;place-items:center">${glassSvg(g.id, 'rgba(217,168,91,.6)', '').replace('<svg', '<svg style="width:40px;height:50px"')}</div><div class="grow"><div class="t"><b>${g.zh}</b><i>${g.en}</i></div><div class="ings">${g.ml} · ${g.use}</div></div><div class="abv"><span>${ALL.filter(r => r.glass === g.id).length} 款</span></div></a>`).join('')}</div>
      <div class="sec-title"><h2>冰</h2></div><div class="card">${W.ice.map(i => `<div class="ing-item"><span><b>${i.zh}</b> <span class="faint">${i.en}</span></span><span class="faint">${i.use}</span></div>`).join('')}</div>`;
    if (sec === 'ingredients') {
      return topbar('基酒与材料') + `<p class="muted" style="margin-top:-6px">配方里写的是品牌（如“必富达”），Pine 会把它归到通用材料（伦敦干金 › 金酒）。点开任何材料，都能看到可用品牌和替代品。</p>` +
        D.cats.map(([c, l]) => { const items = D.ingredients.filter(x => x.cat === c && x.id !== 'other'); return items.length ? `<details class="card cat-block" ${c === 'spirit' ? 'open' : ''}><summary>${l}<span>${items.length} ›</span></summary>${items.map(x => `<button class="ing-item" data-act="ing" data-id="${x.id}"><span>${x.parent && ING[x.parent].cat === c ? '　' : ''}<b>${x.zh}</b> <span class="faint">${x.en}</span></span><span class="faint">${x.abv ? x.abv + '%' : ''}</span></button>`).join('')}</details>` : ''; }).join('');
    }
    if (sec === 'preps') {
      after(() => { const s = $('#prepQ'); s.oninput = () => { const t = s.value.trim(); $$('[data-prep]').forEach(e => e.classList.toggle('hide', t && !e.dataset.prep.includes(t))); }; });
      return topbar('自制备料') + `<label class="search">${ic('find')}<input id="prepQ" placeholder="搜索：糖浆、奶洗、百香果…"></label><div class="gap"></div>` +
        allPreps().map(p => `<div class="card" data-prep="${esc(p.name + p.how)}"><h3>${esc(p.name)}</h3><p class="story small" style="margin:0 0 8px">${esc(p.how || '（表中未写做法）')}</p><div class="chips">${p.from.map(r => `<a class="chip sm" href="#/r/${r.id}">${esc(r.zh)}</a>`).join('')}</div></div>`).join('');
    }
    if (sec === 'training') return topbar('技法训练') + W.training.map(t => `<div class="card"><h3>${t.title}</h3><ol class="steps">${t.items.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>`).join('');
    if (sec === 'terms') return topbar('术语表') + `<div class="card">${W.terms.map(([a, b]) => `<div class="ing-item"><b>${a}</b><span class="muted small" style="text-align:right">${b}</span></div>`).join('')}</div>`;
    if (sec === 'responsible') return topbar('理性饮酒') + `<div class="card"><ol class="steps">${W.responsible.map(s => `<li>${s}</li>`).join('')}</ol></div>`;
    return topbar('百科') + '<div class="empty">没有这个页面</div>';
  }, 'wiki');

  // ================================================================= 我的
  route(/^\/me$/, () => {
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    return topbar('我的', false) + `<div class="card menu">
      <a href="#/list/favs">${ic('heart')}<span class="grow">我的收藏</span><span>${store.favs.length}</span></a>
      <a href="#/list/mine">${ic('flask')}<span class="grow">我的配方</span><span>${store.mine.length}</span></a>
      <a href="#/list/made">${ic('check')}<span class="grow">调过的酒</span><span>${Object.keys(store.made).length}</span></a>
      <a href="#/list/hist">${ic('clock')}<span class="grow">最近看过</span><span>${store.hist.length}</span></a></div>
      <div class="card menu">
      <a href="#/lab?new=1">${ic('plus')}<span class="grow">从零创作一杯</span></a>
      <a href="#/party">${ic('party')}<span class="grow">派对批量计算</span><span>${store.party.length} 款</span></a>
      <a href="#/convert">${ic('calc')}<span class="grow">单位换算 · 酒精度计算</span></a>
      <button data-act="quiz">${ic('quiz')}<span class="grow">口味测试：帮我选一杯</span></button></div>
      <div class="card"><h3>设置</h3>
        <div class="row" style="justify-content:space-between;padding:6px 0"><span>外观</span><div class="seg">${[['auto', '跟随系统'], ['dark', '深色'], ['light', '浅色']].map(([k, v]) => `<button class="${store.set.theme === k ? 'on' : ''}" data-act="theme" data-v="${k}">${v}</button>`).join('')}</div></div>
        <div class="row" style="justify-content:space-between;padding:6px 0"><span>默认单位</span><div class="seg"><button class="${store.set.unit === 'ml' ? 'on' : ''}" data-act="unit" data-u="ml">ml</button><button class="${store.set.unit === 'oz' ? 'on' : ''}" data-act="unit" data-u="oz">oz</button></div></div>
        <label class="row" style="justify-content:space-between;padding:6px 0"><span>显示原配方品牌</span><input type="checkbox" data-set="brands" ${store.set.brands ? 'checked' : ''}></label>
        <label class="row" style="justify-content:space-between;padding:6px 0"><span>吧台允许同类替代</span><input type="checkbox" data-set="flex" ${store.set.flex ? 'checked' : ''}></label></div>
      <div class="card menu">
        <button data-act="install">${ic('phone')}<span class="grow">添加到主屏幕</span><span>${standalone ? '已安装' : ''}</span></button>
        <button data-act="export">${ic('download')}<span class="grow">导出备份（收藏/吧台/配方/笔记）</span></button>
        <label style="display:flex;align-items:center;gap:12px;padding:13px 2px;cursor:pointer">${ic('upload')}<span class="grow">导入备份</span><input type="file" accept="application/json,.json" id="importFile" class="hide"></label></div>
      <p class="faint" style="text-align:center">Pine · 数据版本 ${D.version} · ${D.recipes.length} 款配方 · ${D.ingredients.length} 种材料<br>理性饮酒，未成年人请勿饮酒</p>`;
  }, 'me');
  route(/^\/list\/(\w+)$/, ([k]) => {
    const T = { favs: '我的收藏', mine: '我的配方', made: '调过的酒', hist: '最近看过' };
    let ids = k === 'favs' ? store.favs : k === 'mine' ? store.mine.map(m => m.id) : k === 'made' ? Object.keys(store.made).sort((a, b) => store.made[b] - store.made[a]) : store.hist;
    const rs = ids.map(i => BY[i]).filter(Boolean);
    return topbar(T[k] || '') + (rs.length ? `<div class="list">${rs.map(r => card(r, k === 'made' ? `<div class="faint">调过 ${store.made[r.id]} 次</div>` : '')).join('')}</div>` : `<div class="empty">${ic('leaf')}<p>这里还空着</p>${k === 'mine' ? '<a class="btn primary" href="#/lab?new=1">去创作一杯</a>' : ''}</div>`);
  }, 'me');

  // ---------------------------------------------------------------- 派对
  route(/^\/party$/, () => {
    const items = store.party.filter(p => BY[p.id]);
    const total = {};
    let cups = 0;
    items.forEach(p => {
      const r = BY[p.id]; cups += p.n;
      const mult = r.batch && r.serve ? p.n * r.serve / Math.max(1, r.ings.reduce((s, x) => s + volOf(x, r), 0)) : p.n;
      r.ings.forEach(x => { if (x.opt) return; const k = x.i + '|' + (x.unit === 'top' ? 'ml' : x.unit || 'some'); const v = x.unit === 'top' ? volOf(x, r) : (x.amt || 0); total[k] = (total[k] || 0) + v * mult; });
    });
    const rows = Object.entries(total).map(([k, v]) => { const [i, u] = k.split('|'); return [i, u, v]; }).sort((a, b) => D.cats.findIndex(c => c[0] === ING[a[0]].cat) - D.cats.findIndex(c => c[0] === ING[b[0]].cat));
    const UNIT = { ml: 'ml', dash: 'dash', drop: '滴', bsp: '吧勺', tsp: '茶匙', g: 'g', pc: '个', some: '' };
    return topbar('派对批量计算') + (items.length ? `<div class="card">${items.map(p => { const r = BY[p.id]; return `<div class="lab-row"><a class="nm" href="#/r/${r.id}"><b>${esc(r.zh)}</b><small>${esc(r.en || '')}</small></a><div class="stepper"><button data-act="party-n" data-id="${r.id}" data-d="-1">−</button><span>${p.n}</span><button data-act="party-n" data-id="${r.id}" data-d="1">+</button></div><span class="unit">杯</span></div>`; }).join('')}
      <div class="row wrap" style="margin-top:10px"><button class="btn sm" data-act="party-all" data-d="1">全部 +1</button><button class="btn sm" data-act="party-all" data-d="5">全部 +5</button><button class="btn sm" data-act="party-clear">清空</button></div></div>
      <div class="card"><h3>${ic('cart')} 采购 / 备料清单 · 共 ${cups} 杯</h3>${rows.map(([i, u, v]) => {
        const g = ING[i]; const ml = u === 'ml';
        const bottle = ml && ['spirit', 'liqueur', 'amaro', 'vermouth', 'wine'].includes(g.cat) ? `约 ${Math.ceil(v / 700 * 10) / 10} 瓶(700ml)` : ml && v >= 1000 ? `约 ${fmt(v / 1000)} L` : '';
        return `<div class="ing-item"><span><b>${g.zh}</b><br><span class="faint">${(g.brands || []).slice(0, 2).join(' / ')}</span></span><span style="text-align:right"><b>${fmt(v)} ${UNIT[u]}</b><br><span class="faint">${bottle}</span></span></div>`;
      }).join('')}
      <div class="ing-item"><span><b>冰块</b></span><span><b>约 ${fmt(cups * 0.25)} kg</b></span></div></div>` :
      `<div class="empty">${ic('party')}<p>在任意酒款详情页点“加入派对清单”，这里会自动汇总所有材料用量。</p><a class="btn primary" href="#/search">去挑酒</a></div>`);
  }, 'me');

  // ---------------------------------------------------------------- 换算
  route(/^\/convert$/, () => {
    after(() => {
      const ml = $('#cvMl'), oz = $('#cvOz'), sg = $('#cvSugar'), sy = $('#cvSyrup');
      ml.oninput = () => oz.value = ml.value ? fmt(ml.value / 29.57) : '';
      oz.oninput = () => ml.value = oz.value ? fmt(oz.value * 29.57) : '';
      sg.oninput = () => sy.value = sg.value ? fmt(sg.value * 1.5) : '';
      sy.oninput = () => sg.value = sy.value ? fmt(sy.value / 1.5) : '';
    });
    return topbar('单位换算') + `<div class="card"><h3>毫升 ⇄ 盎司</h3><div class="row"><input class="txt" id="cvMl" inputmode="decimal" placeholder="ml"><span>=</span><input class="txt" id="cvOz" inputmode="decimal" placeholder="oz"></div>
      <p class="faint" style="margin:8px 0 0">吧台习惯 1oz ≈ 30ml（精确 29.57ml）。0.75oz=22.5ml，0.5oz=15ml，0.25oz=7.5ml。</p></div>
      <div class="card"><h3>糖粉 ⇄ 单糖浆（甜度相当）</h3><div class="row"><input class="txt" id="cvSugar" inputmode="decimal" placeholder="糖粉 g"><span>≈</span><input class="txt" id="cvSyrup" inputmode="decimal" placeholder="单糖浆 ml"></div>
      <p class="faint" style="margin:8px 0 0">2:1 浓糖浆的甜度约为 1:1 单糖浆的 1.6 倍。</p></div>
      <div class="card"><h3>小用量参考</h3><div class="kv"><dt>1 dash</dt><dd>约 0.6~1ml</dd><dt>1 滴</dt><dd>约 0.05ml</dd><dt>1 吧勺</dt><dd>约 5ml</dd><dt>1 茶匙</dt><dd>约 5ml</dd><dt>1 方糖</dt><dd>约 4g</dd><dt>半个青柠</dt><dd>约 15ml 汁</dd><dt>1 个柠檬</dt><dd>约 30~40ml 汁</dd></div></div>
      <a class="btn block" href="#/lab?new=1">${ic('flask')}酒精度计算：在配方实验室里自由组合</a>`;
  }, 'me');

  // ---------------------------------------------------------------- 口味测试
  function quiz() {
    const Q = [
      ['今晚想要什么酒精度？', [['zero', '不喝酒'], ['low', '轻松一点'], ['medium', '适中'], ['strong', '来点烈的']]],
      ['想要的风味方向？', [['fresh', '清爽气泡'], ['sour', '酸爽开胃'], ['fruity', '果香甜美'], ['bitter', '苦甜复杂'], ['creamy', '奶香甜点'], ['smoky', '烟熏草本']]],
      ['偏爱的基酒？', [['any', '都可以'], ...D.bases.slice(0, 7).map(([k, v]) => [k, v])]],
      ['什么场合？', [['before', '餐前开胃'], ['after', '餐后小酌'], ['party', '朋友派对'], ['alone', '一个人慢慢喝']]],
    ];
    const ans = [];
    const step = () => {
      if (ans.length === Q.length) return result();
      const [t, opts] = Q[ans.length];
      sheet(`<h3>${ans.length + 1}/${Q.length} · ${t}</h3><div class="chips">${opts.map(([k, v]) => `<button class="chip" data-q="${k}">${v}</button>`).join('')}</div>`, s => s.addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (b) { ans.push(b.dataset.q); step(); } }));
    };
    const result = () => {
      const [str, fl, base, occ] = ans;
      const scored = ALL.filter(r => r.src !== 'mine').map(r => {
        const m = M(r); let s = Math.random();
        if (m.strength === str) s += 6; else if (str === 'zero' && m.strength !== 'zero') s -= 50;
        if (m.tags.includes(fl)) s += 5; if (fl === 'smoky' && m.tags.includes('herbal')) s += 3;
        if (base !== 'any' && m.bases.includes(base)) s += 4;
        if (occ === 'before' && (m.tags.includes('bitter') || ['spritz', 'martini', 'negroni'].includes(r.family))) s += 3;
        if (occ === 'after' && (['flip', 'duo', 'oldfashioned'].includes(r.family) || m.tags.includes('coffee'))) s += 3;
        if (occ === 'party' && (['highball', 'fizz', 'tiki', 'spritz', 'punch'].includes(r.family))) s += 3;
        if (occ === 'alone' && ['oldfashioned', 'martini', 'negroni'].includes(r.family)) s += 3;
        if (BAR.size && !barCheck(r).miss.length) s += 2;
        return [r, s];
      }).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
      sheet(`<h3>为你挑了这几杯</h3><div class="list">${scored.map(r => card(r)).join('')}</div><div class="sheet-foot"><button class="btn block" data-act="quiz">再测一次</button></div>`, s => s.addEventListener('click', e => { if (e.target.closest('a')) closeSheet(); }));
    };
    step();
  }

  // ---------------------------------------------------------------- 摇一摇
  let motionOn = false, lastShake = 0;
  function onMotion(e) {
    const a = e.accelerationIncludingGravity; if (!a) return;
    const f = Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
    if (f > 38 && Date.now() - lastShake > 1200) { lastShake = Date.now(); if (location.hash === '' || location.hash === '#/') { pickId = randomPick().id; try { navigator.vibrate && navigator.vibrate(60); } catch (x) { } render(); } }
  }
  async function enableMotion() {
    if (motionOn) { toast('摇一摇已开启，摇动手机即可换一杯'); return; }
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) { const p = await DeviceMotionEvent.requestPermission(); if (p !== 'granted') return toast('未获得动作权限'); }
      if (typeof DeviceMotionEvent === 'undefined') return toast('此设备不支持摇一摇');
      window.addEventListener('devicemotion', onMotion); motionOn = true; toast('已开启，摇动手机换一杯');
    } catch (e) { toast('此设备不支持摇一摇'); }
  }

  // ---------------------------------------------------------------- 安装
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
  function installGuide() {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => deferredPrompt = null); return; }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), wx = /micromessenger/i.test(navigator.userAgent);
    sheet(`<h3>添加到主屏幕</h3>
      ${wx ? '<div class="card small">当前在微信内打开：请点右上角 “···” → “在浏览器打开”，再按下方步骤操作。</div>' : ''}
      <div class="card"><h3>iPhone / iPad（Safari）</h3><ol class="steps"><li>用 Safari 打开本页面</li><li>点底部的“分享”按钮（方框加向上箭头）</li><li>下滑选择“添加到主屏幕”</li><li>点“添加”，桌面上就会出现 Pine 图标</li></ol></div>
      <div class="card"><h3>安卓（Chrome / Edge / 华为、小米浏览器）</h3><ol class="steps"><li>打开浏览器菜单（右上角 ⋮ 或底部 ≡）</li><li>选择“添加到主屏幕”或“安装应用”</li><li>确认添加</li></ol></div>
      <p class="faint">${ios ? '检测到你在使用苹果设备。' : ''}安装后从桌面打开即为全屏模式；打开过一次后，断网也能正常使用。</p>`);
  }

  // ---------------------------------------------------------------- 备份
  function exportData() {
    const blob = new Blob([JSON.stringify({ app: 'pine', at: new Date().toISOString(), data: store }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pine-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importData(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const j = JSON.parse(fr.result); const d = j.data || j;
        if (!d || typeof d !== 'object' || !Array.isArray(d.favs)) throw 0;
        store.favs = uniq([...store.favs, ...d.favs]);
        store.bar = uniq([...store.bar, ...(d.bar || [])]); BAR = new Set(store.bar);
        Object.assign(store.notes, d.notes || {}); Object.assign(store.rate, d.rate || {}); Object.assign(store.made, d.made || {});
        const ids = new Set(store.mine.map(m => m.id)); (d.mine || []).forEach(m => { if (!ids.has(m.id)) store.mine.push(m); });
        save(); reindex(); render(); toast('导入完成');
      } catch (e) { toast('文件格式不正确'); }
    };
    fr.readAsText(file);
  }

  // ---------------------------------------------------------------- 事件
  const A = {
    back: () => history.length > 1 ? history.back() : go('#/'),
    open: el => go('#/r/' + el.dataset.id),
    shuffle: (el, e) => { e.stopPropagation(); pickId = randomPick().id; render(); },
    motion: enableMotion,
    quiz: () => quiz(),
    filters: filterSheet,
    more: () => { shown += PAGE; drawResults(); },
    unf: el => {
      const k = el.dataset.k, v = el.dataset.v;
      if (k === 'all') Object.assign(F, newFilter(), { q: F.q, sort: F.sort });
      else if (F[k] instanceof Set) F[k].delete(v);
      else if (Array.isArray(F[k])) F[k].splice(F[k].indexOf(v), 1);
      else if (k === 'abv') { F.abvMin = 0; F.abvMax = 45; }
      else F[k] = k === 'smart' ? '' : false;
      drawResults();
    },
    freset: () => { Object.assign(F, newFilter(), { q: F.q }); closeSheet(); drawResults(); },
    fdone: () => { closeSheet(); shown = PAGE; drawResults(); },
    fav: el => { const id = el.dataset.id; store.favs = store.favs.includes(id) ? store.favs.filter(x => x !== id) : [id, ...store.favs]; save(); render(); toast(store.favs.includes(id) ? '已收藏' : '已取消收藏'); },
    made: el => { const id = el.dataset.id; store.made[id] = (store.made[id] || 0) + 1; save(); render(); toast('已记录 +1 🍸'); },
    rate: el => { const id = el.dataset.id, n = +el.dataset.n; store.rate[id] = store.rate[id] === n ? 0 : n; save(); $$('.stars button').forEach((b, k) => b.classList.toggle('on', k < store.rate[id])); },
    serv: el => { serv = Math.max(1, Math.min(50, serv + +el.dataset.d)); render(); },
    unit: el => { store.set.unit = el.dataset.u; save(); render(); },
    theme: el => { store.set.theme = el.dataset.v; save(); applyTheme(); render(); },
    stepmode: () => { const id = location.hash.split('/r/')[1]; BY[decodeURIComponent(id)] && stepMode(BY[decodeURIComponent(id)]); },
    lab: el => { closeSheet(); go(`#/lab?from=${encodeURIComponent(el.dataset.id)}${el.dataset.edit ? '&edit=1' : ''}`); },
    ing: el => ingSheet(el.dataset.id),
    swaps: el => { const id = decodeURIComponent(location.hash.split('/r/')[1]); swapSheet(BY[id], +el.dataset.k); },
    close: () => closeSheet(),
    share: async () => {
      const id = decodeURIComponent(location.hash.split('/r/')[1]); const r = BY[id];
      const text = `${r.zh} ${r.en || ''}\n` + r.ings.map(x => `· ${ingName(x.i)} ${amtText(x)}`).join('\n') + `\n${(r.methods || []).map(methodL).join(' → ')} · ${glassL(r.glass)}${r.garnish ? ' · 装饰：' + r.garnish : ''}\n—— 来自 Pine`;
      try { if (navigator.share) await navigator.share({ title: r.zh, text }); else { await navigator.clipboard.writeText(text); toast('配方已复制'); } } catch (e) { }
    },
    'party-add': el => { const id = el.dataset.id; const p = store.party.find(x => x.id === id); if (p) p.n++; else store.party.push({ id, n: 1 }); save(); toast(`已加入派对清单 <u>查看</u>`, () => go('#/party')); },
    'party-n': el => { const p = store.party.find(x => x.id === el.dataset.id); p.n = Math.max(0, p.n + +el.dataset.d); store.party = store.party.filter(x => x.n > 0); save(); render(); },
    'party-all': el => { store.party.forEach(p => p.n += +el.dataset.d); save(); render(); },
    'party-clear': () => { store.party = []; save(); render(); },
    'del-mine': el => { if (!confirm('删除这款自创配方？此操作不可撤销。')) return; store.mine = store.mine.filter(m => m.id !== el.dataset.id); save(); reindex(); go('#/list/mine'); },
    'bar-chip': el => { const id = el.dataset.id; BAR.has(id) ? BAR.delete(id) : BAR.add(id); store.bar = [...BAR]; save(); el.classList.toggle('on'); clearTimeout(A._bt); A._bt = setTimeout(() => { const y = scrollY; const open = $$('.cat-block').map(d => d.open); const q = ($('#barQ') || {}).value; render(); $$('.cat-block').forEach((d, k) => d.open = open[k]); if (q) { $('#barQ').value = q; $('#barQ').oninput(); } scrollTo(0, y); }, 900); },
    'bar-tog': el => { const id = el.dataset.id; BAR.has(id) ? BAR.delete(id) : BAR.add(id); store.bar = [...BAR]; save(); closeSheet(); toast(BAR.has(id) ? `已把 ${ingName(id)} 加入吧台` : `已移除 ${ingName(id)}`); render(); },
    'bar-clear': () => { if (!BAR.size || !confirm('清空吧台库存？')) return; BAR.clear(); store.bar = []; save(); render(); },
    preset: el => { PRESETS[el.dataset.k].forEach(i => BAR.add(i)); store.bar = [...BAR]; save(); render(); toast('已导入，可继续增减'); },
    'lab-add': () => pickIngredient('添加材料', null, id => { const g = ING[id]; LAB.ings.push({ i: id, amt: g.cat === 'bitters' ? 2 : ['fruit', 'herb'].includes(g.cat) ? 1 : g.cat === 'mixer' ? 90 : 15, unit: g.cat === 'bitters' ? 'dash' : ['fruit', 'herb'].includes(g.cat) ? 'pc' : 'ml' }); drawLab(); }),
    'lab-swap': el => { const k = +el.dataset.k; pickIngredient('替换 ' + ingName(LAB.ings[k].i), LAB.ings[k].i, id => { LAB.ings[k].i = id; delete LAB.ings[k].raw; delete LAB.ings[k].brand; drawLab(); }); },
    'lab-amt': el => { const x = LAB.ings[+el.dataset.k]; if (x.unit === 'top') x.unit = 'ml'; x.amt = Math.max(0, Math.round(((x.amt || 0) + +el.dataset.d) * 10) / 10); drawLab(); },
    'lab-del': el => { LAB.ings.splice(+el.dataset.k, 1); drawLab(); },
    'lab-save': () => {
      if (!LAB.ings.length) return toast('先添加一些材料');
      const rec = { id: LAB.editId || 'my-' + Date.now().toString(36), zh: (LAB.name || '我的新酒').trim(), en: LAB.en, family: LAB.family, methods: LAB.methods.length ? LAB.methods : ['build'],
        glass: LAB.glass, ice: LAB.ice, garnish: LAB.garnish, story: LAB.story, ings: LAB.ings.map(x => { const o = { i: x.i, raw: x.raw || ingName(x.i), unit: x.unit }; if (x.amt != null) o.amt = x.amt; if (x.opt) o.opt = 1; return o; }), parent: LAB.parent || undefined };
      const k = store.mine.findIndex(m => m.id === rec.id);
      if (k >= 0) store.mine[k] = rec; else store.mine.unshift(rec);
      save(); reindex(); LAB = null; toast('已保存到“我的配方”'); go('#/r/' + rec.id);
    },
    install: installGuide,
    export: exportData,
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = A[el.dataset.act]; if (!fn) return;
    if (el.tagName !== 'A') e.preventDefault();
    fn(el, e);
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset && t.dataset.set) { store.set[t.dataset.set] = t.checked; save(); if (location.hash.startsWith('#/bar')) render(); }
    if (t.id === 'importFile' && t.files[0]) importData(t.files[0]);
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'note') { const id = decodeURIComponent(location.hash.split('/r/')[1]); store.notes[id] = e.target.value; if (!e.target.value) delete store.notes[id]; clearTimeout(A._nt); A._nt = setTimeout(save, 400); }
  });

  function applyTheme() {
    const t = store.set.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t;
    const dark = t === 'dark' || (t === 'auto' && !matchMedia('(prefers-color-scheme: light)').matches);
    $('meta[name=theme-color]').setAttribute('content', dark ? '#0e1311' : '#f5f1e8');
  }

  // ---------------------------------------------------------------- 启动
  function ageGate() {
    if (store.set.age) return;
    const el = document.createElement('div'); el.className = 'age-gate';
    el.innerHTML = `${LOGO}<h1 class="serif">Pine</h1><p class="muted">调酒配方 · 吧台助手 · 离线可用</p><p>本应用包含酒精饮品内容，<br>请确认你已年满 18 周岁。</p>
      <button class="btn primary" style="min-width:220px">我已年满 18 岁，进入</button><p class="faint">理性饮酒 · 饮酒不开车</p>`;
    el.querySelector('button').onclick = () => { store.set.age = true; save(); el.remove(); };
    document.body.appendChild(el);
  }
  function registerSW() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    navigator.serviceWorker.register('sw.js').then(reg => {
      const ask = w => toast('Pine 有新版本，<u>点此更新</u>', () => w.postMessage('skip'));
      if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w); }); });
    }).catch(() => { });
    // 只有“更新”时才刷新；首次安装接管页面时不刷新
    const hadController = !!navigator.serviceWorker.controller;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloading) { reloading = true; location.reload(); } });
  }
  reindex();
  applyTheme();
  matchMedia('(prefers-color-scheme: light)').addEventListener && matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme);
  $('#tabs').innerHTML = [['home', '#/', '发现'], ['find', '#/search', '找酒'], ['bar', '#/bar', '吧台'], ['book', '#/wiki', '百科'], ['user', '#/me', '我的']]
    .map(([i, h, l]) => `<a href="${h}" data-tab="${{ home: 'home', find: 'find', bar: 'bar', book: 'wiki', user: 'me' }[i]}">${ic(i)}<span>${l}</span></a>`).join('');
  window.addEventListener('hashchange', () => { closeSheet(); render(); });
  render();
  ageGate();
  registerSW();
})();
