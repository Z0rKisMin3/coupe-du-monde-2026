#!/usr/bin/env node
// Outil de mise à jour des résultats — Coupe du Monde 2026
// Usage :
//   node update-results.mjs list                 → liste JSON des matchs terminés sans résultat encodé
//   node update-results.mjs push KEY S1 S2       → encode un résultat (variable d'env ADMIN_CODE requise)
// Règle tirs au but : score après prolongation, +1 but au vainqueur de la séance.

const SB_URL = 'https://ydsdnfaeimonpkinysbn.supabase.co';
const SB_KEY = 'sb_publishable_iksLlRr2OjeV-jBAWZH51w__Xn3uj-U';

const GROUPS = [{"id":"A","teams":["Mexique","Afrique du Sud","Corée du Sud","Tchéquie"],"matches":[{"d":"11/06","h":"21:00","t1":"Mexique","t2":"Afrique du Sud"},{"d":"12/06","h":"04:00","t1":"Corée du Sud","t2":"Tchéquie"},{"d":"18/06","h":"18:00","t1":"Tchéquie","t2":"Afrique du Sud"},{"d":"19/06","h":"03:00","t1":"Mexique","t2":"Corée du Sud"},{"d":"25/06","h":"03:00","t1":"Tchéquie","t2":"Mexique"},{"d":"25/06","h":"03:00","t1":"Afrique du Sud","t2":"Corée du Sud"}]},{"id":"B","teams":["Canada","Bosnie-Herzégovine","Qatar","Suisse"],"matches":[{"d":"12/06","h":"21:00","t1":"Canada","t2":"Bosnie-Herzégovine"},{"d":"13/06","h":"21:00","t1":"Qatar","t2":"Suisse"},{"d":"18/06","h":"21:00","t1":"Suisse","t2":"Bosnie-Herzégovine"},{"d":"19/06","h":"00:00","t1":"Canada","t2":"Qatar"},{"d":"24/06","h":"21:00","t1":"Suisse","t2":"Canada"},{"d":"24/06","h":"21:00","t1":"Bosnie-Herzégovine","t2":"Qatar"}]},{"id":"C","teams":["Brésil","Maroc","Haïti","Écosse"],"matches":[{"d":"14/06","h":"00:00","t1":"Brésil","t2":"Maroc"},{"d":"14/06","h":"03:00","t1":"Haïti","t2":"Écosse"},{"d":"20/06","h":"00:00","t1":"Écosse","t2":"Maroc"},{"d":"20/06","h":"02:30","t1":"Brésil","t2":"Haïti"},{"d":"25/06","h":"00:00","t1":"Écosse","t2":"Brésil"},{"d":"25/06","h":"00:00","t1":"Maroc","t2":"Haïti"}]},{"id":"D","teams":["États-Unis","Paraguay","Australie","Turquie"],"matches":[{"d":"13/06","h":"03:00","t1":"États-Unis","t2":"Paraguay"},{"d":"13/06","h":"06:00","t1":"Australie","t2":"Turquie"},{"d":"19/06","h":"21:00","t1":"États-Unis","t2":"Australie"},{"d":"20/06","h":"05:00","t1":"Turquie","t2":"Paraguay"},{"d":"26/06","h":"03:00","t1":"Turquie","t2":"États-Unis"},{"d":"26/06","h":"03:00","t1":"Paraguay","t2":"Australie"}]},{"id":"E","teams":["Allemagne","Curaçao","Côte d'Ivoire","Équateur"],"matches":[{"d":"14/06","h":"19:00","t1":"Allemagne","t2":"Curaçao"},{"d":"15/06","h":"01:00","t1":"Côte d'Ivoire","t2":"Équateur"},{"d":"21/06","h":"01:00","t1":"Allemagne","t2":"Côte d'Ivoire"},{"d":"21/06","h":"02:00","t1":"Équateur","t2":"Curaçao"},{"d":"25/06","h":"22:00","t1":"Équateur","t2":"Allemagne"},{"d":"25/06","h":"22:00","t1":"Curaçao","t2":"Côte d'Ivoire"}]},{"id":"F","teams":["Pays-Bas","Japon","Suède","Tunisie"],"matches":[{"d":"14/06","h":"22:00","t1":"Pays-Bas","t2":"Japon"},{"d":"15/06","h":"04:00","t1":"Suède","t2":"Tunisie"},{"d":"20/06","h":"19:00","t1":"Pays-Bas","t2":"Suède"},{"d":"21/06","h":"04:00","t1":"Tunisie","t2":"Japon"},{"d":"26/06","h":"01:00","t1":"Japon","t2":"Suède"},{"d":"26/06","h":"01:00","t1":"Tunisie","t2":"Pays-Bas"}]},{"id":"G","teams":["Belgique","Égypte","Iran","Nouvelle-Zélande"],"matches":[{"d":"16/06","h":"00:00","t1":"Belgique","t2":"Égypte"},{"d":"16/06","h":"03:00","t1":"Iran","t2":"Nouvelle-Zélande"},{"d":"22/06","h":"03:00","t1":"Belgique","t2":"Iran"},{"d":"22/06","h":"03:00","t1":"Nouvelle-Zélande","t2":"Égypte"},{"d":"24/06","h":"22:00","t1":"Belgique","t2":"Nouvelle-Zélande"},{"d":"24/06","h":"22:00","t1":"Égypte","t2":"Iran"}]},{"id":"H","teams":["Espagne","Cap-Vert","Arabie Saoudite","Uruguay"],"matches":[{"d":"15/06","h":"19:00","t1":"Espagne","t2":"Cap-Vert"},{"d":"16/06","h":"00:00","t1":"Arabie Saoudite","t2":"Uruguay"},{"d":"21/06","h":"18:00","t1":"Espagne","t2":"Arabie Saoudite"},{"d":"22/06","h":"00:00","t1":"Uruguay","t2":"Cap-Vert"},{"d":"25/06","h":"18:00","t1":"Uruguay","t2":"Espagne"},{"d":"25/06","h":"18:00","t1":"Cap-Vert","t2":"Arabie Saoudite"}]},{"id":"I","teams":["France","Sénégal","Irak","Norvège"],"matches":[{"d":"16/06","h":"21:00","t1":"France","t2":"Sénégal"},{"d":"17/06","h":"00:00","t1":"Irak","t2":"Norvège"},{"d":"22/06","h":"23:00","t1":"France","t2":"Irak"},{"d":"23/06","h":"02:00","t1":"Norvège","t2":"Sénégal"},{"d":"26/06","h":"22:00","t1":"Norvège","t2":"France"},{"d":"26/06","h":"22:00","t1":"Sénégal","t2":"Irak"}]},{"id":"J","teams":["Argentine","Algérie","Autriche","Jordanie"],"matches":[{"d":"17/06","h":"03:00","t1":"Argentine","t2":"Algérie"},{"d":"17/06","h":"06:00","t1":"Autriche","t2":"Jordanie"},{"d":"22/06","h":"19:00","t1":"Argentine","t2":"Autriche"},{"d":"23/06","h":"03:00","t1":"Jordanie","t2":"Algérie"},{"d":"27/06","h":"03:00","t1":"Jordanie","t2":"Argentine"},{"d":"27/06","h":"03:00","t1":"Algérie","t2":"Autriche"}]},{"id":"K","teams":["Portugal","RD Congo","Ouzbékistan","Colombie"],"matches":[{"d":"17/06","h":"19:00","t1":"Portugal","t2":"RD Congo"},{"d":"18/06","h":"04:00","t1":"Ouzbékistan","t2":"Colombie"},{"d":"23/06","h":"19:00","t1":"Portugal","t2":"Ouzbékistan"},{"d":"24/06","h":"04:00","t1":"Colombie","t2":"RD Congo"},{"d":"27/06","h":"22:00","t1":"Colombie","t2":"Portugal"},{"d":"27/06","h":"22:00","t1":"RD Congo","t2":"Ouzbékistan"}]},{"id":"L","teams":["Angleterre","Croatie","Ghana","Panama"],"matches":[{"d":"17/06","h":"22:00","t1":"Angleterre","t2":"Croatie"},{"d":"18/06","h":"01:00","t1":"Ghana","t2":"Panama"},{"d":"23/06","h":"22:00","t1":"Angleterre","t2":"Ghana"},{"d":"24/06","h":"01:00","t1":"Panama","t2":"Croatie"},{"d":"27/06","h":"00:00","t1":"Panama","t2":"Angleterre"},{"d":"27/06","h":"00:00","t1":"Croatie","t2":"Ghana"}]}];
const KO_MATCHES = [{"r":"32es de Finale","matchups":[{"id":"R32_1","t1":{"src":"2A"},"t2":{"src":"2B"},"d":"28/06","h":"21:00"},{"id":"R32_4","t1":{"src":"1C"},"t2":{"src":"2F"},"d":"29/06","h":"19:00"},{"id":"R32_2","t1":{"src":"1E"},"t2":{"src":"3ABCDF"},"d":"29/06","h":"22:30"},{"id":"R32_3","t1":{"src":"1F"},"t2":{"src":"2C"},"d":"30/06","h":"03:00"},{"id":"R32_6","t1":{"src":"2E"},"t2":{"src":"2I"},"d":"30/06","h":"19:00"},{"id":"R32_5","t1":{"src":"1I"},"t2":{"src":"3CDFGH"},"d":"30/06","h":"23:00"},{"id":"R32_7","t1":{"src":"1A"},"t2":{"src":"3CEFHI"},"d":"01/07","h":"03:00"},{"id":"R32_8","t1":{"src":"1L"},"t2":{"src":"3EHIJK"},"d":"01/07","h":"18:00"},{"id":"R32_10","t1":{"src":"1G"},"t2":{"src":"3AEHIJ"},"d":"01/07","h":"22:00"},{"id":"R32_9","t1":{"src":"1D"},"t2":{"src":"3BEFIJ"},"d":"02/07","h":"02:00"},{"id":"R32_12","t1":{"src":"1H"},"t2":{"src":"2J"},"d":"02/07","h":"21:00"},{"id":"R32_11","t1":{"src":"2K"},"t2":{"src":"2L"},"d":"03/07","h":"01:00"},{"id":"R32_13","t1":{"src":"1B"},"t2":{"src":"3EFGIJ"},"d":"03/07","h":"05:00"},{"id":"R32_16","t1":{"src":"2D"},"t2":{"src":"2G"},"d":"03/07","h":"20:00"},{"id":"R32_14","t1":{"src":"1J"},"t2":{"src":"2H"},"d":"04/07","h":"00:00"},{"id":"R32_15","t1":{"src":"1K"},"t2":{"src":"3DEIJL"},"d":"04/07","h":"03:30"}]},{"r":"8es de Finale","matchups":[{"id":"R16_1","t1":{"src":"WR32_2"},"t2":{"src":"WR32_5"},"d":"04/07","h":"19:00"},{"id":"R16_2","t1":{"src":"WR32_1"},"t2":{"src":"WR32_3"},"d":"04/07","h":"19:00"},{"id":"R16_3","t1":{"src":"WR32_4"},"t2":{"src":"WR32_6"},"d":"05/07","h":"22:00"},{"id":"R16_4","t1":{"src":"WR32_7"},"t2":{"src":"WR32_8"},"d":"06/07","h":"02:00"},{"id":"R16_5","t1":{"src":"WR32_11"},"t2":{"src":"WR32_12"},"d":"06/07","h":"21:00"},{"id":"R16_6","t1":{"src":"WR32_9"},"t2":{"src":"WR32_10"},"d":"07/07","h":"02:00"},{"id":"R16_7","t1":{"src":"WR32_14"},"t2":{"src":"WR32_16"},"d":"07/07","h":"18:00"},{"id":"R16_8","t1":{"src":"WR32_13"},"t2":{"src":"WR32_15"},"d":"07/07","h":"22:00"}]},{"r":"Quarts de Finale","matchups":[{"id":"QF_1","t1":{"src":"WR16_1"},"t2":{"src":"WR16_2"},"d":"09/07","h":"22:00"},{"id":"QF_2","t1":{"src":"WR16_5"},"t2":{"src":"WR16_6"},"d":"10/07","h":"21:00"},{"id":"QF_3","t1":{"src":"WR16_3"},"t2":{"src":"WR16_4"},"d":"11/07","h":"23:00"},{"id":"QF_4","t1":{"src":"WR16_7"},"t2":{"src":"WR16_8"},"d":"12/07","h":"03:00"}]},{"r":"Demi-Finales","matchups":[{"id":"SF_1","t1":{"src":"WQF_1"},"t2":{"src":"WQF_2"},"d":"14/07","h":"21:00"},{"id":"SF_2","t1":{"src":"WQF_3"},"t2":{"src":"WQF_4"},"d":"15/07","h":"21:00"}]},{"r":"Match pour la 3e Place","matchups":[{"id":"3RD","t1":{"src":"LSF_1"},"t2":{"src":"LSF_2"},"d":"18/07","h":"23:00"}]},{"r":"FINALE 🏆","matchups":[{"id":"FINAL","t1":{"src":"WSF_1"},"t2":{"src":"WSF_2"},"d":"19/07","h":"21:00"}]}];

async function sb(path, opts = {}) {
  const res = await fetch(SB_URL + '/rest/v1/' + path, {
    ...opts,
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) }
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(txt || String(res.status));
  return txt ? JSON.parse(txt) : null;
}

function standings(g, res) {
  const tbl = {};
  g.teams.forEach(t => (tbl[t] = { pts: 0, gd: 0, gf: 0, mp: 0 }));
  g.matches.forEach((m, mi) => {
    const r = res['g' + g.id + '_' + mi];
    if (!r) return;
    const [a, b] = r, A = tbl[m.t1], B = tbl[m.t2];
    A.mp++; B.mp++; A.gf += a; B.gf += b; A.gd += a - b; B.gd += b - a;
    if (a > b) A.pts += 3; else if (b > a) B.pts += 3; else { A.pts++; B.pts++; }
  });
  return g.teams.slice()
    .sort((x, y) => tbl[y].pts - tbl[x].pts || tbl[y].gd - tbl[x].gd || tbl[y].gf - tbl[x].gf)
    .map(t => ({ team: t, ...tbl[t] }));
}

function allThirds(res) {
  const th = [];
  GROUPS.forEach(g => { const st = standings(g, res); if (st[2].mp === 3) th.push({ group: g.id, ...st[2] }); });
  th.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  return th;
}

// Attribution unique des 8 meilleurs 3es aux places du tableau (backtracking),
// calculée uniquement quand les 12 groupes sont terminés — même logique que l'app.
function thirdAssignments(res) {
  const th = allThirds(res);
  if (th.length < 12) return null;
  const byGroup = {};
  th.slice(0, 8).forEach(b => (byGroup[b.group] = b.team));
  const slots = [];
  KO_MATCHES.forEach(r => r.matchups.forEach(mu => {
    [mu.t1, mu.t2].forEach(t => {
      const m = t.src.match(/^3([A-L]+)$/);
      if (m) slots.push({ src: t.src, allowed: m[1].split('').filter(g => byGroup[g]) });
    });
  }));
  slots.sort((a, b) => a.allowed.length - b.allowed.length);
  const assign = {}, used = new Set();
  function bt(i) {
    if (i === slots.length) return true;
    for (const g of slots[i].allowed) {
      if (used.has(g)) continue;
      used.add(g); assign[slots[i].src] = byGroup[g];
      if (bt(i + 1)) return true;
      used.delete(g); delete assign[slots[i].src];
    }
    return false;
  }
  return bt(0) ? assign : null;
}

function resolveTeam(src, res, winners, losers, assign) {
  let m = src.match(/^(\d)([A-L])$/);
  if (m) {
    const g = GROUPS.find(x => x.id === m[2]);
    const st = standings(g, res);
    const row = st[parseInt(m[1]) - 1];
    return row && row.mp === 3 ? { name: row.team, q: true } : { name: src, q: false };
  }
  m = src.match(/^3([A-L]+)$/);
  if (m) return assign && assign[src] ? { name: assign[src], q: true } : { name: src, q: false };
  m = src.match(/^W(R32_\d+|R16_\d+|QF_\d|SF_\d)$/);
  if (m) return winners[m[1]] ? { name: winners[m[1]], q: true } : { name: src, q: false };
  m = src.match(/^L(SF_\d)$/);
  if (m) return losers[m[1]] ? { name: losers[m[1]], q: true } : { name: src, q: false };
  return { name: src, q: false };
}

function koResults(res) {
  const winners = {}, losers = {};
  const assign = thirdAssignments(res);
  KO_MATCHES.forEach(round => round.matchups.forEach(mu => {
    const r = res['ko_' + mu.id];
    if (!r || r[0] === r[1]) return;
    const t1 = resolveTeam(mu.t1.src, res, winners, losers, assign);
    const t2 = resolveTeam(mu.t2.src, res, winners, losers, assign);
    if (t1.q && t2.q) {
      winners[mu.id] = r[0] > r[1] ? t1.name : t2.name;
      losers[mu.id] = r[0] > r[1] ? t2.name : t1.name;
    }
  }));
  return { winners, losers, assign };
}

async function loadState() {
  const [resultRows, matchRows] = await Promise.all([
    sb('results?select=match_key,s1,s2'),
    sb('matches?select=match_key,lock_until')
  ]);
  const res = {};
  resultRows.forEach(r => (res[r.match_key] = [r.s1, r.s2]));
  const lock = {};
  matchRows.forEach(m => (lock[m.match_key] = new Date(m.lock_until)));
  return { res, lock };
}

async function list() {
  const { res, lock } = await loadState();
  const now = new Date();
  const pending = [];
  GROUPS.forEach(g => g.matches.forEach((m, mi) => {
    const key = 'g' + g.id + '_' + mi;
    if (!res[key] && lock[key] && now >= lock[key])
      pending.push({ key, match: `${m.t1} - ${m.t2}`, date: m.d + ' ' + m.h, phase: 'Groupe ' + g.id });
  }));
  const { winners, losers, assign } = koResults(res);
  KO_MATCHES.forEach(round => round.matchups.forEach(mu => {
    const key = 'ko_' + mu.id;
    if (res[key] || !lock[key] || now < lock[key]) return;
    const t1 = resolveTeam(mu.t1.src, res, winners, losers, assign);
    const t2 = resolveTeam(mu.t2.src, res, winners, losers, assign);
    if (t1.q && t2.q) pending.push({ key, match: `${t1.name} - ${t2.name}`, date: mu.d + ' ' + mu.h, phase: round.r });
  }));
  console.log(JSON.stringify({ maintenant_utc: now.toISOString(), matchs_en_attente: pending }, null, 2));
}

async function push(key, s1, s2) {
  const code = process.env.ADMIN_CODE;
  if (!code) { console.error('ERREUR : variable ADMIN_CODE manquante'); process.exit(1); }
  if (!/^\d{1,2}$/.test(s1) || !/^\d{1,2}$/.test(s2)) { console.error('ERREUR : scores invalides'); process.exit(1); }
  await sb('results?on_conflict=match_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ match_key: key, s1: parseInt(s1), s2: parseInt(s2), code })
  });
  console.log(`OK : ${key} → ${s1}-${s2}`);
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'list') await list();
else if (cmd === 'push' && args.length === 3) await push(...args);
else { console.error('Usage : update-results.mjs list | push KEY S1 S2'); process.exit(1); }
