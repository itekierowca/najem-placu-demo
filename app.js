/* Demo: najem placu i aut WORD – dane przykładowe, bez backendu. */
(function () {
  'use strict';

  var VIEWS = [['panel', 'Panel WORD'], ['strona', 'Strona WORD'], ['aplikacja', 'Aplikacja instruktora']];
  function initialView() {
    var h = (location.hash || '').slice(1);
    return VIEWS.some(function (v) { return v[0] === h; }) ? h : 'panel';
  }

  var S = {
    view: initialView(),
    p: { view: 'rozl', tx: 'all', umStart: 'zgl', umWir: 'pod', obc: 'new', instr: 'new' },
    w: { step: 'svc', prod: 'clioPlac', day: '19', sel: [], logged: false, veh: 0, cReg: false, cCard: false, pay: 'card', cRegR: false },
    a: { scr: 'home', gate: false, ph: [false, false, false, false, false], k: [false, false, false], fuel: 'card', ended: false }
  };

  var A = {}; // akcje: nazwa -> function(arg)
  var root = document.getElementById('root');

  function zl(n) { return n.toFixed(2).replace('.', ',') + ' zł'; }
  function fmt(n) { return n.toLocaleString('pl-PL'); }
  function act(name, arg) { return ' data-act="' + name + '"' + (arg !== undefined ? ' data-arg="' + arg + '"' : ''); }
  function chip(cls, txt) { return '<span class="chip ' + cls + '">' + txt + '</span>'; }
  function ck(b) { return b ? ' checked' : ''; }
  function dis(b) { return b ? ' disabled' : ''; }

  /* ---------------- przełącznik widoków ---------------- */
  A.goView = function (v) { S.view = v; history.replaceState(null, '', '#' + v); window.scrollTo(0, 0); };
  function demoBar() {
    return '<div class="demo-bar"><div class="brand"><b>Demo · najem placu i aut WORD</b> · dane przykładowe · scenariusz: WORD Gorzów Wlkp., 19.11.2026</div>' +
      '<div class="demo-tabs" role="tablist">' + VIEWS.map(function (v) {
        return '<button type="button" role="tab" aria-selected="' + (S.view === v[0]) + '" class="demo-tab' + (S.view === v[0] ? ' on' : '') + '"' + act('goView', v[0]) + '>' + v[1] + '</button>';
      }).join('') + '</div></div>';
  }

  /* ======================= PANEL WORD ======================= */
  var NAV = [['plan', 'Plan dnia'], ['rez', 'Rezerwacje'], ['umowy', 'Umowy najmu aut'], ['obc', 'Obciążenia dodatkowe'], ['rozl', 'Rozliczenia'], ['zasoby', 'Zasoby i cennik'], ['instr', 'Instruktorzy i OSK'], ['ust', 'Ustawienia najmu']];
  var TITLES = { plan: 'Plan dnia', rez: 'Rezerwacje', umowy: 'Umowy najmu aut WORD', obc: 'Obciążenia dodatkowe', rozl: 'Rozliczenia', zasoby: 'Zasoby i cennik', instr: 'Instruktorzy i OSK', ust: 'Ustawienia najmu', kursy: 'Kursy' };
  A.pNav = function (v) { S.p.view = v; window.scrollTo(0, 0); };
  A.pTx = function (v) { S.p.tx = v; };
  A.pUmStart = function () { S.p.umStart = 'akt'; };
  A.pUmWir = function () { S.p.umWir = 'wys'; };
  A.pObc = function (v) { S.p.obc = v; };
  A.pInstr = function (v) { S.p.instr = v; };

  function panel() {
    var p = S.p;
    var badges = { umowy: (p.umStart === 'zgl' || p.umWir === 'pod') ? (p.umStart === 'zgl' && p.umWir === 'pod' ? '2' : '1') : '', obc: p.obc === 'new' ? '1' : '', instr: p.instr === 'new' ? '1' : '' };
    var nb = function (id, label) {
      return '<button type="button" class="navbtn' + (p.view === id ? ' on' : '') + '"' + act('pNav', id) + (p.view === id ? ' aria-current="page"' : '') + '>' + label + (badges[id] ? '<span class="badge">' + badges[id] + '</span>' : '') + '</button>';
    };
    var side = '<nav class="side" aria-label="Menu panelu"><div class="logo">PANEL<b>WORD</b></div>' +
      '<div class="sec">Kursy</div>' + nb('kursy', 'Lista kursów') + '<button type="button" class="navbtn"' + act('pNav', 'kursy') + '>Wszyscy kursanci</button><button type="button" class="navbtn"' + act('pNav', 'kursy') + '>Kalendarz na www</button>' +
      '<div class="sec">Najem placu i aut</div>' + NAV.map(function (n) { return nb(n[0], n[1]); }).join('') +
      '<div class="sec">Administracja</div><button type="button" class="navbtn"' + act('pNav', 'kursy') + '>Użytkownicy</button></nav>';
    var views = { rozl: pRozl, plan: pPlan, rez: pRez, umowy: pUmowy, obc: pObc, zasoby: pZasoby, instr: pInstr, ust: pUst, kursy: pKursy };
    return '<div class="v-panel">' + side + '<main><header class="top"><div><h1>' + TITLES[p.view] + '</h1><div class="muted" style="font-size:12px">WORD Gorzów Wlkp. · oddział: Gorzów Wlkp. · dane przykładowe</div></div>' +
      '<div style="display:flex;gap:10px;align-items:center;font-size:13px">' + chip('warn', 'Pilot od 1.11.2026') + '<span class="muted">admin@word-gorzow.example</span></div></header>' +
      '<div class="body">' + views[p.view]() + '</div></main></div>';
  }

  var DAYS = [[1, 'Nd', 1640, 'w'], [2, 'Pn', 980, ''], [3, 'Wt', 1120, ''], [4, 'Śr', 1050, ''], [5, 'Cz', 1210, ''], [6, 'Pt', 1340, ''], [7, 'So', 1500, 'w'], [8, 'Nd', 1560, 'w'], [9, 'Pn', 1010, ''], [10, 'Wt', 1090, ''], [11, 'Śr', 1420, 'w'], [12, 'Cz', 860, 'r'], [13, 'Pt', 1150, ''], [14, 'So', 1640, 'w'], [15, 'Nd', 1470, 'w'], [16, 'Pn', 1035, ''], [17, 'Wt', 665, '']];

  function txList() {
    var o = S.p.obc;
    return [
      { k: 'rez', date: '17.11 12:41', no: 'R-2611-0147', type: 'Rezerwacja', who: 'Marek Zieliński · OSK Prym', desc: 'Clio (AT) + stanowisko B2 · 2 sloty, 19.11 15:00–16:00', amt: '220,00', fee: '11,00', doc: 'FV 147/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'obc', date: '17.11 11:58', no: 'O-2611-0014', type: 'Obciążenie', who: 'Anna Wróbel · OSK Start', desc: 'Paliwo: brak 4 l × 10 zł (R-2611-0139)', amt: '40,00', fee: '2,00', doc: 'FV 161/11/2026', st: chip('ok', 'Pobrane z karty') },
      { k: 'rez', date: '17.11 10:22', no: 'R-2611-0146', type: 'Rezerwacja', who: 'Tomasz Lis · OSK Wiraż', desc: 'Plac kat. B – pojazd OSK · 2 sloty', amt: '90,00', fee: '4,50', doc: 'FV 146/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'rez', date: '17.11 09:15', no: 'R-2611-0145', type: 'Rezerwacja', who: 'Katarzyna Mazur · OSK Lider', desc: 'Najem Renault Clio (AT) · 2 sloty', amt: '180,00', fee: '9,00', doc: 'FV 145/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'rez', date: '17.11 08:03', no: 'R-2611-0144', type: 'Rezerwacja', who: 'Piotr Kaczmarek · OSK Prym', desc: 'Plac kat. B – pojazd OSK · 3 sloty', amt: '135,00', fee: '6,75', doc: 'FV 144/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'obc', date: '16.11 18:47', no: 'O-2611-0013', type: 'Obciążenie', who: 'Tomasz Lis · OSK Wiraż', desc: 'Paliwo: brak 6 l × 10 zł (R-2611-0128)', amt: '60,00', fee: '3,00', doc: 'FV 160/11/2026', st: chip('ok', 'Pobrane z karty') },
      { k: 'obc', date: '18.11 17:31', no: 'O-2611-0015', type: 'Obciążenie', who: 'Katarzyna Mazur · OSK Lider', desc: 'Paliwo: brak 3 l × 10 zł (R-2611-0141)', amt: '30,00', fee: o === 'ok' ? '1,50' : '—', doc: o === 'ok' ? 'FV 162/11/2026' : '—', st: o === 'ok' ? chip('ok', 'Pobrane z karty') : o === 'no' ? chip('grey', 'Anulowane') : chip('warn', 'Do zatwierdzenia (poza sumą)') },
      { k: 'zw', date: '12.11 07:30', no: 'Z-2611-0009', type: 'Zwrot', who: 'Anna Wróbel · OSK Start', desc: 'Odwołanie przez WORD – śnieg, plac zamknięty (R-2611-0102)', amt: '−90,00', fee: '−4,50', doc: 'FK 9/11/2026', st: chip('info', 'Zwrócono') },
      { k: 'zw', date: '12.11 07:30', no: 'Z-2611-0008', type: 'Zwrot', who: 'Marek Zieliński · OSK Prym', desc: 'Odwołanie przez WORD – śnieg, plac zamknięty (R-2611-0098)', amt: '−135,00', fee: '−6,75', doc: 'FK 8/11/2026', st: chip('info', 'Zwrócono') }
    ];
  }

  function kpi(lbl, val, note, extra) {
    return '<div class="card"' + (extra || '') + '><div class="lbl">' + lbl + '</div><div class="kpi">' + val + '</div><div class="muted" style="font-size:13px">' + note + '</div></div>';
  }
  function share(w, color, pct) {
    return '<div style="display:flex;align-items:center;gap:6px"><div style="width:' + w + 'px;height:8px;background:' + color + ';border-radius:4px"></div><span class="muted">' + pct + '</span></div>';
  }

  function pRozl() {
    var p = S.p;
    var bars = DAYS.map(function (d) {
      var h = Math.round(d[2] / 1640 * 140);
      var col = d[3] === 'w' ? '#f5c400' : d[3] === 'r' ? '#e08585' : '#2b3370';
      return '<div class="bar" title="' + d[0] + '.11: ' + fmt(d[2]) + ' zł brutto' + (d[3] === 'r' ? ' · zwroty 810 zł' : '') + '"><span>' + (d[2] / 1000).toFixed(1).replace('.', ',') + '</span><i style="height:' + h + 'px;background:' + col + '"></i></div>';
    }).join('');
    var labs = DAYS.map(function (d) { return '<div>' + d[0] + ' ' + d[1] + '</div>'; }).join('');
    var all = txList();
    var txs = p.tx === 'all' ? all : all.filter(function (t) { return t.k === p.tx; });
    var chips = [['all', 'Wszystkie'], ['rez', 'Rezerwacje'], ['obc', 'Obciążenia'], ['zw', 'Zwroty']].map(function (c) {
      return '<button type="button" class="fbtn' + (p.tx === c[0] ? ' on' : '') + '" aria-pressed="' + (p.tx === c[0]) + '"' + act('pTx', c[0]) + '>' + c[1] + '</button>';
    }).join('');
    var rows = txs.map(function (t) {
      return '<tr><td class="td" style="white-space:nowrap">' + t.date + '</td><td class="td" style="white-space:nowrap">' + t.no + '</td><td class="td">' + t.type + '</td><td class="td">' + t.who + '</td><td class="td">' + t.desc + '</td><td class="td num">' + t.amt + '</td><td class="td num">' + t.fee + '</td><td class="td" style="white-space:nowrap">' + t.doc + '</td><td class="td">' + t.st + '</td></tr>';
    }).join('');
    return '' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><button class="fbtn on" type="button">Listopad 2026 · w toku</button><button class="fbtn" type="button" disabled>Październik 2026 · przed pilotem</button><span class="muted" style="font-size:13px">stan na 17.11.2026, 13:00</span></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="button">Eksport CSV</button><button class="btn" type="button">Zestawienie PDF</button><button class="btn yel" type="button">Wyślij zestawienie do księgowości</button></div></div>' +
      '<div class="g3">' +
      kpi('Sprzedaż najmu', '19 480,00 zł', '147 rezerwacji · 314 slotów po 30 min') +
      kpi('Obciążenia dodatkowe', '1 260,00 zł', '14 × paliwo (126 l × 10 zł) · 1 do zatwierdzenia') +
      kpi('Zwroty', '<span style="color:#9b1c1c">−810,00 zł</span>', '9 rezerwacji · 12.11 plac zamknięty (śnieg)') +
      kpi('Podstawa prowizji', '19 930,00 zł', 'opłacone transakcje − zwroty') +
      kpi('Prowizja platformy · 5%', '996,50 zł', 'faktura prowizyjna dla WORD 1.12.2026') +
      kpi('Do wypłaty dla WORD', '18 933,50 zł', 'przed opłatami operatora płatności', ' style="border-color:#f5c400;background:#fffbea"') +
      '</div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:baseline"><h2 style="margin:0">Sprzedaż dzienna brutto · 1–17.11.2026</h2>' +
      '<div class="muted" style="font-size:12px;display:flex;gap:14px;flex-wrap:wrap"><span><i style="display:inline-block;width:10px;height:10px;background:#2b3370;border-radius:2px"></i> dni robocze</span><span><i style="display:inline-block;width:10px;height:10px;background:#f5c400;border-radius:2px"></i> weekend i święto</span><span><i style="display:inline-block;width:10px;height:10px;background:#e08585;border-radius:2px"></i> dzień ze zwrotami</span></div></div>' +
      '<div class="tbox"><div style="min-width:640px"><div class="bars">' + bars + '</div><div class="barlab">' + labs + '</div></div></div></div>' +
      '<div class="g2"><div class="card"><h2>Według produktu</h2><div class="tbox"><table><thead><tr><th class="th">Produkt</th><th class="th num">Ilość</th><th class="th num">Cena</th><th class="th num">Kwota brutto</th><th class="th">Udział</th></tr></thead><tbody>' +
      '<tr><td class="td">Plac kat. B – pojazd OSK</td><td class="td num">212 slotów</td><td class="td num">45,00</td><td class="td num">9 540,00</td><td class="td">' + share(46, '#2b3370', '46%') + '</td></tr>' +
      '<tr><td class="td">Najem Renault Clio (AT)</td><td class="td num">64 sloty</td><td class="td num">90,00</td><td class="td num">5 760,00</td><td class="td">' + share(28, '#2b3370', '28%') + '</td></tr>' +
      '<tr><td class="td">Clio (AT) + stanowisko B</td><td class="td num">38 slotów</td><td class="td num">110,00</td><td class="td num">4 180,00</td><td class="td">' + share(20, '#2b3370', '20%') + '</td></tr>' +
      '<tr><td class="td">Paliwo – obciążenia kart</td><td class="td num">126 l</td><td class="td num">10,00</td><td class="td num">1 260,00</td><td class="td">' + share(6, '#f5c400', '6%') + '</td></tr>' +
      '<tr><td class="td"><b>Razem przed zwrotami</b></td><td class="td"></td><td class="td"></td><td class="td num"><b>20 740,00</b></td><td class="td"></td></tr></tbody></table></div></div>' +
      '<div class="card"><h2>Według OSK (po zwrotach)</h2><div class="tbox"><table><thead><tr><th class="th">OSK</th><th class="th num">Rezerwacje</th><th class="th num">Kwota</th><th class="th num">Prowizja 5%</th><th class="th num">Faktury</th></tr></thead><tbody>' +
      [['OSK Prym', 52, '6 420,00', '321,00', 57], ['OSK Start', 39, '4 980,00', '249,00', 43], ['OSK Wiraż', 28, '3 870,00', '193,50', 32], ['OSK Lider', 19, '2 760,00', '138,00', 20], ['Pozostałe (4 OSK)', 9, '1 900,00', '95,00', 9]].map(function (r) {
        return '<tr><td class="td">' + r[0] + '</td><td class="td num">' + r[1] + '</td><td class="td num">' + r[2] + '</td><td class="td num">' + r[3] + '</td><td class="td num">' + r[4] + '</td></tr>';
      }).join('') +
      '<tr><td class="td"><b>Razem</b></td><td class="td num"><b>147</b></td><td class="td num"><b>19 930,00</b></td><td class="td num"><b>996,50</b></td><td class="td num"><b>161</b></td></tr></tbody></table></div>' +
      '<p class="muted" style="font-size:12px;margin:10px 0 0">Faktury VAT wystawiane automatycznie na OSK przy każdej płatności; zwroty = faktury korygujące (9).</p></div></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center"><h2 style="margin:0">Transakcje</h2><div role="group" aria-label="Filtr transakcji" style="display:flex;gap:6px;flex-wrap:wrap">' + chips + '</div></div>' +
      '<div class="tbox"><table><thead><tr><th class="th">Data</th><th class="th">Numer</th><th class="th">Typ</th><th class="th">Instruktor · OSK</th><th class="th">Opis</th><th class="th num">Kwota brutto</th><th class="th num">Prowizja</th><th class="th">Dokument</th><th class="th">Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="muted" style="font-size:12px">Pokazano ' + txs.length + ' z 171</div></div>' +
      '<div class="card g2" style="gap:24px"><div><h2>Rozliczenie prowizji · listopad 2026</h2><div class="kv">' +
      '<span class="muted">Okres</span><span>1–30.11.2026 (w toku)</span><span class="muted">Podstawa</span><span>19 930,00 zł</span><span class="muted">Stawka prowizji</span><span>5% od opłaconej transakcji (przykład)</span><span class="muted">Prowizja</span><b>996,50 zł</b><span class="muted">Do wypłaty dla WORD</span><b>18 933,50 zł</b><span class="muted">Dzienne zestawienie</span><span>e-mail 8:00 → ksiegowosc@word-gorzow.example</span></div></div>' +
      '<div><h2>Harmonogram zamknięcia okresu</h2><ol style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:10px;font-size:14px"><li><b>30.11, 23:59</b> – zamknięcie okresu, blokada korekt</li><li><b>1.12</b> – faktura prowizyjna e-Kierowca → WORD (996,50 zł + korekty)</li><li><b>1.12</b> – raport rozbieżności z wyciągiem operatora płatności</li><li><b>15.12</b> – termin płatności faktury prowizyjnej</li></ol></div></div>';
  }

  function pPlan() {
    var F = ['f', 'wolne'];
    var grid = [
      ['B1', [['o', 'T. Lis · Wiraż'], ['o', 'T. Lis · Wiraż'], F, ['o', 'P. Kaczmarek · Prym'], ['o', 'P. Kaczmarek · Prym'], ['o', 'P. Kaczmarek · Prym']]],
      ['B2', [['c', 'M. Zieliński · Clio'], ['c', 'M. Zieliński · Clio'], F, F, ['o', 'A. Wróbel · Start'], F]],
      ['B3', [F, ['o', 'K. Mazur · Lider'], ['o', 'K. Mazur · Lider'], F, F, F]],
      ['A1', [['b', 'wyłączone XI–III'], ['b', 'wyłączone XI–III'], ['b', 'wyłączone XI–III'], ['b', 'wyłączone XI–III'], ['b', 'wyłączone XI–III'], ['b', 'wyłączone XI–III']]],
      ['C1', [F, F, F, F, F, F]],
      ['Clio AT (WORD)', [['c', 'M. Zieliński · plac B2'], ['c', 'M. Zieliński · plac B2'], ['b', 'bufor 15 min'], ['c', 'K. Mazur · miasto'], ['c', 'K. Mazur · miasto'], ['b', 'zwrot do 21:00']]]
    ];
    var hdr = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(function (h) { return '<div style="font-size:12px;font-weight:700;color:#3c4043;padding:4px">' + h + '</div>'; }).join('');
    var body = grid.map(function (r) {
      return '<div style="font-size:13px;font-weight:500;display:flex;align-items:center">' + r[0] + '</div>' + r[1].map(function (c) { return '<div class="cell c-' + c[0] + '">' + c[1] + '</div>'; }).join('');
    }).join('');
    return '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><div style="display:flex;gap:8px;align-items:center"><button class="btn" type="button" aria-label="Poprzedni dzień">‹</button><b style="font-size:16px">czw., 19.11.2026</b><button class="btn" type="button" aria-label="Następny dzień">›</button></div>' +
      '<div class="muted" style="display:flex;gap:12px;font-size:12px;flex-wrap:wrap"><span>' + chip('info', 'OSK') + ' pojazd OSK</span><span>' + chip('warn', 'Clio') + ' auto WORD</span><span>' + chip('grey', 'bufor') + ' bufor / blokada</span><span>egzaminy 7:30–14:30 – plac zablokowany</span></div><button class="btn" type="button">Drukuj listę dnia</button></div>' +
      '<div class="card tbox"><div class="grid"><div></div>' + hdr + body + '</div></div>' +
      '<div class="card"><h2>Przyjazdy · 19.11</h2><div class="tbox"><table><thead><tr><th class="th">Godz.</th><th class="th">Instruktor · OSK</th><th class="th">Zasoby</th><th class="th">Pojazd</th><th class="th">Szlaban / auto</th><th class="th">Obecność</th></tr></thead><tbody>' +
      '<tr><td class="td">15:00</td><td class="td">Tomasz Lis · OSK Wiraż</td><td class="td">B1</td><td class="td">FZ 3302P (OSK)</td><td class="td">wjazd 14:55</td><td class="td">' + chip('ok', 'Stawił się (szlaban)') + '</td></tr>' +
      '<tr><td class="td">15:00</td><td class="td">Marek Zieliński · OSK Prym</td><td class="td">B2 + Clio AT</td><td class="td">Clio AT (WORD)</td><td class="td">wjazd 14:52 · auto otwarte 14:56</td><td class="td">' + chip('ok', 'Stawił się (szlaban)') + '</td></tr>' +
      '<tr><td class="td">15:30</td><td class="td">Katarzyna Mazur · OSK Lider</td><td class="td">B3</td><td class="td">FZ 9184L (OSK)</td><td class="td">—</td><td class="td">' + chip('grey', 'Oczekiwany') + '</td></tr>' +
      '<tr><td class="td">16:30</td><td class="td">Katarzyna Mazur · OSK Lider</td><td class="td">Clio AT (miasto)</td><td class="td">Clio AT (WORD)</td><td class="td">—</td><td class="td">' + chip('grey', 'Oczekiwany') + '</td></tr>' +
      '</tbody></table></div></div>';
  }

  function pRez() {
    var rows = [
      ['R-2611-0147', '19.11 15:00–16:00', 'Clio (AT) + stanowisko B', 'B2, Clio AT', 'Marek Zieliński · Prym', '220,00', chip('ok', 'Opłacona')],
      ['R-2611-0146', '19.11 15:00–16:00', 'Plac kat. B – pojazd OSK', 'B1', 'Tomasz Lis · Wiraż', '90,00', chip('ok', 'Opłacona')],
      ['R-2611-0145', '19.11 16:30–17:30', 'Najem Renault Clio (AT)', 'Clio AT', 'Katarzyna Mazur · Lider', '180,00', chip('ok', 'Opłacona')],
      ['R-2611-0144', '19.11 16:30–18:00', 'Plac kat. B – pojazd OSK', 'B1', 'Piotr Kaczmarek · Prym', '135,00', chip('ok', 'Opłacona')],
      ['R-2611-0139', '16.11 16:00–17:00', 'Najem Renault Clio (AT)', 'Clio AT', 'Anna Wróbel · Start', '180,00', chip('info', 'Zrealizowana')],
      ['R-2611-0131', '14.11 10:00–10:30', 'Plac kat. B – pojazd OSK', 'B3', 'Jan Nowak · Start', '45,00', chip('bad', 'Nie stawił się')],
      ['R-2611-0102', '12.11 15:00–16:00', 'Plac kat. B – pojazd OSK', 'B2', 'Anna Wróbel · Start', '90,00', chip('grey', 'Odwołana przez WORD')]
    ];
    return '<div class="card tbox"><table><thead><tr><th class="th">Numer</th><th class="th">Termin</th><th class="th">Produkt</th><th class="th">Zasoby</th><th class="th">Instruktor · OSK</th><th class="th num">Kwota</th><th class="th">Status</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td class="td' + (i === 5 ? ' num' : '') + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  function pUmowy() {
    var p = S.p;
    var st = p.umStart === 'zgl' ? chip('warn', 'Zgłoszona – do aktywacji') : chip('ok', 'Aktywna');
    var wi = p.umWir === 'pod' ? chip('warn', 'Do podpisu przez WORD') : chip('info', 'Podpisana – OSK zgłasza staroście');
    var car = 'Renault Clio AT · egzaminacyjny';
    return '<p class="muted" style="margin:0;font-size:13px">Jedno auto może mieć umowy z wieloma OSK naraz. Produkty z autem widzą tylko instruktorzy OSK z umową w statusie „Aktywna”.</p>' +
      '<div class="card tbox"><table><thead><tr><th class="th">Pojazd</th><th class="th">OSK</th><th class="th">Okres</th><th class="th">Zgłoszenie do starosty</th><th class="th">Status</th><th class="th">Akcja</th></tr></thead><tbody>' +
      '<tr><td class="td">' + car + '</td><td class="td">OSK Prym</td><td class="td">01.11.2026–31.10.2027</td><td class="td">złożone 03.11.2026 (PDF)</td><td class="td">' + chip('ok', 'Aktywna') + '</td><td class="td"></td></tr>' +
      '<tr><td class="td">' + car + '</td><td class="td">OSK Lider</td><td class="td">01.11.2026–31.10.2027</td><td class="td">złożone 05.11.2026 (PDF)</td><td class="td">' + chip('ok', 'Aktywna') + '</td><td class="td"></td></tr>' +
      '<tr><td class="td">' + car + '</td><td class="td">OSK Start</td><td class="td">15.11.2026–14.11.2027</td><td class="td">złożone 16.11.2026 (PDF)</td><td class="td">' + st + '</td><td class="td">' + (p.umStart === 'zgl' ? '<button class="btn yel" type="button"' + act('pUmStart') + '>Aktywuj</button>' : '') + '</td></tr>' +
      '<tr><td class="td">' + car + '</td><td class="td">OSK Wiraż</td><td class="td">od 01.12.2026</td><td class="td">—</td><td class="td">' + wi + '</td><td class="td">' + (p.umWir === 'pod' ? '<button class="btn yel" type="button"' + act('pUmWir') + '>Podpisz umowę</button>' : '') + '</td></tr>' +
      '</tbody></table></div>';
  }

  function pObc() {
    var o = S.p.obc;
    var st = o === 'new' ? chip('warn', 'Do zatwierdzenia') : o === 'ok' ? chip('ok', 'Pobrane z karty') : chip('grey', 'Anulowane');
    var a = o === 'new' ? '<div class="row-actions"><button class="btn yel" type="button"' + act('pObc', 'ok') + '>Zatwierdź i obciąż</button><button class="btn" type="button"' + act('pObc', 'no') + '>Anuluj</button></div>' : '';
    return '<div class="card tbox"><table><thead><tr><th class="th">Rezerwacja</th><th class="th">Instruktor · OSK</th><th class="th">Typ</th><th class="th">Wyliczenie</th><th class="th">Dowód</th><th class="th num">Kwota</th><th class="th">Status</th><th class="th">Akcja</th></tr></thead><tbody>' +
      '<tr><td class="td">R-2611-0141</td><td class="td">Katarzyna Mazur · Lider</td><td class="td">Paliwo</td><td class="td">start 6/8, zwrot 5/8 → brak 3 l × 10 zł</td><td class="td">telematyka 18.11 17:31</td><td class="td num">30,00</td><td class="td">' + st + '</td><td class="td">' + a + '</td></tr>' +
      '<tr><td class="td">R-2611-0139</td><td class="td">Anna Wróbel · Start</td><td class="td">Paliwo</td><td class="td">brak 4 l × 10 zł</td><td class="td">telematyka 16.11 17:02</td><td class="td num">40,00</td><td class="td">' + chip('ok', 'Pobrane z karty') + '</td><td class="td"></td></tr>' +
      '<tr><td class="td">R-2611-0128</td><td class="td">Tomasz Lis · Wiraż</td><td class="td">Paliwo</td><td class="td">brak 6 l × 10 zł</td><td class="td">zdjęcie deski 16.11 18:44</td><td class="td num">60,00</td><td class="td">' + chip('ok', 'Pobrane z karty') + '</td><td class="td"></td></tr>' +
      '</tbody></table></div>';
  }

  function pZasoby() {
    var prod = function (n, z, c) { return '<div class="card"><div class="lbl">Produkt</div><h3 style="margin:6px 0;font-size:16px">' + n + '</h3><p class="muted" style="font-size:13px;margin:0 0 8px">' + z + '</p><div class="kpi" style="font-size:20px">' + c + '</div></div>'; };
    var res = function (l, t) { return '<div class="card"><div class="lbl">' + l + '</div><p style="font-size:14px;margin:8px 0 0">' + t + '</p></div>'; };
    return '<div class="g3">' + prod('Plac kat. B – pojazd OSK', 'Zasoby: 1 z grupy B1–B3 · pojazd OSK', '45,00 zł / 30 min') +
      prod('Najem Renault Clio (AT)', 'Zasoby: Clio AT · plac i miasto · wymaga umowy najmu', '90,00 zł / 30 min') +
      prod('Clio (AT) + stanowisko B', 'Zasoby: Clio AT + 1 z grupy B1–B3', '110,00 zł / 30 min') +
      res('Zasób · stanowiska', 'B1, B2, B3 (kat. B) · A1 (kat. A, wyłączone XI–III) · C1 (kat. C)') +
      res('Zasób · pojazd', 'Renault Clio AT · egzaminacyjny · zamek bezkluczykowy: połączony · paliwo 3/4 · 48 212 km') +
      res('Szlaban', 'Wjazd na plac · sterownik: połączony · otwarć dziś: 6') + '</div>';
  }

  function pInstr() {
    var i = S.p.instr;
    var st = i === 'new' ? chip('warn', 'Do weryfikacji') : i === 'ok' ? chip('ok', 'Zatwierdzony') : chip('bad', 'Odrzucony');
    var a = i === 'new' ? '<div class="row-actions"><button class="btn yel" type="button"' + act('pInstr', 'ok') + '>Zatwierdź</button><button class="btn" type="button"' + act('pInstr', 'no') + '>Odrzuć</button></div>' : '';
    return '<div class="card"><h2>Wnioski do weryfikacji</h2><div class="tbox"><table><thead><tr><th class="th">Instruktor</th><th class="th">Legitymacja</th><th class="th">Kategorie</th><th class="th">OSK</th><th class="th">Potwierdzenie OSK</th><th class="th">Status</th><th class="th">Akcja</th></tr></thead><tbody>' +
      '<tr><td class="td">Jan Nowicki</td><td class="td">skan (JPG)</td><td class="td">B</td><td class="td">OSK Wiraż</td><td class="td">' + chip('ok', 'potwierdził właściciel') + '</td><td class="td">' + st + '</td><td class="td">' + a + '</td></tr>' +
      '<tr><td class="td">Ewa Sikora</td><td class="td">skan (PDF)</td><td class="td">A, B</td><td class="td">OSK Start</td><td class="td">' + chip('warn', 'czeka na OSK') + '</td><td class="td">' + chip('grey', 'Oczekuje') + '</td><td class="td"></td></tr>' +
      '</tbody></table></div></div>' +
      '<div class="card"><h2>Aktywni instruktorzy · 23</h2><div class="tbox"><table><thead><tr><th class="th">Instruktor</th><th class="th">OSK</th><th class="th">Kategorie</th><th class="th num">Rezerwacje XI</th><th class="th num">Nie stawił się (30 dni)</th><th class="th num">Obciążenia</th></tr></thead><tbody>' +
      '<tr><td class="td">Marek Zieliński</td><td class="td">OSK Prym</td><td class="td">B</td><td class="td num">21</td><td class="td num">0</td><td class="td num">0</td></tr>' +
      '<tr><td class="td">Anna Wróbel</td><td class="td">OSK Start</td><td class="td">B</td><td class="td num">17</td><td class="td num">0</td><td class="td num">1</td></tr>' +
      '<tr><td class="td">Jan Nowak</td><td class="td">OSK Start</td><td class="td">B, C</td><td class="td num">8</td><td class="td num">2</td><td class="td num">0</td></tr>' +
      '</tbody></table></div></div>';
  }

  function pUst() {
    var f = function (l, v, d) { return '<label class="field">' + l + '<input value="' + v + '"' + dis(d) + '></label>'; };
    return '<div class="card g2">' + f('Długość slotu (min)', '30') + f('Rezerwacja naprzód (dni)', '14') + f('Bezpłatna rezygnacja do', 'dzień przed, 15:00') + f('Trzymanie slotu bez płatności (min)', '15') +
      f('Limit slotów na instruktora / tydzień', '12') + f('Stawka za brakujący litr paliwa (zł)', '10,00') + f('Prowizja platformy (%)', '5', true) +
      '<label class="field">Regulamin najmu (wersja)<select><option>1.0 z 01.11.2026</option></select></label></div>';
  }
  function pKursy() {
    return '<div class="card"><p style="margin:0;font-size:14px">Moduł kursów (szkolenia redukujące punkty, kursy reedukacyjne) działa bez zmian. W demo pokazujemy tylko nowy moduł najmu – wybierz pozycję z sekcji „Najem placu i aut”.</p></div>';
  }

  /* ======================= STRONA WORD (widżet) ======================= */
  var P = {
    plac: { name: 'Plac kat. B – pojazd OSK', desc: 'Stanowisko B1–B3 przydzielane automatycznie. Jazda pojazdem Twojego OSK.', price: 45 },
    clio: { name: 'Najem Renault Clio (automat)', desc: 'Auto egzaminacyjne WORD. Plac i miasto. Wymaga umowy najmu Twojego OSK.', price: 90 },
    clioPlac: { name: 'Clio (automat) + stanowisko B', desc: 'Auto egzaminacyjne WORD i gwarantowane stanowisko kat. B.', price: 110 },
    placA: { name: 'Plac kat. A', desc: 'Stanowisko motocyklowe. Nieczynne XI–III.', price: 45 }
  };
  var WDAYS = [['18', 'śr.', '18.11'], ['19', 'czw.', '19.11'], ['20', 'pt.', '20.11'], ['21', 'sob.', '21.11'], ['22', 'niedz.', '22.11'], ['23', 'pon.', '23.11'], ['24', 'wt.', '24.11']];
  var TAKEN = { '18': { plac: [2], clio: [0, 1] }, '19': { plac: [1], clio: [0, 1, 2, 3, 4] }, '20': { plac: [0, 1], clio: [3] }, '21': { plac: [0, 1, 2, 5, 6], clio: [0, 1, 2, 3, 8, 9] }, '23': { plac: [], clio: [4, 5] }, '24': { plac: [3], clio: [] } };
  function wTimes() { return S.w.day === '21' ? ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'] : ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30']; }
  function wCalc() {
    var w = S.w, times = wTimes();
    var sorted = w.sel.slice().sort(function (a, b) { return a - b; });
    var contiguous = sorted.every(function (v, i) { return i === 0 || v === sorted[i - 1] + 1; });
    var end = function (i) { var hm = times[i].split(':').map(Number); var t = hm[0] * 60 + hm[1] + 30; return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
    var range = sorted.length ? (contiguous ? times[sorted[0]] + '–' + end(sorted[sorted.length - 1]) : sorted.map(function (i) { return times[i]; }).join(', ')) : '—';
    var cur = WDAYS.filter(function (d) { return d[0] === w.day; })[0];
    return { sorted: sorted, contiguous: contiguous, range: range, total: zl(P[w.prod].price * sorted.length), dayLabel: cur[1] + ' ' + cur[2] + '.2026', needsOsk: w.prod !== 'plac' };
  }
  A.wStep = function (s) { S.w.step = s; };
  A.wFromTerm = function () { S.w.step = S.w.logged ? 'det' : 'login'; };
  A.wLogin = function () { S.w.logged = true; S.w.step = 'det'; };
  A.wProd = function (id) { S.w.prod = id; S.w.sel = []; };
  A.wDay = function (id) { S.w.day = id; S.w.sel = []; };
  A.wSlot = function (i) { i = Number(i); var s = S.w.sel; S.w.sel = s.indexOf(i) >= 0 ? s.filter(function (x) { return x !== i; }) : s.concat([i]); };
  A.wVeh = function (i) { S.w.veh = Number(i); };
  A.wToggle = function (k) { S.w[k] = !S.w[k]; };
  A.wPay = function (m) { S.w.pay = m; };
  A.wReset = function () { var w = S.w; w.step = 'svc'; w.sel = []; w.cReg = false; w.cCard = false; w.cRegR = false; };

  function strona() {
    var w = S.w, c = wCalc();
    var order = ['svc', 'term', 'login', 'det', 'pay', 'done'];
    var idx = order.indexOf(w.step);
    var bars = idx >= 0 ? '<div class="steps" aria-hidden="true">' + order.map(function (_, i) { return '<i class="' + (i <= idx ? 'on' : '') + '"></i>'; }).join('') + '</div>' : '';
    var body = { svc: wSvc, term: wTerm, login: wLogin, det: wDet, pay: wPay, done: wDone, reg: wReg, regdone: wRegDone }[w.step](c);
    return '<div class="v-strona"><header class="site"><div class="name">WORD Gorzów Wlkp. <small>· strona ośrodka (przykład osadzenia)</small></div>' +
      '<nav aria-label="Menu strony"><a href="#strona">Egzaminy</a><a href="#strona">Szkolenia</a><a href="#strona" class="on">Najem placu i aut</a><a href="#strona">Kontakt</a></nav></header>' +
      '<div class="wrap"><div style="display:flex;flex-direction:column;gap:10px"><h1>Najem placu manewrowego i auta WORD</h1><p class="lead">Usługa dla zweryfikowanych instruktorów nauki jazdy. Plac: pn–pt 15:00–18:00, soboty bez egzaminów 9:00–15:00. Renault Clio (automat) – auto egzaminacyjne, jazda po placu i po mieście dla OSK z umową najmu.</p></div>' +
      '<div class="frame"><div role="tablist" aria-label="Oddział"><button role="tab" aria-selected="true" type="button" class="otab">Gorzów Wlkp.</button></div>' +
      '<div class="widget">' + bars + body + '<div style="font-size:12px;color:#4a4a4a">Stworzone przez <a href="https://prawko.pl" target="_blank" rel="noopener">Prawko.pl</a></div></div></div></div></div>';
  }
  function wSvc() {
    var w = S.w;
    var cards = ['plac', 'clio', 'clioPlac', 'placA'].map(function (id) {
      var pr = P[id];
      if (id === 'placA') return '<button type="button" class="prod" disabled><strong>' + pr.name + '</strong><span class="d">' + pr.desc + '</span><span class="lock">Poza Twoimi uprawnieniami (kat. B)</span></button>';
      return '<button type="button" class="prod' + (w.prod === id ? ' on' : '') + '" aria-pressed="' + (w.prod === id) + '"' + act('wProd', id) + '><strong>' + pr.name + '</strong><span class="d">' + pr.desc + '</span><span class="p">' + zl(pr.price) + ' / 30 min</span></button>';
    }).join('');
    return '<h2>Wybierz usługę</h2><div class="prods">' + cards + '</div><div class="act"><button class="pill" type="button"' + act('wStep', 'term') + '>Dalej</button><span style="font-size:14px;color:#4a4a4a">Nie masz konta? <a href="#strona"' + act('wStep', 'reg') + '>Załóż konto instruktora</a></span></div>';
  }
  function summary(c, extraRows) {
    var w = S.w;
    return '<div class="sum"><div class="t">' + P[w.prod].name + '</div>' + extraRows + '</div>';
  }
  function wTerm(c) {
    var w = S.w, times = wTimes();
    var T = TAKEN[w.day] || { plac: [], clio: [] };
    var taken = w.prod === 'plac' ? T.plac : w.prod === 'clio' ? T.clio : T.plac.concat(T.clio);
    var days = WDAYS.map(function (d) {
      if (d[0] === '22') return '<button type="button" class="day" disabled><span style="font-size:12px">' + d[1] + '</span><b>' + d[2] + '</b></button>';
      return '<button type="button" class="day' + (w.day === d[0] ? ' on' : '') + '" aria-pressed="' + (w.day === d[0]) + '"' + act('wDay', d[0]) + '><span style="font-size:12px">' + d[1] + '</span><b>' + d[2] + '</b></button>';
    }).join('');
    var slots = times.map(function (t, i) {
      if (taken.indexOf(i) >= 0) return '<button type="button" class="slot" disabled>' + t + '</button>';
      var on = w.sel.indexOf(i) >= 0;
      return '<button type="button" class="slot' + (on ? ' on' : '') + '" aria-pressed="' + on + '"' + act('wSlot', i) + '>' + t + '</button>';
    }).join('');
    var ok = c.sorted.length > 0 && c.contiguous;
    return '<h2>Wybierz termin</h2><div class="cols"><div class="main"><div class="days" role="group" aria-label="Dzień">' + days + '</div>' +
      '<div style="font-size:15px;font-weight:500">Wolne sloty po 30 min · ' + c.dayLabel + '</div><div class="slots">' + slots + '</div>' +
      '<div class="note">Zaznacz jeden lub kilka kolejnych slotów. Stanowisko przydzielamy automatycznie.</div></div>' +
      summary(c, '<div class="row"><span>Dzień</span><span>' + c.dayLabel + '</span></div><div class="row"><span>Godziny</span><span>' + c.range + '</span></div><div class="row"><span>Liczba slotów</span><span>' + c.sorted.length + '</span></div><div class="row"><span>Cena za slot</span><span>' + zl(P[w.prod].price) + '</span></div><div class="row" style="font-weight:700"><span>Razem</span><span>' + c.total + '</span></div>' +
        (c.sorted.length > 1 && !c.contiguous ? '<p style="font-size:13px;color:#9b1c1c;margin:10px 0 0">Wybierz sloty następujące po sobie.</p>' : '')) +
      '</div><div class="act"><button class="ghost" type="button"' + act('wStep', 'svc') + '>Wstecz</button><button class="pill" type="button"' + dis(!ok) + act('wFromTerm') + '>Dalej</button></div>';
  }
  function wLogin() {
    return '<div style="display:flex;flex-direction:column;gap:20px;max-width:520px"><h2>Zaloguj się</h2><p style="margin:0;font-size:14px;color:#4a4a4a">Rezerwować mogą tylko instruktorzy zweryfikowani przez WORD.</p>' +
      '<label class="field">E-mail<input type="email" value="m.zielinski@osk-prym.example"></label><label class="field">Hasło<input type="password" value="haslo-przyklad"></label>' +
      '<div class="act"><button class="ghost" type="button"' + act('wStep', 'term') + '>Wstecz</button><button class="pill" type="button"' + act('wLogin') + '>Zaloguj</button><a href="#strona" style="font-size:14px"' + act('wStep', 'reg') + '>Załóż konto instruktora</a></div></div>';
  }
  function wDet(c) {
    var w = S.w;
    var osk = c.needsOsk ? '<fieldset><legend>OSK, który najmuje auto</legend><label class="radio"><input type="radio" name="osk" checked> OSK Prym – umowa najmu Clio aktywna do 31.10.2027</label><label class="radio off"><input type="radio" name="osk" disabled> OSK Wiraż – brak aktywnej umowy</label></fieldset>' : '';
    var veh = !c.needsOsk ? '<fieldset><legend>Pojazd OSK</legend>' + ['FZ 4521K · Toyota Yaris (OSK Prym)', 'FZ 7710M · Kia Rio (OSK Prym)'].map(function (l, i) {
      return '<label class="radio"><input type="radio" name="veh"' + ck(w.veh === i) + act('wVeh', i) + '> ' + l + '</label>';
    }).join('') + '</fieldset>' : '';
    var card = c.needsOsk ? '<label class="check"><input type="checkbox"' + ck(w.cCard) + act('wToggle', 'cCard') + '><span>Zgadzam się na obciążenie zapisanej karty za brakujące paliwo (10,00 zł/l) i szkody zgodnie z regulaminem.</span></label>' : '';
    var ok = w.cReg && (!c.needsOsk || w.cCard);
    return '<div class="cols"><div class="main"><h2>Szczegóły i zgody</h2><div style="font-size:14px">Zalogowany: <b>Marek Zieliński</b> · instruktor kat. B · legitymacja zweryfikowana</div>' + osk + veh +
      '<label class="check"><input type="checkbox"' + ck(w.cReg) + act('wToggle', 'cReg') + '><span>Akceptuję regulamin najmu placu i pojazdów WORD (wersja 1.0 z 01.11.2026) i oświadczam, że jazdy prowadzę osobiście jako instruktor.</span></label>' + card +
      '<div class="note">Faktura na: OSK Prym, NIP 599-000-00-01 (przykład), ul. Przykładowa 1, Gorzów Wlkp.</div></div>' +
      summary(c, '<div class="row"><span>Termin</span><span>' + c.dayLabel + ', ' + c.range + '</span></div><div class="row" style="font-weight:700"><span>Do zapłaty</span><span>' + c.total + '</span></div>') +
      '</div><div class="act"><button class="ghost" type="button"' + act('wStep', 'term') + '>Wstecz</button><button class="pill" type="button"' + dis(!ok) + act('wStep', 'pay') + '>Dalej</button></div>';
  }
  function wPay(c) {
    var w = S.w;
    var blik = !c.needsOsk ? '<label class="radio"><input type="radio" name="pay"' + ck(w.pay === 'blik') + act('wPay', 'blik') + '> BLIK</label>' : '';
    return '<div style="display:flex;flex-direction:column;gap:20px;max-width:620px"><h2>Płatność</h2><div style="font-size:14px">' + P[w.prod].name + ' · ' + c.dayLabel + ', ' + c.range + ' · <b>' + c.total + '</b></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px">' + blik + '<label class="radio"><input type="radio" name="pay"' + ck(w.pay === 'card' || c.needsOsk) + act('wPay', 'card') + '> Karta płatnicza – zapisz kartę do rozliczeń dodatkowych</label>' +
      (c.needsOsk ? '<p style="margin:0;font-size:13px;color:#4a4a4a">Przy aucie WORD płatność tylko kartą: karta zostaje zapisana u operatora płatności do ewentualnego rozliczenia paliwa.</p>' : '') + '</div>' +
      '<div class="act"><button class="ghost" type="button"' + act('wStep', 'det') + '>Wstecz</button><button class="pill" type="button"' + act('wStep', 'done') + '>Zapłać ' + c.total + '</button></div></div>';
  }
  function wDone(c) {
    var w = S.w;
    return '<div style="display:flex;flex-direction:column;gap:16px;max-width:660px"><h2>Rezerwacja potwierdzona</h2><div style="background:#fff;border-radius:12px;padding:20px">' +
      '<div class="row"><span>Numer</span><b>R-2611-0148</b></div><div class="row"><span>Usługa</span><span>' + P[w.prod].name + '</span></div><div class="row"><span>Termin</span><span>' + c.dayLabel + ', ' + c.range + '</span></div><div class="row"><span>Zapłacono</span><span>' + c.total + '</span></div><div class="row" style="border-bottom:0"><span>Faktura</span><span>na OSK Prym – wysłana e-mailem</span></div></div>' +
      '<p style="margin:0;font-size:14px;color:#4a4a4a">Szlaban otworzysz w aplikacji instruktora od 10 min przed startem' + (c.needsOsk ? ', a auto – od 5 min przed startem; kluczyki są w schowku' : '') + '. Bezpłatna rezygnacja do dnia poprzedniego, godz. 15:00.</p>' +
      '<div class="act"><button class="pill" type="button"' + act('goView', 'aplikacja') + '>Otwórz aplikację instruktora</button><button class="ghost" type="button">Dodaj do kalendarza (.ics)</button><button class="ghost" type="button"' + act('wReset') + '>Nowa rezerwacja</button></div></div>';
  }
  function wReg() {
    var w = S.w;
    var f = function (l, v, t) { return '<label class="field">' + l + '<input' + (t ? ' type="' + t + '"' : '') + ' value="' + v + '"></label>'; };
    return '<div style="display:flex;flex-direction:column;gap:16px;max-width:760px"><h2>Konto instruktora</h2><p style="margin:0;font-size:14px;color:#4a4a4a">Po wysłaniu: potwierdzasz e-mail, Twój OSK potwierdza, że u niego pracujesz, a WORD weryfikuje legitymację.</p>' +
      '<div class="form2">' + f('Imię *', 'Jan') + f('Nazwisko *', 'Nowicki') + f('E-mail *', 'j.nowicki@osk-wiraz.example', 'email') + f('Telefon *', '500 000 000') + f('Nr legitymacji instruktora *', '00000/08 (przykład)') + f('Kategorie uprawnień *', 'B') +
      '<label class="field">OSK, w którym pracujesz *<select><option>OSK Wiraż (NIP 599-000-00-03)</option><option>OSK Prym</option><option>OSK Start</option><option>OSK Lider</option></select></label>' + f('Skan legitymacji *', 'legitymacja.jpg') + '</div>' +
      '<label class="check"><input type="checkbox"' + ck(w.cRegR) + act('wToggle', 'cRegR') + '><span>Akceptuję regulamin najmu (wersja 1.0 z 01.11.2026).</span></label>' +
      '<div class="act"><button class="ghost" type="button"' + act('wStep', 'svc') + '>Wstecz</button><button class="pill" type="button"' + dis(!w.cRegR) + act('wStep', 'regdone') + '>Wyślij wniosek</button></div></div>';
  }
  function wRegDone() {
    return '<div style="display:flex;flex-direction:column;gap:16px;max-width:660px"><h2>Wniosek wysłany</h2><ol style="margin:0;padding-left:20px;font-size:15px;display:flex;flex-direction:column;gap:8px">' +
      '<li>Potwierdź adres e-mail – link wysłaliśmy na j.nowicki@osk-wiraz.example.</li><li>OSK Wiraż potwierdza, że u niego pracujesz (e-mail do właściciela).</li><li>WORD weryfikuje legitymację – zwykle 1–2 dni robocze. Dostaniesz e-mail.</li></ol>' +
      '<div><button class="ghost" type="button"' + act('wReset') + '>Wróć do rezerwacji</button></div></div>';
  }

  /* ======================= APLIKACJA INSTRUKTORA ======================= */
  A.aScr = function (s) { S.a.scr = s; };
  A.aGate = function () { S.a.gate = true; };
  A.aPh = function (i) { i = Number(i); S.a.ph[i] = !S.a.ph[i]; };
  A.aK = function (i) { i = Number(i); S.a.k[i] = !S.a.k[i]; };
  A.aFuel = function (f) { S.a.fuel = f; };
  A.aFinish = function () { S.a.scr = 'done'; S.a.ended = true; };
  A.aRestart = function () { var a = S.a; a.scr = 'home'; a.ph = [false, false, false, false, false]; a.k = [false, false, false]; a.gate = false; a.ended = false; };

  var CAM = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  var PIN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  function aplikacja() {
    var a = S.a;
    var scr = { home: aHome, detail: aDetail, photos: aPhotos, ride: aRide, ret: aReturn, done: aDone, inv: aInv, book: aBook, acc: aAcc }[a.scr]();
    var tabOf = { book: 'book', inv: 'inv', acc: 'acc' }[a.scr] || 'res';
    var tabs = [['res', 'Rezerwacje', 'home'], ['book', 'Zarezerwuj', 'book'], ['inv', 'Faktury', 'inv'], ['acc', 'Konto', 'acc']].map(function (t) {
      return '<button type="button" class="tab' + (tabOf === t[0] ? ' on' : '') + '"' + (tabOf === t[0] ? ' aria-current="page"' : '') + act('aScr', t[2]) + '><i></i>' + t[1] + '</button>';
    }).join('');
    return '<div class="v-app"><div class="phone"><div class="scr" id="appscr">' + scr + '</div><nav class="tabs" aria-label="Nawigacja aplikacji">' + tabs + '</nav></div>' +
      '<div class="aside"><h2>Scenariusz</h2><p>Czwartek 19.11.2026, 14:52. Instruktor Marek Zieliński (OSK Prym) ma rezerwację R-2611-0147: Clio (automat) + stanowisko B2, 15:00–16:00.</p><ol><li>Otwórz rezerwację i szlaban.</li><li>Zrób 5 zdjęć stanu auta i otwórz Clio.</li><li>Zakończ najem, przejdź checklistę zwrotu.</li><li>Wybierz: obciążenie karty za paliwo albo tankowanie.</li></ol><p class="muted">Wszystkie dane są przykładowe.</p></div></div>';
  }
  function aHome() {
    var a = S.a;
    return '<div><div style="font-size:13px;color:#5f6368">czw., 19.11.2026 · 14:52</div><h1 style="font-size:24px;margin-top:2px">Cześć, Marek</h1><div style="font-size:13px;color:#5f6368">OSK Prym · instruktor kat. B</div></div>' +
      '<button type="button" class="hero"' + act('aScr', 'detail') + '><span style="font-size:12px;color:#f5c400;font-weight:700;letter-spacing:.04em">DZIŚ · START ZA 8 MIN</span><span style="font-size:20px;font-weight:700">15:00–16:00</span><span style="font-size:14px">Clio (automat) + stanowisko B2</span><span style="font-size:13px;color:#c3c7e0">WORD Gorzów Wlkp. · R-2611-0147 · ' + (a.ended ? 'zakończona' : a.gate ? 'na placu' : 'opłacona') + '</span></button>' +
      '<h2 style="margin:6px 0 0;font-size:15px">Kolejne rezerwacje</h2>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:2px"><b style="font-size:15px">pt. 20.11 · 16:00–16:30</b><span style="font-size:14px;color:#5f6368">Plac kat. B – pojazd OSK · FZ 4521K</span></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:2px"><b style="font-size:15px">sob. 21.11 · 10:00–11:00</b><span style="font-size:14px;color:#5f6368">Najem Renault Clio (automat) · miasto</span></div>';
  }
  function aDetail() {
    var a = S.a;
    return '<button class="back" type="button"' + act('aScr', 'home') + '>‹ Rezerwacje</button><div><div style="font-size:13px;color:#5f6368">R-2611-0147 · dziś 15:00–16:00</div><h1 style="margin-top:2px">Clio (automat) + stanowisko B2</h1></div>' +
      '<div class="near">' + PIN + '<span>Jesteś przy obiekcie · 40 m od szlabanu</span></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="cap">SZLABAN · WJAZD NA PLAC</div>' +
      (a.gate ? '<div style="font-size:14px;color:#1e6b34">Szlaban otwarty 14:52 · wjazd zapisany, obecność potwierdzona</div>' : '<button class="big yel" type="button"' + act('aGate') + '>Otwórz szlaban</button>') + '</div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="cap">AUTO · RENAULT CLIO (AT)</div><div style="font-size:14px">Miejsce postojowe nr 3 · kluczyki w schowku</div><button class="big navy" type="button"' + act('aScr', 'photos') + '>Otwórz auto</button><div style="font-size:12px;color:#5f6368">Najpierw 5 zdjęć stanu auta. Otwieranie aktywne od 14:55 do 16:00.</div></div>' +
      '<div class="card"><div class="r"><span>Stanowisko</span><span>B2</span></div><div class="r"><span>Zapłacono</span><span>220,00 zł</span></div><div class="r"><span>Faktura</span><span>FV 147/11/2026 · OSK Prym</span></div></div>';
  }
  function aPhotos() {
    var a = S.a;
    var n = a.ph.filter(Boolean).length;
    var tiles = ['Przód', 'Tył', 'Lewy bok', 'Prawy bok', 'Deska rozdzielcza'].map(function (l, i) {
      return '<button type="button" class="tile' + (a.ph[i] ? ' on' : '') + '" aria-pressed="' + a.ph[i] + '"' + act('aPh', i) + '>' + CAM + '<span>' + l + '</span><small>' + (a.ph[i] ? 'zrobione' : 'dotknij, by zrobić') + '</small></button>';
    }).join('');
    return '<button class="back" type="button"' + act('aScr', 'detail') + '>‹ Rezerwacja</button><h1>Stan auta przed jazdą</h1><p style="margin:0;font-size:14px;color:#5f6368">Zrób zdjęcia – chronią Cię przy rozliczeniu szkód.</p>' +
      '<div class="tiles">' + tiles + '</div><div class="card" style="font-size:14px;display:flex;flex-direction:column;gap:4px"><b>Odczyt automatyczny (telematyka)</b><span>Paliwo 6/8 · ok. 33 l</span><span>Przebieg 48 212 km</span></div>' +
      (n === 5 ? '<button class="big navy" type="button"' + act('aScr', 'ride') + '>Otwórz auto</button>' : '<button class="big" type="button" disabled>Otwórz auto · zdjęcia ' + n + '/5</button>');
  }
  function aRide() {
    return '<div class="timer"><span style="font-size:13px;color:#c3c7e0">Do końca najmu</span><b>58:12</b><span style="font-size:13px;color:#f5c400">koniec 16:00 · stanowisko B2</span></div>' +
      '<div class="card" style="font-size:14px;display:flex;flex-direction:column;gap:6px"><span>Auto otwarte 14:56 · kluczyki w schowku</span><span style="color:#5f6368">Jazda po placu (B2) i po mieście. Wróć na miejsce nr 3 przed 16:00.</span></div>' +
      '<button class="big out" type="button">Zgłoś usterkę</button><button class="big out" type="button">Zadzwoń do obsługi WORD</button><button class="big yel" type="button"' + act('aScr', 'ret') + '>Zakończ najem i zamknij auto</button>';
  }
  function aReturn() {
    var a = S.a;
    var items = ['Kluczyki w schowku', 'Auto na miejscu nr 3', 'Nic nie zostało w aucie'].map(function (l, i) {
      return '<label class="chk"><input type="checkbox"' + ck(a.k[i]) + act('aK', i) + '> ' + l + '</label>';
    }).join('');
    var ok = a.k.every(Boolean);
    return '<button class="back" type="button"' + act('aScr', 'ride') + '>‹ Jazda</button><h1>Zwrot auta</h1><div class="card" style="display:flex;flex-direction:column">' + items + '</div>' +
      '<div class="card" style="font-size:14px;display:flex;flex-direction:column;gap:4px"><b>Paliwo przy zwrocie: 5/8 · ok. 27 l</b><span style="color:#9b1c1c">Brakuje ok. 6 l względem odbioru (6/8).</span></div>' +
      '<label class="opt"><input type="radio" name="fuel"' + ck(a.fuel === 'card') + act('aFuel', 'card') + '><span><b>Obciąż kartę: 6 l × 10 zł = 60,00 zł</b><br>Faktura trafi do OSK Prym.</span></label>' +
      '<label class="opt"><input type="radio" name="fuel"' + ck(a.fuel === 'tank') + act('aFuel', 'tank') + '><span><b>Zatankuję teraz</b><br>Auto zostaje otwarte jeszcze 15 min. Stacja: 1,2 km.</span></label>' +
      '<button class="big' + (ok ? ' yel' : '') + '" type="button"' + dis(!ok) + act('aFinish') + '>Zamknij auto</button>';
  }
  function aDone() {
    var card = S.a.fuel === 'card';
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 0"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1e6b34" stroke-width="2" role="img" aria-label="Zakończono"><circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.2 3L17 9"/></svg><h1>Najem zakończony</h1><span style="font-size:14px;color:#5f6368">Auto zamknięte 15:58 · miejsce nr 3</span></div>' +
      '<div class="card"><div class="r"><span>Rezerwacja</span><span>220,00 zł · opłacona</span></div><div class="r"><span>Paliwo</span><span>' + (card ? '60,00 zł · obciążenie karty' : 'zatankowano · 0,00 zł') + '</span></div><div class="r"><span>Faktury</span><span>OSK Prym</span></div></div>' +
      '<p style="margin:0;font-size:13px;color:#5f6368">' + (card ? 'Obciążenie karty Visa •••• 4417 po zatwierdzeniu przez WORD. Faktura na OSK Prym.' : 'Poziom paliwa po tankowaniu sprawdzi telematyka przy zamknięciu auta.') + '</p>' +
      '<button class="big navy" type="button"' + act('aRestart') + '>Wróć do rezerwacji</button>';
  }
  function aInv() {
    return '<h1>Faktury</h1><p style="margin:0;font-size:13px;color:#5f6368">Wystawiane na OSK Prym. Kopia trafia też do biura OSK.</p><div class="card">' +
      [['FV 147/11/2026', 'R-2611-0147 · 17.11', '220,00 zł'], ['FV 121/11/2026', 'R-2611-0121 · 13.11', '90,00 zł'], ['FK 8/11/2026', 'zwrot · śnieg 12.11', '<span style="color:#9b1c1c">−135,00 zł</span>'], ['FV 64/11/2026', 'R-2611-0064 · 7.11', '180,00 zł']].map(function (r) {
        return '<div class="r"><span>' + r[0] + '<br><span style="color:#5f6368;font-size:12px">' + r[1] + '</span></span><span>' + r[2] + '</span></div>';
      }).join('') + '</div>';
  }
  function aBook() {
    return '<h1>Zarezerwuj</h1><p style="margin:0;font-size:14px;color:#5f6368">Rezerwacja otwiera widżet WORD z Twoim kontem – bez ponownego logowania.</p><button class="big yel" type="button"' + act('goView', 'strona') + '>Otwórz rezerwację WORD Gorzów</button>';
  }
  function aAcc() {
    return '<h1>Konto</h1><div class="card">' + [['Instruktor', 'Marek Zieliński'], ['Uprawnienia', 'kat. B · zweryfikowane'], ['OSK', 'OSK Prym'], ['Umowa najmu Clio', 'aktywna do 31.10.2027'], ['Karta do rozliczeń', 'Visa •••• 4417'], ['Aktywne urządzenie', 'ten telefon']].map(function (r) {
      return '<div class="r"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>';
    }).join('') + '</div><div class="card" style="font-size:13px;color:#5f6368">Nie stawił się w ostatnich 30 dniach: 0 z 3 dopuszczalnych.</div>';
  }

  /* ---------------- render i zdarzenia ---------------- */
  function render() {
    var keepAppScroll = S.view === 'aplikacja' && document.getElementById('appscr') ? document.getElementById('appscr').scrollTop : 0;
    var v = { panel: panel, strona: strona, aplikacja: aplikacja }[S.view]();
    root.innerHTML = demoBar() + v;
    var sc = document.getElementById('appscr');
    if (sc && keepAppScroll) sc.scrollTop = keepAppScroll;
  }
  var lastScr = null;
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    if (el.tagName === 'A') e.preventDefault();
    var fn = A[el.dataset.act];
    if (!fn) return;
    var beforeScr = S.a.scr + S.w.step + S.p.view;
    fn(el.dataset.arg);
    render();
    var afterScr = S.a.scr + S.w.step + S.p.view;
    if (beforeScr !== afterScr) { var sc = document.getElementById('appscr'); if (sc) sc.scrollTop = 0; }
    lastScr = afterScr;
  });
  window.addEventListener('hashchange', function () { var v = initialView(); if (v !== S.view) { S.view = v; render(); } });
  render();
})();
