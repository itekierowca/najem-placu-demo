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
    w: { step: 'svc', prod: 'clioPlac', car: 'clio', dur: 1, day: '19', sel: [], logged: false, veh: 0, cReg: false, cCard: false, pay: 'card', cRegR: false },
    a: { scr: 'home', gate: false, mark: false, ph: [false, false, false, false, false], k: [false, false, false, false], fuel: 'card', ended: false }
  };


  // Rejestr OSK pod nadzorem UM w Gorzowie Wlkp. – źródło: https://jedna-miara.netlify.app
  // [nazwa, nr rejestrowy, zdawalność praktyki B za 1. podejściem, zdani/przystępujący]
  var OSK_GW = [
    ['SUPER OSK MIKRUS Piotr Kawalec', '01020861', '48%', '164/344'],
    ['Szkoła Kierowców POLONEZ Winiarska-Doktór Anna', '00700861', '30%', '125/413'],
    ['EVOLUTION Mirosław Chudy', '00840861', '42%', '139/334'],
    ['Centrum Szkoleniowe ATA Dariusz Klisowski', '00250861', '34%', '45/134'],
    ['Szkoła Nauki Jazdy KIEROWCA Janusz Badura', '00210861', '25%', '51/208'],
    ['Wojewódzki Zakład Doskonalenia Zawodowego w Gorzowie Wlkp.', '00180861', '22%', '36/162'],
    ['Ośrodek Szkolenia Kierowców "PRAWKO" Damian Skrodziuk', '00920861', '42%', '52/124'],
    ['Szkoła Nauki Jazdy BOSS Katarzyna Jarmołowicz', '01050861', '46%', '54/118'],
    ['Błażejczyk Zbigniew', '00190861', '48%', '38/79'],
    ['Ośrodek Szkolenia Kierowców Trucker Kamil Prokuda', '00970861', '36%', '27/75'],
    ['OŚRODEK SZKOLENIA KIEROWCÓW - DANA', '01080861', '42%', '24/57'],
    ['Ośrodek Szkolenia Kierowców Genesis Iwona Łotysz', '01030861', '46%', '26/57'],
    ['Szkoła Nauki Jazdy Sukces Eugeniusz Malinowski', '00500861', '28%', '14/51'],
    ['Akademia Nauki Jazdy MSP Monika Sekita-Pilch', '00570861', '39%', '18/46'],
    ['Ośrodek Szkolenia Kierowców SZOFER Marcin Popiak', '00390861', '28%', '11/40'],
    ['SZKOŁA NAUKI JAZDY FAMILY MIROSŁAWA NOWACZYŃSKA', '01040861', '72%', '28/39'],
    ['MOBIL WITCZYK OSK KRZYSZTOF WITCZYK', '01060861', '32%', '11/34'],
    ['Szkoła Nauki Jazdy GALAXY Arkadiusz Teleśnicki', '00880861', '66%', '21/32'],
    ['Drivetest Arkadiusz Sałata', '01070861', '58%', '18/31'],
    ['Ośrodek Szkolenia Kierowców "Mikrus" Andrzej Kawalec', '00160861', '20%', '4/19'],
    ['Liga Obrony Kraju Ośrodek Szkolenia Zawodowego Kierowców w Gorzowie Wl', '00030861', '31%', '6/19'],
    ['Firma Re-Wa Reszkowski Walenty', '00130861', '64%', '12/19'],
    ['Ośrodek Szkolenia Kierowców "KADET" Leszek Czereda', '01010861', '—', '0/2'],
    ['Ośrodek Szkolenia Kierowców Jacek Pomorski', '00020861', '—', '—']
  ];
  // Flota WORD – 5 aut z automatyczną skrzynią (2 elektryki). Stan, przebiegi i numery rejestracyjne fikcyjne.
  var CARS = [
    { id: 'clio', name: 'Renault Clio E-Tech', drive: 'Hybryda', ev: false, egz: true, reg: 'FZ 0RD01', state: 'paliwo 6/8', odo: '48 212 km', note: 'auto egzaminacyjne' },
    { id: 'yaris', name: 'Toyota Yaris Hybrid', drive: 'Hybryda', ev: false, egz: false, reg: 'FZ 0RD02', state: 'paliwo 7/8', odo: '21 940 km', note: '' },
    { id: 'dolphin', name: 'BYD Dolphin', drive: 'Elektryk', ev: true, egz: false, reg: 'FZ 0RD03', state: 'bateria 78% · ok. 300 km', odo: '9 815 km', note: '' },
    { id: 'f500e', name: 'Fiat 500e', drive: 'Elektryk', ev: true, egz: false, reg: 'FZ 0RD04', state: 'bateria 64% · ok. 160 km', odo: '12 402 km', note: 'ładuje się (AC)' },
    { id: 'fabia', name: 'Škoda Fabia 1.0 TSI DSG', drive: 'Benzyna', ev: false, egz: false, reg: 'FZ 0RD05', state: 'paliwo 5/8', odo: '9 870 km', note: 'najtańsza w eksploatacji' }
  ];
  function carById(id) { return CARS.filter(function (c) { return c.id === id; })[0]; }
  var UMOWY = { '01020861': 'Aktywna', '00250861': 'Aktywna', '00700861': 'Zgłoszona', '00840861': 'Do podpisu' };

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
    return '<div class="demo-bar"><div class="brand"><b>Demo · najem placu i aut WORD</b> · OSK z rejestru UM Gorzów Wlkp.; rezerwacje, osoby i kwoty fikcyjne</div>' +
      '<div class="demo-tabs" role="tablist">' + VIEWS.map(function (v) {
        return '<button type="button" role="tab" aria-selected="' + (S.view === v[0]) + '" class="demo-tab' + (S.view === v[0] ? ' on' : '') + '"' + act('goView', v[0]) + '>' + v[1] + '</button>';
      }).join('') + '</div></div>';
  }

  /* ======================= PANEL WORD ======================= */
  var NAV = [['plan', 'Plan dnia'], ['rez', 'Rezerwacje'], ['umowy', 'Umowy najmu aut'], ['obc', 'Rozliczenia (paliwo itp.)'], ['rozl', 'Rozliczenia'], ['zasoby', 'Zasoby i cennik'], ['instr', 'Instruktorzy i OSK'], ['ust', 'Ustawienia najmu']];
  var TITLES = { plan: 'Plan dnia', rez: 'Rezerwacje', umowy: 'Umowy najmu aut WORD', obc: 'Rozliczenia (paliwo itp.)', rozl: 'Rozliczenia', zasoby: 'Zasoby i cennik', instr: 'Instruktorzy i OSK', ust: 'Ustawienia najmu', kursy: 'Kursy' };
  A.pNav = function (v) { S.p.view = v; S.p.menu = false; window.scrollTo(0, 0); };
  A.pMenu = function () { S.p.menu = !S.p.menu; };
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
    var side = (p.menu ? '<button type="button" class="scrim" aria-label="Zamknij menu"' + act('pMenu') + '></button>' : '') +
      '<nav class="side' + (p.menu ? ' open' : '') + '" id="panel-menu" aria-label="Menu panelu"><div class="logo">PANEL<b>WORD</b></div>' +
      '<div class="sec">Kursy</div>' + nb('kursy', 'Lista kursów') + '<button type="button" class="navbtn"' + act('pNav', 'kursy') + '>Wszyscy kursanci</button><button type="button" class="navbtn"' + act('pNav', 'kursy') + '>Kalendarz na www</button>' +
      '<div class="sec">Najem placu i aut</div>' + NAV.map(function (n) { return nb(n[0], n[1]); }).join('') +
      '<div class="sec">Administracja</div><button type="button" class="navbtn"' + act('pNav', 'kursy') + '>Użytkownicy</button></nav>';
    var views = { rozl: pRozl, plan: pPlan, rez: pRez, umowy: pUmowy, obc: pObc, zasoby: pZasoby, instr: pInstr, ust: pUst, kursy: pKursy };
    return '<div class="v-panel">' + side + '<main><header class="top"><div class="ttl"><button type="button" class="menu-btn" aria-label="Menu" aria-controls="panel-menu" aria-expanded="' + !!p.menu + '"' + act('pMenu') + '><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><div><h1>' + TITLES[p.view] + '</h1><div class="muted" style="font-size:12px">WORD Gorzów Wlkp. · OSK z rejestru, zdarzenia fikcyjne</div></div></div>' +
      '<div class="who" style="display:flex;gap:10px;align-items:center;font-size:13px">' + chip('warn', 'Pilot od 1.11.2026') + '<span class="muted">admin@word-gorzow.example</span></div></header>' +
      '<div class="body">' + views[p.view]() + '</div></main></div>';
  }

  var DAYS = [[2, 'Pn', 2216, ''], [3, 'Wt', 2276, ''], [4, 'Śr', 2226, ''], [5, 'Cz', 2296, ''], [6, 'Pt', 2346, ''], [9, 'Pn', 2236, ''], [10, 'Wt', 2266, ''], [12, 'Cz', 2086, 'r'], [13, 'Pt', 2356, ''], [16, 'Pn', 2226, ''], [17, 'Wt', 2176, '']];

  function txList() {
    var o = S.p.obc;
    return [
      { k: 'dol', date: '17.11 12:39', no: 'D-2611-0312', type: 'Doładowanie', who: 'Marek Zieliński · SUPER OSK MIKRUS', desc: 'Portfel · Apple Pay', amt: '100,00', fee: '—', doc: '—', st: chip('ok', 'Zaksięgowane') },
      { k: 'rez', date: '17.11 12:41', no: 'R-2611-0147', type: 'Rezerwacja', who: 'Marek Zieliński · SUPER OSK MIKRUS', desc: 'Auto WORD (Renault Clio E-Tech) + tor 2 · 2 sloty, 19.11 15:00–16:00', amt: '180,00', fee: '9,00', doc: 'FV 147/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'obc', date: '17.11 11:58', no: 'O-2611-0014', type: 'Paliwo / energia', who: 'Anna Wróbel · POLONEZ', desc: 'Paliwo: brak 4 l × 10 zł · Toyota Yaris (R-2611-0139)', amt: '40,00', fee: '2,00', doc: 'FV 161/11/2026', st: chip('ok', 'Pobrane z portfela') },
      { k: 'rez', date: '17.11 10:22', no: 'R-2611-0146', type: 'Rezerwacja', who: 'Tomasz Lis · EVOLUTION', desc: 'Plac kat. B – pojazd OSK · tor 1 · 2 sloty', amt: '74,00', fee: '3,70', doc: 'FV 146/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'rez', date: '17.11 09:15', no: 'R-2611-0145', type: 'Rezerwacja', who: 'Katarzyna Mazur · ATA', desc: 'Najem auta WORD · BYD Dolphin · 1 h', amt: '55,00', fee: '2,75', doc: 'FV 145/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'dol', date: '17.11 07:58', no: 'D-2611-0311', type: 'Doładowanie', who: 'Piotr Kaczmarek · SUPER OSK MIKRUS', desc: 'Portfel · BLIK', amt: '100,00', fee: '—', doc: '—', st: chip('ok', 'Zaksięgowane') },
      { k: 'rez', date: '17.11 08:03', no: 'R-2611-0144', type: 'Rezerwacja', who: 'Piotr Kaczmarek · SUPER OSK MIKRUS', desc: 'Plac kat. B – pojazd OSK · tor 1 · 3 sloty', amt: '111,00', fee: '5,55', doc: 'FV 144/11/2026', st: chip('ok', 'Opłacona') },
      { k: 'obc', date: '16.11 18:47', no: 'O-2611-0013', type: 'Paliwo / energia', who: 'Tomasz Lis · EVOLUTION', desc: 'Paliwo: brak 6 l × 10 zł · Renault Clio (R-2611-0128)', amt: '60,00', fee: '3,00', doc: 'FV 160/11/2026', st: chip('ok', 'Pobrane z portfela') },
      { k: 'obc', date: '18.11 17:31', no: 'O-2611-0015', type: 'Paliwo / energia', who: 'Katarzyna Mazur · ATA', desc: 'Paliwo: brak 3 l × 10 zł · Toyota Yaris (R-2611-0141)', amt: '30,00', fee: o === 'ok' ? '1,50' : '—', doc: o === 'ok' ? 'FV 162/11/2026' : '—', st: o === 'ok' ? chip('ok', 'Pobrane z portfela') : o === 'no' ? chip('grey', 'Anulowane') : chip('warn', 'Do zatwierdzenia (poza sumą)') },
      { k: 'zw', date: '12.11 07:30', no: 'Z-2611-0009', type: 'Zwrot', who: 'Anna Wróbel · POLONEZ', desc: 'Odwołanie przez WORD – śnieg, plac zamknięty (R-2611-0102)', amt: '−74,00', fee: '−3,70', doc: 'FK 9/11/2026', st: chip('info', 'Zwrócono do portfela') },
      { k: 'zw', date: '12.11 07:30', no: 'Z-2611-0008', type: 'Zwrot', who: 'Marek Zieliński · SUPER OSK MIKRUS', desc: 'Odwołanie przez WORD – śnieg, plac zamknięty (R-2611-0098)', amt: '−111,00', fee: '−5,55', doc: 'FK 8/11/2026', st: chip('info', 'Zwrócono do portfela') }
    ];
  }

  function kpi(lbl, val, note, extra) {
    return '<div class="card"' + (extra || '') + '><div class="lbl">' + lbl + '</div><div class="kpi">' + val + '</div><div class="muted" style="font-size:13px">' + note + '</div></div>';
  }
  function share(w, color, pct) {
    return '<div style="display:flex;align-items:center;gap:6px"><div style="width:' + w + 'px;height:8px;background:' + color + ';border-radius:4px"></div><span class="muted">' + pct + '</span></div>';
  }

  var MONTHS = {"paz": {"btn": "Październik 2026 · pełny miesiąc (model)", "stamp": "okres zamknięty 31.10.2026 · 22 dni robocze", "mon": "10", "monName": "październik 2026", "days": [[1, "Cz", 2276, ""], [2, "Pt", 2336, ""], [5, "Pn", 2176, ""], [6, "Wt", 2226, ""], [7, "Śr", 2246, ""], [8, "Cz", 2276, ""], [9, "Pt", 2336, ""], [12, "Pn", 2176, ""], [13, "Wt", 2226, ""], [14, "Śr", 2246, ""], [15, "Cz", 2276, ""], [16, "Pt", 2336, ""], [19, "Pn", 2176, ""], [20, "Wt", 2226, ""], [21, "Śr", 2126, "r"], [22, "Cz", 2276, ""], [23, "Pt", 2336, ""], [26, "Pn", 2176, ""], [27, "Wt", 2226, ""], [28, "Śr", 2246, ""], [29, "Cz", 2276, ""], [30, "Pt", 2216, ""]], "refDay": "21.10", "refTip": " · zwroty 540 zł (przedłużone egzaminy)", "daysTitle": "22 dni robocze 1–31.10.2026 (bez sobót i niedziel)", "pdf": "zestawienie-word-gorzow-2026-10.pdf", "assume": "5 aut WORD × 4 h najmu po mieście dziennie, auto + tor łącznie 4 h/dzień, plac z autem OSK 4 h/dzień, dni robocze pn–pt", "kpi": [["Sprzedaż najmu", "45 452,00 zł", "506 rezerwacji · 22 dni robocze (obliczone przy założeniu: 5 aut WORD × 4 h najmu po mieście dziennie, auto + tor łącznie 4 h/dzień, plac z autem OSK 4 h/dzień, dni robocze pn–pt)"], ["Rozliczenia (paliwo itp.)", "3 960,00 zł", "44 × paliwo z portfela (396 l × 10 zł) (obliczone przy założeniu: 2 dopłaty dziennie, łącznie 18 l)"], ["Zwroty", "<span style=\"color:#9b1c1c\">−540,00 zł</span>", "6 rezerwacji · zwrot do portfela · 21.10 przedłużone egzaminy"], ["Podstawa prowizji", "48 872,00 zł", "opłacone transakcje − zwroty"], ["Prowizja platformy · 5%", "2 443,60 zł", "faktura prowizyjna dla WORD 2.11.2026"], ["Do wypłaty dla WORD", "46 428,40 zł", "przed opłatami operatora płatności"]], "wal": [["Doładowania", "50 522,00 zł", "808 doładowań · Apple Pay 52%, BLIK 37%, karta 11%"], ["Wydane z portfeli", "49 412,00 zł", "rezerwacje 45 452 + dopłaty 3 960"], ["Zwroty na portfele", "540,00 zł", "6 zwrotów · 21.10"], ["Saldo portfeli 31.10", "1 650,00 zł", "23 aktywne portfele · środki klientów, nie przychód"]], "walEq": "(50 522 − 49 412 + 540)", "prod": [["Plac kat. B – pojazd OSK (tor 1–4)", "176 slotów", "37,00", "6 512,00", 13, "#2b3370"], ["Najem auta WORD (1 h / 2 h)", "220 × 1 h, 110 × 2 h", "55 / 100", "23 100,00", 47, "#2b3370"], ["Auto WORD + tor kat. B (30 min)", "176 slotów", "90,00", "15 840,00", 32, "#2b3370"], ["Paliwo – dopłaty z portfela", "396 l", "10,00", "3 960,00", 8, "#f5c400"]], "prodTotal": "49 412,00", "osk": [["SUPER OSK MIKRUS Piotr Kawalec", 180, "15 750,00", "787,50", 196], ["Szkoła Kierowców POLONEZ Winiarska-Doktór Anna", 134, "12 195,00", "609,75", 146], ["EVOLUTION Mirosław Chudy", 96, "9 505,00", "475,25", 104], ["Centrum Szkoleniowe ATA Dariusz Klisowski", 66, "6 755,00", "337,75", 72], ["Pozostałe (5 z 20 OSK)", 30, "4 667,00", "233,35", 32]], "oskTotal": [506, "48 872,00", "2 443,60", 550], "korekty": 6, "cars": [["Renault Clio E-Tech (egzaminacyjne)", "Hybryda", "44 / 22 · 60", "10 020,00", "paliwo 196 l · 1 960,00", "4,0 + 1,4 = 5,4 h"], ["Toyota Yaris Hybrid", "Hybryda", "44 / 22 · 36", "7 860,00", "paliwo 140 l · 1 400,00", "4,0 + 0,8 = 4,8 h"], ["BYD Dolphin", "Elektryk", "44 / 22 · 32", "7 500,00", "—", "4,0 + 0,7 = 4,7 h"], ["Fiat 500e", "Elektryk", "44 / 22 · 24", "6 780,00", "—", "4,0 + 0,5 = 4,5 h"], ["Škoda Fabia 1.0 TSI DSG", "Benzyna", "44 / 22 · 24", "6 780,00", "paliwo 60 l · 600,00", "4,0 + 0,5 = 4,5 h"]], "carsTotal": ["220 / 110 · 176", "38 940,00", "3 960,00", "24 h/dzień"], "tx": false, "comm": [["Okres", "1–31.10.2026 (zamknięty)"], ["Podstawa", "48 872,00 zł"], ["Stawka prowizji", "5% od opłaconej transakcji (przykład)"], ["Prowizja", "<b>2 443,60 zł</b>"], ["Do wypłaty dla WORD", "<b>46 428,40 zł</b>"], ["Dzienne zestawienie", "e-mail 8:00 → ksiegowosc@word-gorzow.example"]], "sched": [["31.10, 23:59", "zamknięcie okresu, blokada korekt"], ["2.11", "faktura prowizyjna e-Kierowca → WORD (2 443,60 zł)"], ["2.11", "raport rozbieżności z wyciągiem operatora płatności"], ["16.11", "termin płatności faktury prowizyjnej"]]}, "lis": {"btn": "Listopad 2026 · w toku", "stamp": "stan na 17.11.2026, 13:00", "mon": "11", "monName": "listopad 2026", "days": [[2, "Pn", 2216, ""], [3, "Wt", 2276, ""], [4, "Śr", 2226, ""], [5, "Cz", 2296, ""], [6, "Pt", 2346, ""], [9, "Pn", 2236, ""], [10, "Wt", 2266, ""], [12, "Cz", 2086, "r"], [13, "Pt", 2356, ""], [16, "Pn", 2226, ""], [17, "Wt", 2176, ""]], "refDay": "12.11", "refTip": " · zwroty 1 080 zł (śnieg)", "daysTitle": "11 dni roboczych 1–17.11.2026 (bez sobót, niedziel i 11.11)", "pdf": "zestawienie-word-gorzow-2026-11.pdf", "assume": "5 aut WORD × 4 h najmu po mieście dziennie, auto + tor łącznie 4 h/dzień, plac z autem OSK 4 h/dzień, dni robocze pn–pt", "kpi": [["Sprzedaż najmu", "22 726,00 zł", "253 rezerwacje · 11 dni roboczych 1–17.11"], ["Rozliczenia (paliwo itp.)", "1 980,00 zł", "22 × paliwo z portfela (198 l × 10 zł) · 1 do zatwierdzenia"], ["Zwroty", "<span style=\"color:#9b1c1c\">−1 080,00 zł</span>", "12 rezerwacji · zwrot do portfela · 12.11 śnieg"], ["Podstawa prowizji", "23 626,00 zł", "opłacone transakcje − zwroty"], ["Prowizja platformy · 5%", "1 181,30 zł", "faktura prowizyjna dla WORD 1.12.2026"], ["Do wypłaty dla WORD", "22 444,70 zł", "przed opłatami operatora płatności"]], "wal": [["Doładowania", "25 326,00 zł", "401 doładowań · Apple Pay 52%, BLIK 37%, karta 11%"], ["Wydane z portfeli", "24 706,00 zł", "rezerwacje 22 726 + dopłaty 1 980"], ["Zwroty na portfele", "1 080,00 zł", "12 zwrotów · 12.11 śnieg"], ["Saldo portfeli 17.11", "1 700,00 zł", "23 aktywne portfele · środki klientów, nie przychód"]], "walEq": "(25 326 − 24 706 + 1 080)", "prod": [["Plac kat. B – pojazd OSK (tor 1–4)", "88 slotów", "37,00", "3 256,00", 13, "#2b3370"], ["Najem auta WORD (1 h / 2 h)", "110 × 1 h, 55 × 2 h", "55 / 100", "11 550,00", 47, "#2b3370"], ["Auto WORD + tor kat. B (30 min)", "88 slotów", "90,00", "7 920,00", 32, "#2b3370"], ["Paliwo – dopłaty z portfela", "198 l", "10,00", "1 980,00", 8, "#f5c400"]], "prodTotal": "24 706,00", "osk": [["SUPER OSK MIKRUS Piotr Kawalec", 90, "7 616,00", "380,80", 98], ["Szkoła Kierowców POLONEZ Winiarska-Doktór Anna", 67, "5 894,00", "294,70", 73], ["EVOLUTION Mirosław Chudy", 48, "4 599,00", "229,95", 52], ["Centrum Szkoleniowe ATA Dariusz Klisowski", 33, "3 269,00", "163,45", 36], ["Pozostałe (5 z 20 OSK)", 15, "2 248,00", "112,40", 16]], "oskTotal": [253, "23 626,00", "1 181,30", 275], "korekty": 12, "cars": [["Renault Clio E-Tech (egzaminacyjne)", "Hybryda", "22 / 11 · 30", "5 010,00", "paliwo 98 l · 980,00", "4,0 + 1,4 = 5,4 h"], ["Toyota Yaris Hybrid", "Hybryda", "22 / 11 · 18", "3 930,00", "paliwo 70 l · 700,00", "4,0 + 0,8 = 4,8 h"], ["BYD Dolphin", "Elektryk", "22 / 11 · 16", "3 750,00", "—", "4,0 + 0,7 = 4,7 h"], ["Fiat 500e", "Elektryk", "22 / 11 · 12", "3 390,00", "—", "4,0 + 0,5 = 4,5 h"], ["Škoda Fabia 1.0 TSI DSG", "Benzyna", "22 / 11 · 12", "3 390,00", "paliwo 30 l · 300,00", "4,0 + 0,5 = 4,5 h"]], "carsTotal": ["110 / 55 · 88", "19 470,00", "1 980,00", "24 h/dzień"], "tx": true, "comm": [["Okres", "1–30.11.2026 (w toku)"], ["Podstawa", "23 626,00 zł"], ["Stawka prowizji", "5% od opłaconej transakcji (przykład)"], ["Prowizja", "<b>1 181,30 zł</b>"], ["Do wypłaty dla WORD", "<b>22 444,70 zł</b>"], ["Dzienne zestawienie", "e-mail 8:00 → ksiegowosc@word-gorzow.example"]], "sched": [["30.11, 23:59", "zamknięcie okresu, blokada korekt"], ["1.12", "faktura prowizyjna e-Kierowca → WORD (1 181,30 zł + korekty)"], ["1.12", "raport rozbieżności z wyciągiem operatora płatności"], ["15.12", "termin płatności faktury prowizyjnej"]]}};
  A.pMonth = function (m) { S.p.month = m; };
  function pRozl() {
    var p = S.p, M = MONTHS[p.month || 'lis'];
    var maxV = Math.max.apply(null, M.days.map(function (d) { return d[2]; }));
    var bars = M.days.map(function (d) {
      var h = Math.round(d[2] / maxV * 140);
      var col = d[3] === 'r' ? '#e08585' : '#2b3370';
      return '<div class="bar" title="' + d[0] + '.' + M.mon + ': ' + fmt(d[2]) + ' zł brutto' + (d[3] === 'r' ? M.refTip : '') + '"><span>' + (d[2] / 1000).toFixed(1).replace('.', ',') + '</span><i style="height:' + h + 'px;background:' + col + '"></i></div>';
    }).join('');
    var labs = M.days.map(function (d) { return '<div>' + d[0] + ' ' + d[1] + '</div>'; }).join('');
    var monthBtns = [['paz', MONTHS.paz.btn], ['lis', MONTHS.lis.btn]].map(function (m) { var on = (p.month || 'lis') === m[0]; return '<button class="fbtn' + (on ? ' on' : '') + '" type="button" aria-pressed="' + on + '"' + act('pMonth', m[0]) + '>' + m[1] + '</button>'; }).join('');
    var linkBtn = 'display:inline-flex;align-items:center;text-decoration:none';
    var head = '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + monthBtns + '<span class="muted" style="font-size:13px">' + M.stamp + '</span></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' + (M.tx ? '<a class="btn" style="' + linkBtn + '" href="transakcje-word-gorzow-2026-11.csv" download>Eksport CSV</a>' : '') + '<a class="btn" style="' + linkBtn + '" href="' + M.pdf + '" target="_blank" rel="noopener">Zestawienie PDF</a><button class="btn yel" type="button">Wyślij zestawienie do księgowości</button></div></div>';
    var assume = (p.month || 'lis') === 'paz' ? '<div class="card" style="border-color:#f5c400;background:#fffbea"><h2>Założenia modelu – październik 2026 (pełny miesiąc, 22 dni robocze)</h2><div class="g2" style="gap:6px 24px;font-size:14px">' +
      ['<b>Auta WORD – najem po mieście:</b> 5 aut × 4 h dziennie (jedna jazda 2 h + dwie po 1 h) = 20 h/dzień',
       '<b>Auta z torem kat. B:</b> łącznie 4 h/dzień (8 × 30 min)',
       '<b>Plac z autem OSK:</b> 4 h/dzień (8 × 30 min)',
       '<b>Obłożenie torów 1–4 (kat. B)</b> w oknie najmu 15–18: 16 z 24 slotów (67%)',
       '<b>Obłożenie aut:</b> Clio 5,4 h z 6 h dostępnych (90%), pozostałe 4,5–4,8 h z 12 h (38–40%)',
       '<b>Paliwo:</b> 2 dopłaty dziennie, łącznie 18 l (Clio, Yaris, Fabia; elektryki wracają naładowane)',
       '<b>Zwroty:</b> 6 rezerwacji (21.10, przedłużone egzaminy)',
       '<b>Stawki:</b> plac kat. B 37 zł/30 min (cennik WORD Gorzów) · auto + tor 90 zł/30 min · najem auta 55 zł/1 h, 100 zł/2 h · prowizja 5%'].map(function (t) { return '<div>' + t + '</div>'; }).join('') +
      '</div><p class="muted" style="font-size:12px;margin:10px 0 0">Wszystkie kwoty października obliczone przy powyższych założeniach – do porównania z rzeczywistym obłożeniem po starcie pilota.</p></div>' : '';
    var all = txList();
    var txs = p.tx === 'all' ? all : all.filter(function (t) { return t.k === p.tx; });
    var chips = [['all', 'Wszystkie'], ['rez', 'Rezerwacje'], ['obc', 'Paliwo itp.'], ['zw', 'Zwroty'], ['dol', 'Doładowania']].map(function (c) {
      return '<button type="button" class="fbtn' + (p.tx === c[0] ? ' on' : '') + '" aria-pressed="' + (p.tx === c[0]) + '"' + act('pTx', c[0]) + '>' + c[1] + '</button>';
    }).join('');
    var rows = txs.map(function (t) {
      return '<tr><td class="td" style="white-space:nowrap">' + t.date + '</td><td class="td" style="white-space:nowrap">' + t.no + '</td><td class="td">' + t.type + '</td><td class="td">' + t.who + '</td><td class="td">' + t.desc + '</td><td class="td num">' + t.amt + '</td><td class="td num">' + t.fee + '</td><td class="td" style="white-space:nowrap">' + t.doc + '</td><td class="td">' + t.st + '</td></tr>';
    }).join('');
    var txCard = M.tx ? '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center"><h2 style="margin:0">Transakcje</h2><div role="group" aria-label="Filtr transakcji" style="display:flex;gap:6px;flex-wrap:wrap">' + chips + '</div></div>' +
      '<div class="tbox"><table><thead><tr><th class="th">Data</th><th class="th">Numer</th><th class="th">Typ</th><th class="th">Instruktor · OSK</th><th class="th">Opis</th><th class="th num">Kwota brutto</th><th class="th num">Prowizja</th><th class="th">Dokument</th><th class="th">Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="muted" style="font-size:12px">Pokazano ' + txs.length + ' z 700</div></div>' : '';
    return head + assume +
      '<div class="g3">' + M.kpi.map(function (k, i) { return kpi(k[0], k[1], k[2], i === 5 ? ' style="border-color:#f5c400;background:#fffbea"' : ''); }).join('') + '</div>' +
      '<div class="card"><h2>Portfele instruktorów · ' + M.monName + '</h2><div class="g4">' + M.wal.map(function (r) {
        return '<div><div class="lbl">' + r[0] + '</div><div class="kpi" style="font-size:20px">' + r[1] + '</div><div class="muted" style="font-size:12px">' + r[2] + '</div></div>';
      }).join('') + '</div><p class="muted" style="font-size:12px;margin:12px 0 0">Saldo = doładowania − wydatki + zwroty ' + M.walEq + '. Przychodem WORD jest dopiero usługa rozliczona z portfela; prowizja liczona od rozliczonych usług, nie od doładowań.</p></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:baseline"><h2 style="margin:0">Sprzedaż dzienna brutto · ' + M.daysTitle + '</h2>' +
      '<div class="muted" style="font-size:12px;display:flex;gap:14px;flex-wrap:wrap"><span><i style="display:inline-block;width:10px;height:10px;background:#2b3370;border-radius:2px"></i> dni robocze</span><span><i style="display:inline-block;width:10px;height:10px;background:#e08585;border-radius:2px"></i> dzień ze zwrotami</span></div></div>' +
      '<div class="hscroll"><div style="min-width:' + (M.days.length > 15 ? 720 : 420) + 'px"><div class="bars">' + bars + '</div><div class="barlab">' + labs + '</div></div></div></div>' +
      '<div class="g2"><div class="card"><h2>Według produktu</h2><div class="tbox"><table><thead><tr><th class="th">Produkt</th><th class="th num">Ilość</th><th class="th num">Cena</th><th class="th num">Kwota brutto</th><th class="th">Udział</th></tr></thead><tbody>' +
      M.prod.map(function (r) { return '<tr><td class="td">' + r[0] + '</td><td class="td num">' + r[1] + '</td><td class="td num">' + r[2] + '</td><td class="td num">' + r[3] + '</td><td class="td">' + share(r[4], r[5], r[4] + '%') + '</td></tr>'; }).join('') +
      '<tr><td class="td"><b>Razem przed zwrotami</b></td><td class="td"></td><td class="td"></td><td class="td num"><b>' + M.prodTotal + '</b></td><td class="td"></td></tr></tbody></table></div></div>' +
      '<div class="card"><h2>Według OSK (po zwrotach)</h2><div class="tbox"><table><thead><tr><th class="th">OSK</th><th class="th num">Rezerwacje</th><th class="th num">Kwota</th><th class="th num">Prowizja 5%</th><th class="th num">Faktury</th></tr></thead><tbody>' +
      M.osk.map(function (r) { return '<tr><td class="td">' + r[0] + '</td><td class="td num">' + r[1] + '</td><td class="td num">' + r[2] + '</td><td class="td num">' + r[3] + '</td><td class="td num">' + r[4] + '</td></tr>'; }).join('') +
      '<tr><td class="td"><b>Razem</b></td><td class="td num"><b>' + M.oskTotal[0] + '</b></td><td class="td num"><b>' + M.oskTotal[1] + '</b></td><td class="td num"><b>' + M.oskTotal[2] + '</b></td><td class="td num"><b>' + M.oskTotal[3] + '</b></td></tr></tbody></table></div>' +
      '<p class="muted" style="font-size:12px;margin:10px 0 0">Faktury VAT wystawiane automatycznie na OSK przy każdej płatności; zwroty = faktury korygujące (' + M.korekty + ').</p></div></div>' +
      '<div class="card"><h2>Według pojazdu WORD</h2><div class="tbox"><table><thead><tr><th class="th">Pojazd</th><th class="th">Napęd</th><th class="th num">Najem 1 h / 2 h · z placem (30 min)</th><th class="th num">Przychód brutto</th><th class="th num">Paliwo itp.</th><th class="th num">Średnio h/dzień (najem + plac)</th></tr></thead><tbody>' +
      M.cars.map(function (r) { return '<tr><td class="td">' + r[0] + '</td><td class="td">' + chip(r[1] === 'Elektryk' ? 'info' : 'grey', r[1]) + '</td><td class="td num">' + r[2] + '</td><td class="td num">' + r[3] + '</td><td class="td num">' + r[4] + '</td><td class="td num">' + r[5] + '</td></tr>'; }).join('') +
      '<tr><td class="td"><b>Razem flota</b></td><td class="td"></td><td class="td num"><b>' + M.carsTotal[0] + '</b></td><td class="td num"><b>' + M.carsTotal[1] + '</b></td><td class="td num"><b>' + M.carsTotal[2] + '</b></td><td class="td num"><b>' + M.carsTotal[3] + '</b></td></tr></tbody></table></div>' +
      '<p class="muted" style="font-size:12px;margin:10px 0 0">Godziny najmu po mieście: Clio 15–21 (po egzaminach), pozostałe auta 8–20. Elektryki wracają z co najmniej tym samym poziomem baterii (ładowarka AC przy placu) – brak dopłat za energię.</p></div>' +
      txCard +
      '<div class="card g2" style="gap:24px"><div><h2>Rozliczenie prowizji · ' + M.monName + '</h2><div class="kv">' + M.comm.map(function (r) { return '<span class="muted">' + r[0] + '</span><span>' + r[1] + '</span>'; }).join('') + '</div></div>' +
      '<div><h2>Harmonogram zamknięcia okresu</h2><ol style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:10px;font-size:14px">' + M.sched.map(function (r) { return '<li><b>' + r[0] + '</b> – ' + r[1] + '</li>'; }).join('') + '</ol></div></div>';
  }

  function pPlan() {
    var F = ['f', 'wolne'];
    var grid = [
      ['Tor 1 (B)', [['o', 'T. Lis · EVOLUTION'], ['o', 'T. Lis · EVOLUTION'], F, ['o', 'P. Kaczmarek · SUPER OSK MIKRUS'], ['o', 'P. Kaczmarek · SUPER OSK MIKRUS'], ['o', 'P. Kaczmarek · SUPER OSK MIKRUS']]],
      ['Tor 2 (B)', [['c', 'M. Zieliński · Clio'], ['c', 'M. Zieliński · Clio'], F, F, ['o', 'A. Wróbel · POLONEZ'], F]],
      ['Tor 3 (B)', [F, ['o', 'K. Mazur · ATA'], ['o', 'K. Mazur · ATA'], F, F, F]],
      ['Tor 4 (B)', [F, F, F, ['o', 'R. Bąk · EVOLUTION'], ['o', 'R. Bąk · EVOLUTION'], F]],
      ['Tor 5 (B+E, C+E, D, T)', [F, F, ['o', 'W. Lis · ATA (C+E)'], F, F, F]],
      ['Tor 6 (C)', [F, F, F, F, F, F]],
      ['Renault Clio (egz.)', [['c', 'M. Zieliński · tor 2'], ['c', 'M. Zieliński · tor 2'], ['b', 'bufor 15 min'], F, F, ['b', 'zwrot do 21:00']]],
      ['Toyota Yaris', [F, F, ['c', 'J. Nowak · miasto'], ['c', 'J. Nowak · miasto'], F, F]],
      ['BYD Dolphin', [F, F, F, ['c', 'K. Mazur · miasto'], ['c', 'K. Mazur · miasto'], ['b', 'ładowanie']]],
      ['Fiat 500e', [['b', 'ładowanie'], ['b', 'ładowanie'], F, F, F, F]],
      ['Škoda Fabia (benzyna)', [F, F, F, F, F, F]]
    ];
    var hdr = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(function (h) { return '<div style="font-size:12px;font-weight:700;color:#3c4043;padding:4px">' + h + '</div>'; }).join('');
    var body = grid.map(function (r) {
      return '<div style="font-size:13px;font-weight:500;display:flex;align-items:center">' + r[0] + '</div>' + r[1].map(function (c) { return '<div class="cell c-' + c[0] + '">' + c[1] + '</div>'; }).join('');
    }).join('');
    return '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><div style="display:flex;gap:8px;align-items:center"><button class="btn" type="button" aria-label="Poprzedni dzień">‹</button><b style="font-size:16px">czw., 19.11.2026</b><button class="btn" type="button" aria-label="Następny dzień">›</button></div>' +
      '<div class="muted" style="display:flex;gap:12px;font-size:12px;flex-wrap:wrap"><span>' + chip('info', 'OSK') + ' pojazd OSK</span><span>' + chip('warn', 'auto') + ' auto WORD</span><span>' + chip('grey', 'bufor') + ' bufor / blokada</span><span>egzaminy 7:30–14:30 – plac zablokowany</span></div><button class="btn" type="button">Drukuj listę dnia</button></div>' +
      '<div class="card tbox"><div class="grid"><div></div>' + hdr + body + '</div><p class="muted" style="font-size:12px;margin:10px 0 0">Siatka pokazuje okno placu 15:00–18:00. Najem aut po mieście trwa dłużej: Clio 15:00–21:00 (po egzaminach), pozostałe auta 8:00–20:00 </p></div>' +
      '<div class="card"><h2>Przyjazdy · 19.11</h2><div class="tbox"><table><thead><tr><th class="th">Godz.</th><th class="th">Instruktor · OSK</th><th class="th">Zasoby</th><th class="th">Pojazd</th><th class="th">Szlaban / auto</th><th class="th">Obecność</th></tr></thead><tbody>' +
      '<tr><td class="td">15:00</td><td class="td">Tomasz Lis · EVOLUTION</td><td class="td">tor 1</td><td class="td">FZ 3302P (OSK)</td><td class="td">wjazd 14:55</td><td class="td">' + chip('ok', 'Stawił się (szlaban)') + '</td></tr>' +
      '<tr><td class="td">15:00</td><td class="td">Marek Zieliński · SUPER OSK MIKRUS</td><td class="td">tor 2</td><td class="td">Renault Clio E-Tech (WORD)</td><td class="td">wjazd 14:52 · auto otwarte 14:56</td><td class="td">' + chip('ok', 'Stawił się (szlaban)') + '</td></tr>' +
      '<tr><td class="td">15:30</td><td class="td">Katarzyna Mazur · ATA</td><td class="td">tor 3</td><td class="td">FZ 9184L (OSK)</td><td class="td">—</td><td class="td">' + chip('grey', 'Oczekiwany') + '</td></tr>' +
      '<tr><td class="td">16:00</td><td class="td">Jan Nowak · POLONEZ</td><td class="td">miasto</td><td class="td">Toyota Yaris Hybrid (WORD)</td><td class="td">—</td><td class="td">' + chip('grey', 'Oczekiwany') + '</td></tr>' +
      '<tr><td class="td">16:30</td><td class="td">Katarzyna Mazur · ATA</td><td class="td">miasto</td><td class="td">BYD Dolphin (WORD)</td><td class="td">—</td><td class="td">' + chip('grey', 'Oczekiwany') + '</td></tr>' +
      '</tbody></table></div></div>';
  }

  function pRez() {
    var rows = [
      ['R-2611-0147', '19.11 15:00–16:00', 'Auto WORD + tor kat. B', 'tor 2, Renault Clio', 'Marek Zieliński · SUPER OSK MIKRUS', '180,00', chip('ok', 'Opłacona')],
      ['R-2611-0146', '19.11 15:00–16:00', 'Plac kat. B – pojazd OSK', 'tor 1', 'Tomasz Lis · EVOLUTION', '74,00', chip('ok', 'Opłacona')],
      ['R-2611-0145', '19.11 16:30–17:30', 'Najem auta WORD', 'BYD Dolphin', 'Katarzyna Mazur · ATA', '55,00', chip('ok', 'Opłacona')],
      ['R-2611-0144', '19.11 16:30–18:00', 'Plac kat. B – pojazd OSK', 'tor 1', 'Piotr Kaczmarek · SUPER OSK MIKRUS', '111,00', chip('ok', 'Opłacona')],
      ['R-2611-0139', '16.11 16:00–17:00', 'Najem auta WORD', 'Toyota Yaris', 'Anna Wróbel · POLONEZ', '55,00', chip('info', 'Zrealizowana')],
      ['R-2611-0131', '14.11 10:00–10:30', 'Plac kat. B – pojazd OSK', 'tor 3', 'Jan Nowak · POLONEZ', '37,00', chip('bad', 'Nie stawił się')],
      ['R-2611-0102', '12.11 15:00–16:00', 'Plac kat. B – pojazd OSK', 'tor 2', 'Anna Wróbel · POLONEZ', '74,00', chip('grey', 'Odwołana przez WORD')]
    ];
    return '<div class="card tbox"><table><thead><tr><th class="th">Numer</th><th class="th">Termin</th><th class="th">Produkt</th><th class="th">Zasoby</th><th class="th">Instruktor · OSK</th><th class="th num">Kwota</th><th class="th">Status</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td class="td' + (i === 5 ? ' num' : '') + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  function pUmowy() {
    var p = S.p;
    var st = p.umStart === 'zgl' ? chip('warn', 'Zgłoszona – do aktywacji') : chip('ok', 'Aktywna');
    var wi = p.umWir === 'pod' ? chip('warn', 'Do podpisu przez WORD') : chip('info', 'Podpisana – OSK zgłasza staroście');
    var car = 'Flota WORD · 5 aut (automat)';
    return '<p class="muted" style="margin:0;font-size:13px">Jedna umowa obejmuje całą flotę (5 aut) – OSK zgłasza staroście wszystkie pojazdy. Jedno auto może mieć umowy z wieloma OSK naraz; produkty z autem widzą tylko instruktorzy OSK z umową „Aktywna”.</p>' +
      '<div class="card tbox"><table><thead><tr><th class="th">Pojazd</th><th class="th">OSK</th><th class="th">Okres</th><th class="th">Zgłoszenie do starosty</th><th class="th">Status</th><th class="th">Akcja</th></tr></thead><tbody>' +
      '<tr><td class="td">' + car + '</td><td class="td">SUPER OSK MIKRUS</td><td class="td">01.11.2026–31.10.2027</td><td class="td">złożone 03.11.2026 (PDF)</td><td class="td">' + chip('ok', 'Aktywna') + '</td><td class="td"></td></tr>' +
      '<tr><td class="td">' + car + '</td><td class="td">ATA</td><td class="td">01.11.2026–31.10.2027</td><td class="td">złożone 05.11.2026 (PDF)</td><td class="td">' + chip('ok', 'Aktywna') + '</td><td class="td"></td></tr>' +
      '<tr><td class="td">' + car + '</td><td class="td">POLONEZ</td><td class="td">15.11.2026–14.11.2027</td><td class="td">złożone 16.11.2026 (PDF)</td><td class="td">' + st + '</td><td class="td">' + (p.umStart === 'zgl' ? '<button class="btn yel" type="button"' + act('pUmStart') + '>Aktywuj</button>' : '') + '</td></tr>' +
      '<tr><td class="td">' + car + '</td><td class="td">EVOLUTION</td><td class="td">od 01.12.2026</td><td class="td">—</td><td class="td">' + wi + '</td><td class="td">' + (p.umWir === 'pod' ? '<button class="btn yel" type="button"' + act('pUmWir') + '>Podpisz umowę</button>' : '') + '</td></tr>' +
      '</tbody></table></div>';
  }

  function pObc() {
    var o = S.p.obc;
    var st = o === 'new' ? chip('warn', 'Do zatwierdzenia') : o === 'ok' ? chip('ok', 'Pobrane z portfela') : chip('grey', 'Anulowane');
    var a = o === 'new' ? '<div class="row-actions"><button class="btn yel" type="button"' + act('pObc', 'ok') + '>Zatwierdź i pobierz z portfela</button><button class="btn" type="button"' + act('pObc', 'no') + '>Anuluj</button></div>' : '';
    return '<div class="card tbox"><table><thead><tr><th class="th">Rezerwacja</th><th class="th">Instruktor · OSK</th><th class="th">Typ</th><th class="th">Wyliczenie</th><th class="th">Dowód</th><th class="th num">Kwota</th><th class="th">Status</th><th class="th">Akcja</th></tr></thead><tbody>' +
      '<tr><td class="td">R-2611-0141</td><td class="td">Katarzyna Mazur · ATA</td><td class="td">Paliwo · Toyota Yaris</td><td class="td">start 6/8, zwrot 5/8 → brak 3 l × 10 zł</td><td class="td">telematyka 18.11 17:31</td><td class="td num">30,00</td><td class="td">' + st + '</td><td class="td">' + a + '</td></tr>' +
      '<tr><td class="td">R-2611-0139</td><td class="td">Anna Wróbel · POLONEZ</td><td class="td">Paliwo · Toyota Yaris</td><td class="td">brak 4 l × 10 zł</td><td class="td">telematyka 16.11 17:02</td><td class="td num">40,00</td><td class="td">' + chip('ok', 'Pobrane z portfela') + '</td><td class="td"></td></tr>' +
      '<tr><td class="td">R-2611-0128</td><td class="td">Tomasz Lis · EVOLUTION</td><td class="td">Paliwo · Renault Clio</td><td class="td">brak 6 l × 10 zł</td><td class="td">zdjęcie deski 16.11 18:44</td><td class="td num">60,00</td><td class="td">' + chip('ok', 'Pobrane z portfela') + '</td><td class="td"></td></tr>' +
      '</tbody></table></div>';
  }

  function pZasoby() {
    var prod = function (n, z, c) { return '<div class="card"><div class="lbl">Produkt</div><h3 style="margin:6px 0;font-size:16px">' + n + '</h3><p class="muted" style="font-size:13px;margin:0 0 8px">' + z + '</p><div class="kpi" style="font-size:20px">' + c + '</div></div>'; };
    var res = function (l, t) { return '<div class="card"><div class="lbl">' + l + '</div><p style="font-size:14px;margin:8px 0 0">' + t + '</p></div>'; };
    return '<div class="g3">' + prod('Plac kat. B – pojazd OSK', 'Zasoby: 1 z torów 1–4 · pojazd OSK · cennik WORD Gorzów', '37,00 zł / 30 min') +
      prod('Najem auta WORD (automat)', 'Zasoby: 1 z 5 aut floty · miasto · wymaga umowy najmu', '55 zł / 1 h · 100 zł / 2 h') +
      prod('Auto WORD + tor kat. B', 'Zasoby: 1 z 5 aut + 1 z torów 1–4 (plac 37 zł + auto 53 zł)', '90,00 zł / 30 min') +
      prod('Plac kat. C – pojazd OSK', 'Zasoby: tor 6 · cennik WORD Gorzów', '58,00 zł / 30 min') +
      prod('Plac kat. B+E, C+E, D, T – pojazd OSK', 'Zasoby: tor 5 · cennik WORD Gorzów', '58,00 zł / 30 min') +
      res('Zasób · tory placu (ul. Podmiejska 18)', 'Tory 1–4 (kat. B) · tor 5 (B+E, C+E, D, T) · tor 6 (kat. C) · najem placu 15:00–18:00, sloty 30 min') +
      res('Szlaban', 'Wjazd na plac · sterownik: połączony · otwarć dziś: 6') +
      res('Ładowarka', 'AC 2 × 22 kW przy placu · ładuje: Fiat 500e') + '</div>' +
      '<div class="card"><h2>Flota WORD · 5 aut z automatyczną skrzynią</h2><div class="tbox"><table><thead><tr><th class="th">Pojazd</th><th class="th">Napęd</th><th class="th">Nr rej.</th><th class="th">Stan</th><th class="th num">Przebieg</th><th class="th">Zamek bezkluczykowy</th><th class="th">Uwagi</th></tr></thead><tbody>' +
      CARS.map(function (c) { return '<tr><td class="td">' + c.name + '</td><td class="td">' + chip(c.ev ? 'info' : 'grey', c.drive) + '</td><td class="td">' + c.reg + '</td><td class="td">' + c.state + '</td><td class="td num">' + c.odo + '</td><td class="td">' + chip('ok', 'połączony') + '</td><td class="td">' + (c.note || '—') + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="muted" style="font-size:12px;margin:10px 0 0">Numery rejestracyjne, stany i przebiegi są przykładowe.</p></div>';
  }

  function pInstr() {
    var i = S.p.instr;
    var st = i === 'new' ? chip('warn', 'Do weryfikacji') : i === 'ok' ? chip('ok', 'Zatwierdzony') : chip('bad', 'Odrzucony');
    var a = i === 'new' ? '<div class="row-actions"><button class="btn yel" type="button"' + act('pInstr', 'ok') + '>Zatwierdź</button><button class="btn" type="button"' + act('pInstr', 'no') + '>Odrzuć</button></div>' : '';
    return '<div class="card"><h2>Wnioski do weryfikacji</h2><div class="tbox"><table><thead><tr><th class="th">Instruktor</th><th class="th">Legitymacja</th><th class="th">Kategorie</th><th class="th">OSK</th><th class="th">Potwierdzenie OSK</th><th class="th">Status</th><th class="th">Akcja</th></tr></thead><tbody>' +
      '<tr><td class="td">Jan Nowicki</td><td class="td">skan (JPG)</td><td class="td">B</td><td class="td">EVOLUTION</td><td class="td">' + chip('ok', 'potwierdził właściciel') + '</td><td class="td">' + st + '</td><td class="td">' + a + '</td></tr>' +
      '<tr><td class="td">Ewa Sikora</td><td class="td">skan (PDF)</td><td class="td">A, B</td><td class="td">POLONEZ</td><td class="td">' + chip('warn', 'czeka na OSK') + '</td><td class="td">' + chip('grey', 'Oczekuje') + '</td><td class="td"></td></tr>' +
      '</tbody></table></div></div>' +
      '<div class="card"><h2>OSK pod nadzorem UM w Gorzowie Wlkp. · 24</h2><p class="muted" style="font-size:12px;margin:0 0 10px">Nazwy, numery rejestrowe i zdawalność praktyki kat. B za 1. podejściem (mediana powiatu: 40%) – rejestr i dane egzaminacyjne z <a href="https://jedna-miara.netlify.app" target="_blank" rel="noopener">Jedna miara</a>. Statusy umów są fikcyjne.</p><div class="tbox"><table><thead><tr><th class="th">OSK</th><th class="th">Nr rej.</th><th class="th num">Praktyka B, 1. podejście</th><th class="th num">Zdani / przystępujący</th><th class="th">Umowa najmu floty</th></tr></thead><tbody>' +
      OSK_GW.map(function (o) { var u = UMOWY[o[1]]; return '<tr><td class="td">' + o[0] + '</td><td class="td">' + o[1] + '</td><td class="td num">' + o[2] + '</td><td class="td num">' + o[3] + '</td><td class="td">' + (u ? chip(u === 'Aktywna' ? 'ok' : 'warn', u) : '—') + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>' +
      '<div class="card"><h2>Aktywni instruktorzy · 23</h2><div class="tbox"><table><thead><tr><th class="th">Instruktor</th><th class="th">OSK</th><th class="th">Kategorie</th><th class="th num">Rezerwacje XI</th><th class="th num">Nie stawił się (30 dni)</th><th class="th num">Paliwo itp.</th></tr></thead><tbody>' +
      '<tr><td class="td">Marek Zieliński</td><td class="td">SUPER OSK MIKRUS</td><td class="td">B</td><td class="td num">36</td><td class="td num">0</td><td class="td num">0</td></tr>' +
      '<tr><td class="td">Anna Wróbel</td><td class="td">POLONEZ</td><td class="td">B</td><td class="td num">29</td><td class="td num">0</td><td class="td num">2</td></tr>' +
      '<tr><td class="td">Jan Nowak</td><td class="td">POLONEZ</td><td class="td">B, C</td><td class="td num">14</td><td class="td num">2</td><td class="td num">1</td></tr>' +
      '</tbody></table></div></div>';
  }

  function pUst() {
    var f = function (l, v, d) { return '<label class="field">' + l + '<input value="' + v + '"' + dis(d) + '></label>'; };
    return '<div class="card g2">' + f('Długość slotu (min)', '30') + f('Rezerwacja naprzód (dni)', '14') + f('Bezpłatna rezygnacja do', 'dzień przed, 15:00') + f('Trzymanie slotu bez płatności (min)', '15') +
      f('Limit slotów na instruktora / tydzień', '12') + f('Stawka za brakujący litr paliwa (zł)', '10,00') + f('Stawka za brakującą energię – elektryki (zł/kWh)', '2,00') + f('Prowizja platformy (%)', '5', true) + f('Kwoty doładowania portfela (zł)', '10 / 25 / 50 / 100') + f('Opłata serwisowa za doładowanie (zł)', '0,00') + f('Minimalne saldo po najmie auta (zł)', '50,00') +
      '<label class="field">Regulamin najmu (wersja)<select><option>1.0 z 01.11.2026</option></select></label></div>';
  }
  function pKursy() {
    return '<div class="card"><p style="margin:0;font-size:14px">Moduł kursów (szkolenia redukujące punkty, kursy reedukacyjne) działa bez zmian. W demo pokazujemy tylko nowy moduł najmu – wybierz pozycję z sekcji „Najem placu i aut”.</p></div>';
  }

  /* ======================= PORTFEL (wspólny dla widżetu i aplikacji) ======================= */
  // Portfel instruktora – jak w aplikacjach biletowych: doładowanie, płatności i dopłaty z salda, zwroty na saldo.
  var MIN_SALDO_AUTO = 50; // minimalne saldo po opłaceniu najmu auta WORD – zabezpieczenie dopłaty za paliwo/energię
  S.wal = {
    bal: 210.00,
    method: 'apple',
    hist: [
      { d: '17.11 12:41', t: 'Rezerwacja R-2611-0147', s: 'Auto WORD (Clio) + B2 · FV 147/11/2026', v: -180 },
      { d: '17.11 12:39', t: 'Doładowanie portfela', s: 'Apple Pay', v: 100 },
      { d: '13.11 18:02', t: 'Rezerwacja R-2611-0121', s: 'Plac kat. B · FV 121/11/2026', v: -74 },
      { d: '12.11 07:30', t: 'Zwrot R-2611-0098', s: 'odwołanie przez WORD – śnieg · FK 8/11/2026', v: 111 },
      { d: '7.11 16:20', t: 'Rezerwacja R-2611-0064', s: 'Najem auta WORD · 1 h · FV 64/11/2026', v: -55 },
      { d: '5.11 09:12', t: 'Doładowanie portfela', s: 'BLIK', v: 300 }
    ]
  };
  var METHODS = { apple: 'Apple Pay', blik: 'BLIK', card: 'Karta Visa •••• 4417' };
  function nowStamp() { return '19.11 14:5' + (S.wal.hist.length % 10); }
  function walletPay(title, sub, amount) { S.wal.bal = Math.round((S.wal.bal - amount) * 100) / 100; S.wal.hist.unshift({ d: nowStamp(), t: title, s: sub, v: -amount }); }
  function walletTopUp(amount) { S.wal.bal = Math.round((S.wal.bal + amount) * 100) / 100; S.wal.hist.unshift({ d: nowStamp(), t: 'Doładowanie portfela', s: METHODS[S.wal.method], v: amount }); }
  function signed(v) { return (v > 0 ? '+' : '−') + zl(Math.abs(v)); }
  // ekran doładowania – ten sam w widżecie (back = krok płatności) i w aplikacji
  function topUpBody(state, ctxAct) {
    var amt = state.topAmt;
    var chips = [10, 25, 50, 100].map(function (v) { return '<button type="button" class="tchip' + (amt === v ? ' on' : '') + '"' + act(ctxAct + 'Amt', v) + '>' + v + ' zł</button>'; }).join('');
    var meth = ['apple', 'blik', 'card'].map(function (m) { return '<button type="button" class="tmeth' + (S.wal.method === m ? ' on' : '') + '"' + act('walMethod', m) + '>' + METHODS[m] + '</button>'; }).join('');
    return '<div class="topup"><div class="balcard"><span class="bl">Środki w portfelu</span><b>' + zl(S.wal.bal) + '</b></div>' +
      '<div class="tamt"><span>Kwota doładowania</span><b>' + amt + ' zł</b><i></i></div><div class="tchips">' + chips + '</div>' +
      '<div class="tsum"><div><span>Doładowanie portfela</span><span>' + zl(amt) + '</span></div><div><span>Opłata serwisowa</span><span>0,00 zł</span></div><div class="tot"><span>Suma</span><span>' + zl(amt) + '</span></div></div>' +
      '<div class="tmeths" role="group" aria-label="Metoda płatności">' + meth + '</div>' +
      '<button type="button" class="tpay"' + act(ctxAct + 'Confirm') + '>Potwierdź płatność · ' + zl(amt) + '</button></div>';
  }
  A.walMethod = function (m) { S.wal.method = m; };

  /* ======================= STRONA WORD (widżet) ======================= */
  var P = {
    plac: { name: 'Plac kat. B – pojazd OSK', desc: 'Tor 1–4 kat. B przydzielany automatycznie. Jazda pojazdem Twojego OSK.', price: 37 },
    clio: { name: 'Najem auta WORD (automat)', desc: '5 aut do wyboru, w tym 2 elektryki. Jazda po mieście: 1 h lub 2 h. Wymaga umowy najmu Twojego OSK.', price: 55, label: '55 zł / 1 h · 100 zł / 2 h' },
    clioPlac: { name: 'Auto WORD + tor kat. B', desc: 'Auto z floty WORD i gwarantowany tor kat. B (1–4) na placu.', price: 90 },
    placC: { name: 'Plac kat. C – tor 6', desc: 'Jazda pojazdem Twojego OSK.', price: 58 },
    placE: { name: 'Plac kat. B+E, C+E, D, T – tor 5', desc: 'Jazda pojazdem Twojego OSK.', price: 58 }
  };
  var WDAYS = [['18', 'śr.', '18.11'], ['19', 'czw.', '19.11'], ['20', 'pt.', '20.11'], ['21', 'sob.', '21.11'], ['22', 'niedz.', '22.11'], ['23', 'pon.', '23.11'], ['24', 'wt.', '24.11']];
  var TAKEN = { '18': { plac: [2], clio: [0, 1] }, '19': { plac: [1], clio: [0, 1, 2, 3, 4] }, '20': { plac: [0, 1], clio: [3] }, '21': { plac: [0, 1, 2, 5, 6], clio: [0, 1, 2, 3, 8, 9] }, '23': { plac: [], clio: [4, 5] }, '24': { plac: [3], clio: [] } };
  function halfHours(from, to) { var r = []; for (var m = from * 60; m < to * 60; m += 30) r.push(Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0')); return r; }
  function wTimes() { if (S.w.prod === 'clio' && S.w.day !== '21') return S.w.car === 'clio' ? halfHours(15, 21) : halfHours(8, 20); return S.w.day === '21' ? ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'] : ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30']; }
  function priceFor(prod, n) { if (prod === 'clio') return n >= 4 ? 100 : n >= 2 ? 55 : 0; return P[prod].price * n; }
  function priceLabel(prod) { return P[prod].label || zl(P[prod].price) + ' / 30 min'; }
  function prodName() { var w = S.w; return P[w.prod].name + (w.prod !== 'plac' ? ' · ' + carById(w.car).name : ''); }
  function wCalc() {
    var w = S.w, times = wTimes();
    var sorted = w.sel.slice().sort(function (a, b) { return a - b; });
    var contiguous = sorted.every(function (v, i) { return i === 0 || v === sorted[i - 1] + 1; });
    var end = function (i) { var hm = times[i].split(':').map(Number); var t = hm[0] * 60 + hm[1] + 30; return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
    var range = sorted.length ? (contiguous ? times[sorted[0]] + '–' + end(sorted[sorted.length - 1]) : sorted.map(function (i) { return times[i]; }).join(', ')) : '—';
    var cur = WDAYS.filter(function (d) { return d[0] === w.day; })[0];
    return { sorted: sorted, contiguous: contiguous, range: range, total: zl(priceFor(w.prod, sorted.length)), dayLabel: cur[1] + ' ' + cur[2] + '.2026', needsOsk: w.prod !== 'plac' };
  }
  A.wStep = function (s) { S.w.step = s; };
  A.wFromTerm = function () { S.w.step = S.w.logged ? 'det' : 'login'; };
  A.wLogin = function () { S.w.logged = true; S.w.step = 'det'; };
  A.wProd = function (id) { S.w.prod = id; S.w.sel = []; };
  A.wCar = function (id) { S.w.car = id; S.w.sel = []; };
  A.wDay = function (id) { S.w.day = id; S.w.sel = []; };
  A.wDur = function (d) { S.w.dur = Number(d); S.w.sel = []; };
  A.wStart = function (i) { i = Number(i); var k = S.w.dur * 2; var r = []; for (var j = 0; j < k; j++) r.push(i + j); S.w.sel = r; };
  A.wSlot = function (i) { i = Number(i); var s = S.w.sel; S.w.sel = s.indexOf(i) >= 0 ? s.filter(function (x) { return x !== i; }) : s.concat([i]); };
  A.wVeh = function (i) { S.w.veh = Number(i); };
  A.wToggle = function (k) { S.w[k] = !S.w[k]; };
  A.wPay = function (m) { S.w.pay = m; };
  A.wReset = function () { var w = S.w; w.step = 'svc'; w.sel = []; w.cReg = false; w.cCard = false; w.cRegR = false; };

  function strona() {
    var w = S.w, c = wCalc();
    var order = ['svc', 'term', 'login', 'det', 'pay', 'done'];
    var idx = order.indexOf(w.step === 'top' ? 'pay' : w.step);
    var bars = idx >= 0 ? '<div class="steps" aria-hidden="true">' + order.map(function (_, i) { return '<i class="' + (i <= idx ? 'on' : '') + '"></i>'; }).join('') + '</div>' : '';
    var body = { svc: wSvc, term: wTerm, login: wLogin, det: wDet, pay: wPay, top: wTop, done: wDone, reg: wReg, regdone: wRegDone }[w.step](c);
    return '<div class="v-strona"><header class="site"><div class="name">WORD Gorzów Wlkp. <small>· ul. Podmiejska 18, 66-400 Gorzów Wlkp. · tel. 95 732 43 77 · strona ośrodka (przykład osadzenia)</small></div>' +
      '<nav aria-label="Menu strony"><a href="#strona">Egzaminy</a><a href="#strona">Szkolenia</a><a href="#strona" class="on">Najem placu i aut</a><a href="#strona">Kontakt</a></nav></header>' +
      '<div class="wrap"><div style="display:flex;flex-direction:column;gap:10px"><h1>Najem placu manewrowego i auta WORD</h1><p class="lead">Usługa dla zweryfikowanych instruktorów nauki jazdy. Plac: pn–pt 15:00–18:00, sloty po 30 min – tory 1–4 kat. B (37 zł), tor 5 B+E, C+E, D, T (58 zł), tor 6 kat. C (58 zł); w weekendy brak terminów. Flota 5 aut z automatyczną skrzynią: Renault Clio E-Tech (egzaminacyjne), Toyota Yaris Hybrid, BYD Dolphin, Fiat 500e i Škoda Fabia (benzyna) – jazda po placu i po mieście dla OSK z umową najmu.</p></div>' +
      '<div class="frame"><div role="tablist" aria-label="Oddział"><button role="tab" aria-selected="true" type="button" class="otab">Gorzów Wlkp.</button></div>' +
      '<div class="widget">' + bars + body + '<div style="font-size:12px;color:#4a4a4a">Stworzone przez <a href="https://prawko.pl" target="_blank" rel="noopener">Prawko.pl</a></div></div></div></div></div>';
  }
  function wSvc() {
    var w = S.w;
    var cards = ['plac', 'clio', 'clioPlac', 'placC', 'placE'].map(function (id) {
      var pr = P[id];
      if (id === 'placC' || id === 'placE') return '<button type="button" class="prod" disabled><strong>' + pr.name + '</strong><span class="d">' + pr.desc + '</span><span class="p">' + zl(pr.price) + ' / 30 min</span><span class="lock">Poza Twoimi uprawnieniami (kat. B)</span></button>';
      return '<button type="button" class="prod' + (w.prod === id ? ' on' : '') + '" aria-pressed="' + (w.prod === id) + '"' + act('wProd', id) + '><strong>' + pr.name + '</strong><span class="d">' + pr.desc + '</span><span class="p">' + zl(pr.price) + ' / 30 min</span></button>';
    }).join('');
    var carPick = w.prod !== 'plac' ? '<h3 style="margin:8px 0 0;font-size:20px">Wybierz auto</h3><div class="cars">' + CARS.map(function (c) {
      return '<button type="button" class="carc' + (w.car === c.id ? ' on' : '') + '" aria-pressed="' + (w.car === c.id) + '"' + act('wCar', c.id) + '><span class="cartop"><strong>' + c.name + '</strong>' + chip(c.ev ? 'info' : 'grey', c.drive) + '</span><span class="d">' + (c.egz ? 'Auto egzaminacyjne WORD · ' : '') + 'automat · ' + c.state + '</span>' + (c.note && !c.egz ? '<span class="d">' + c.note + '</span>' : '') + '</button>';
    }).join('') + '</div>' : '';
    return '<h2>Wybierz usługę</h2><div class="prods">' + cards + '</div>' + carPick + '<div class="act"><button class="pill" type="button"' + act('wStep', 'term') + '>Dalej</button><span style="font-size:14px;color:#4a4a4a">Nie masz konta? <a href="#strona"' + act('wStep', 'reg') + '>Załóż konto instruktora</a></span></div>';
  }
  function summary(c, extraRows) {
    var w = S.w;
    return '<div class="sum"><div class="t">' + prodName() + '</div>' + extraRows + '</div>';
  }
  function wTerm(c) {
    var w = S.w, times = wTimes();
    var T = TAKEN[w.day] || { plac: [], clio: [] };
    var ci = CARS.map(function (c) { return c.id; }).indexOf(w.car);
    var carT = w.car === 'clio' ? T.clio : ((ci + Number(w.day)) % 3 === 0 ? [(ci + Number(w.day)) % times.length] : []);
    var taken = w.prod === 'plac' ? T.plac : w.prod === 'clio' ? carT : T.plac.concat(carT);
    var days = WDAYS.map(function (d) {
      if (d[0] === '21' || d[0] === '22') return '<button type="button" class="day" disabled><span style="font-size:12px">' + d[1] + '</span><b>' + d[2] + '</b></button>';
      return '<button type="button" class="day' + (w.day === d[0] ? ' on' : '') + '" aria-pressed="' + (w.day === d[0]) + '"' + act('wDay', d[0]) + '><span style="font-size:12px">' + d[1] + '</span><b>' + d[2] + '</b></button>';
    }).join('');
    var isRent = w.prod === 'clio', need = w.dur * 2;
    var slots = times.map(function (t, i) {
      if (isRent) {
        var fits = i + need <= times.length;
        for (var j = 0; fits && j < need; j++) if (taken.indexOf(i + j) >= 0) fits = false;
        if (!fits && w.sel.indexOf(i) >= 0) return '<button type="button" class="slot on" disabled aria-label="' + t + ' – w wybranym najmie">' + t + '</button>';
        if (!fits) return '<button type="button" class="slot" disabled>' + t + '</button>';
        var st = w.sel[0] === i;
        return '<button type="button" class="slot' + (w.sel.indexOf(i) >= 0 ? ' on' : '') + '" aria-pressed="' + st + '"' + act('wStart', i) + '>' + t + '</button>';
      }
      if (taken.indexOf(i) >= 0) return '<button type="button" class="slot" disabled>' + t + '</button>';
      var on = w.sel.indexOf(i) >= 0;
      return '<button type="button" class="slot' + (on ? ' on' : '') + '" aria-pressed="' + on + '"' + act('wSlot', i) + '>' + t + '</button>';
    }).join('');
    var ok = c.sorted.length > 0 && c.contiguous;
    return '<h2>Wybierz termin</h2><div class="cols"><div class="main"><div class="days" role="group" aria-label="Dzień">' + days + '</div>' +
      (isRent ? '<div style="font-size:15px;font-weight:500">Czas najmu</div><div class="days" role="group" aria-label="Czas najmu">' + [[1, '1 h · 55 zł'], [2, '2 h · 100 zł']].map(function (d) { return '<button type="button" class="day' + (w.dur === d[0] ? ' on' : '') + '" style="min-width:120px" aria-pressed="' + (w.dur === d[0]) + '"' + act('wDur', d[0]) + '><b>' + d[1] + '</b></button>'; }).join('') + '</div>' : '') +
      '<div style="font-size:15px;font-weight:500">' + (isRent ? 'Godzina rozpoczęcia' : 'Wolne sloty po 30 min') + ' · ' + c.dayLabel + '</div><div class="slots">' + slots + '</div>' +
      '<div class="note">' + (isRent ? 'Wybierz godzinę rozpoczęcia – auto rezerwujemy na ' + (w.dur === 1 ? '1 godzinę' : '2 godziny') + '.' : 'Zaznacz jeden lub kilka kolejnych slotów po 30 min. Tor kat. B (1–4) przydzielamy automatycznie.') + '</div></div>' +
      summary(c, '<div class="row"><span>Dzień</span><span>' + c.dayLabel + '</span></div><div class="row"><span>Godziny</span><span>' + c.range + '</span></div>' + (isRent ? '<div class="row"><span>Czas najmu</span><span>' + w.dur + ' h</span></div><div class="row"><span>Cennik</span><span>' + priceLabel(w.prod) + '</span></div>' : '<div class="row"><span>Liczba slotów</span><span>' + c.sorted.length + '</span></div><div class="row"><span>Cena za 30 min</span><span>' + zl(P[w.prod].price) + '</span></div>') + '<div class="row" style="font-weight:700"><span>Razem</span><span>' + c.total + '</span></div>' +
        (c.sorted.length > 1 && !c.contiguous ? '<p style="font-size:13px;color:#9b1c1c;margin:10px 0 0">Wybierz sloty następujące po sobie.</p>' : '')) +
      '</div><div class="act"><button class="ghost" type="button"' + act('wStep', 'svc') + '>Wstecz</button><button class="pill" type="button"' + dis(!ok) + act('wFromTerm') + '>Dalej</button></div>';
  }
  function wLogin() {
    return '<div style="display:flex;flex-direction:column;gap:20px;max-width:520px"><h2>Zaloguj się</h2><p style="margin:0;font-size:14px;color:#4a4a4a">Rezerwować mogą tylko instruktorzy zweryfikowani przez WORD.</p>' +
      '<label class="field">E-mail<input type="email" value="m.zielinski@superoskmikrus.example"></label><label class="field">Hasło<input type="password" value="haslo-przyklad"></label>' +
      '<div class="act"><button class="ghost" type="button"' + act('wStep', 'term') + '>Wstecz</button><button class="pill" type="button"' + act('wLogin') + '>Zaloguj</button><a href="#strona" style="font-size:14px"' + act('wStep', 'reg') + '>Załóż konto instruktora</a></div></div>';
  }
  function wDet(c) {
    var w = S.w;
    var osk = c.needsOsk ? '<fieldset><legend>OSK, który najmuje auto</legend><label class="radio"><input type="radio" name="osk" checked> SUPER OSK MIKRUS – umowa najmu floty WORD aktywna do 31.10.2027</label><label class="radio off"><input type="radio" name="osk" disabled> EVOLUTION – brak aktywnej umowy</label></fieldset>' : '';
    var veh = !c.needsOsk ? '<fieldset><legend>Pojazd OSK</legend>' + ['FZ 4521K · Toyota Yaris (SUPER OSK MIKRUS)', 'FZ 7710M · Kia Rio (SUPER OSK MIKRUS)'].map(function (l, i) {
      return '<label class="radio"><input type="radio" name="veh"' + ck(w.veh === i) + act('wVeh', i) + '> ' + l + '</label>';
    }).join('') + '</fieldset>' : '';
    var card = c.needsOsk ? '<label class="check"><input type="checkbox"' + ck(w.cCard) + act('wToggle', 'cCard') + '><span>Zgadzam się na pobranie z portfela dopłaty za brakujące paliwo (10,00 zł/l) lub energię w elektrykach (2,00 zł/kWh) i za szkody zgodnie z regulaminem.</span></label>' : '';
    var ok = w.cReg && (!c.needsOsk || w.cCard);
    return '<div class="cols"><div class="main"><h2>Szczegóły i zgody</h2><div style="font-size:14px">Zalogowany: <b>Marek Zieliński</b> · instruktor kat. B · legitymacja zweryfikowana</div>' + osk + veh +
      '<label class="check"><input type="checkbox"' + ck(w.cReg) + act('wToggle', 'cReg') + '><span>Akceptuję regulamin najmu placu i pojazdów WORD (wersja 1.0 z 01.11.2026) i oświadczam, że jazdy prowadzę osobiście jako instruktor.</span></label>' + card +
      '<label class="check"><input type="checkbox" checked><span>Przypomnienie SMS o rezerwacji (opcjonalne).</span></label>' +
      '<div class="note">Faktura na: SUPER OSK MIKRUS Piotr Kawalec (nr rej. 01020861, NIP z rejestru) · umowa najmu placu z WORD nr 14/2026 (przykład)</div></div>' +
      summary(c, '<div class="row"><span>Termin</span><span>' + c.dayLabel + ', ' + c.range + '</span></div><div class="row" style="font-weight:700"><span>Do zapłaty</span><span>' + c.total + '</span></div>') +
      '</div><div class="act"><button class="ghost" type="button"' + act('wStep', 'term') + '>Wstecz</button><button class="pill" type="button"' + dis(!ok) + act('wStep', 'pay') + '>Dalej</button></div>';
  }
  A.wTopUp = function () { S.w.topAmt = S.w.topAmt || 50; S.w.step = 'top'; };
  A.wTopAmt = function (v) { S.w.topAmt = Number(v); };
  A.wTopConfirm = function () { walletTopUp(S.w.topAmt); S.w.step = 'pay'; };
  A.wPayWallet = function () {
    var c = wCalc(); var amt = priceFor(S.w.prod, c.sorted.length);
    walletPay('Rezerwacja R-2611-0148', prodName() + ' · ' + c.dayLabel.split(' ')[1] + ' ' + c.range + ' · FV 163/11/2026', amt);
    S.w.paid = amt; S.w.step = 'done';
  };
  function wPay(c) {
    var amt = priceFor(S.w.prod, c.sorted.length);
    var after = Math.round((S.wal.bal - amt) * 100) / 100;
    var need = c.needsOsk ? MIN_SALDO_AUTO : 0;
    var ok = after >= need;
    var missing = Math.max(0, Math.ceil(need - after));
    return '<div style="display:flex;flex-direction:column;gap:20px;max-width:620px"><h2>Płatność z portfela</h2><div style="font-size:14px">' + prodName() + ' · ' + c.dayLabel + ', ' + c.range + ' · <b>' + c.total + '</b></div>' +
      '<div class="wal"><div class="row"><span>Środki w portfelu</span><b>' + zl(S.wal.bal) + '</b></div><div class="row"><span>Rezerwacja</span><span>−' + c.total + '</span></div><div class="row" style="border-bottom:0"><span>Saldo po płatności</span><b style="color:' + (ok ? '#1e6b34' : '#9b1c1c') + '">' + (after < 0 ? '−' + zl(-after) : zl(after)) + '</b></div></div>' +
      (c.needsOsk ? '<p class="note" style="margin:0">Przy aucie WORD po płatności w portfelu musi zostać co najmniej ' + zl(MIN_SALDO_AUTO) + ' – z tego pobieramy ewentualną dopłatę za paliwo (10,00 zł/l) lub energię (2,00 zł/kWh). Zwroty wracają do portfela.</p>' : '<p class="note" style="margin:0">Zwroty (np. odwołanie przez WORD) wracają do portfela.</p>') +
      (ok ? '' : '<p style="margin:0;font-size:14px;color:#9b1c1c">Brakuje ' + zl(missing) + '. Doładuj portfel, aby zapłacić.</p>') +
      '<div class="act"><button class="ghost" type="button"' + act('wStep', 'det') + '>Wstecz</button>' +
      (ok ? '<button class="pill" type="button"' + act('wPayWallet') + '>Zapłać z portfela ' + c.total + '</button>' : '') +
      '<button class="' + (ok ? 'ghost' : 'pill') + '" type="button"' + act('wTopUp') + '>Doładuj portfel</button></div></div>';
  }
  function wTop() {
    return '<div style="display:flex;flex-direction:column;gap:12px;max-width:520px"><div style="display:flex;align-items:center;gap:10px"><button class="ghost" type="button" style="padding:0 16px"' + act('wStep', 'pay') + '>Wstecz</button><h2 style="font-size:24px">Portfel</h2></div>' + topUpBody(S.w, 'wTop') + '</div>';
  }
  function wDone(c) {
    var w = S.w;
    return '<div style="display:flex;flex-direction:column;gap:16px;max-width:660px"><h2>Rezerwacja potwierdzona</h2><div style="background:#fff;border-radius:12px;padding:20px">' +
      '<div class="row"><span>Numer</span><b>R-2611-0148</b></div><div class="row"><span>Usługa</span><span>' + prodName() + '</span></div><div class="row"><span>Termin</span><span>' + c.dayLabel + ', ' + c.range + '</span></div><div class="row"><span>Zapłacono z portfela</span><span>' + zl(w.paid || 0) + '</span></div><div class="row"><span>Saldo portfela</span><span>' + zl(S.wal.bal) + '</span></div><div class="row" style="border-bottom:0"><span>Faktura</span><span>FV 163/11/2026 na SUPER OSK MIKRUS</span></div></div>' +
      '<p style="margin:0;font-size:14px;color:#4a4a4a">Szlaban otworzysz w aplikacji instruktora od 10 min przed startem' + (c.needsOsk ? ', a auto – od 5 min przed startem; kluczyki są w schowku' : '') + '. Bezpłatna rezygnacja do dnia poprzedniego, godz. 15:00 – pieniądze wracają do portfela.</p>' +
      '<div class="act"><button class="pill" type="button"' + act('goView', 'aplikacja') + '>Otwórz aplikację instruktora</button><button class="ghost" type="button">Dodaj do kalendarza (.ics)</button><button class="ghost" type="button"' + act('wReset') + '>Nowa rezerwacja</button></div></div>';
  }
  function wReg() {
    var w = S.w;
    var f = function (l, v, t) { return '<label class="field">' + l + '<input' + (t ? ' type="' + t + '"' : '') + ' value="' + v + '"></label>'; };
    return '<div style="display:flex;flex-direction:column;gap:16px;max-width:760px"><h2>Konto instruktora</h2><p style="margin:0;font-size:14px;color:#4a4a4a">Po wysłaniu: potwierdzasz e-mail, Twój OSK potwierdza, że u niego pracujesz, a WORD weryfikuje legitymację.</p>' +
      '<div class="form2">' + f('Imię *', 'Jan') + f('Nazwisko *', 'Nowicki') + f('E-mail *', 'j.nowicki@evolution.example', 'email') + f('Telefon *', '500 000 000') + f('Nr legitymacji instruktora *', '00000/08 (przykład)') + f('Kategorie uprawnień *', 'B') + f('Nr umowy OSK z WORD', '27/2026 (uzupełnia OSK)') +
      '<label class="field">OSK, w którym pracujesz *<select>' + OSK_GW.map(function (o) { return '<option' + (o[1] === '00840861' ? ' selected' : '') + '>' + o[0] + ' (nr rej. ' + o[1] + ')</option>'; }).join('') + '</select></label>' + f('Skan legitymacji *', 'legitymacja.jpg') + '</div>' +
      '<label class="check"><input type="checkbox"' + ck(w.cRegR) + act('wToggle', 'cRegR') + '><span>Akceptuję regulamin najmu (wersja 1.0 z 01.11.2026).</span></label>' +
      '<div class="act"><button class="ghost" type="button"' + act('wStep', 'svc') + '>Wstecz</button><button class="pill" type="button"' + dis(!w.cRegR) + act('wStep', 'regdone') + '>Wyślij wniosek</button></div></div>';
  }
  function wRegDone() {
    return '<div style="display:flex;flex-direction:column;gap:16px;max-width:660px"><h2>Wniosek wysłany</h2><ol style="margin:0;padding-left:20px;font-size:15px;display:flex;flex-direction:column;gap:8px">' +
      '<li>Potwierdź adres e-mail – link wysłaliśmy na j.nowicki@evolution.example.</li><li>EVOLUTION potwierdza, że u niego pracujesz (e-mail do właściciela).</li><li>WORD weryfikuje legitymację – zwykle 1–2 dni robocze. Dostaniesz e-mail.</li></ol>' +
      '<div><button class="ghost" type="button"' + act('wReset') + '>Wróć do rezerwacji</button></div></div>';
  }

  /* ======================= APLIKACJA INSTRUKTORA ======================= */
  A.aScr = function (s) { S.a.scr = s; };
  A.aGate = function () { S.a.gate = true; };
  A.aPh = function (i) { i = Number(i); S.a.ph[i] = !S.a.ph[i]; };
  A.aMark = function () { S.a.mark = !S.a.mark; };
  A.aK = function (i) { i = Number(i); S.a.k[i] = !S.a.k[i]; };
  A.aFuel = function (f) { S.a.fuel = f; };
  A.aFinish = function () { if (S.a.fuel === 'card' && !S.a.ended) walletPay('Dopłata za paliwo R-2611-0147', 'Renault Clio · brak 6 l × 10 zł · FV 164/11/2026', 60); S.a.scr = 'done'; S.a.ended = true; };
  A.aRestart = function () { var a = S.a; a.scr = 'home'; a.ph = [false, false, false, false, false]; a.k = [false, false, false, false]; a.gate = false; a.mark = false; a.ended = false; };

  var CAM = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  var PIN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  function aplikacja() {
    var a = S.a;
    var scr = { home: aHome, detail: aDetail, photos: aPhotos, ride: aRide, ret: aReturn, done: aDone, wal: aWal, top: aTop, book: aBook, acc: aAcc }[a.scr]();
    var tabOf = { book: 'book', wal: 'wal', top: 'wal', acc: 'acc' }[a.scr] || 'res';
    var tabs = [['res', 'Rezerwacje', 'home'], ['book', 'Zarezerwuj', 'book'], ['wal', 'Portfel', 'wal'], ['acc', 'Konto', 'acc']].map(function (t) {
      return '<button type="button" class="tab' + (tabOf === t[0] ? ' on' : '') + '"' + (tabOf === t[0] ? ' aria-current="page"' : '') + act('aScr', t[2]) + '><i></i>' + t[1] + '</button>';
    }).join('');
    return '<div class="v-app"><div class="phone"><div class="scr" id="appscr">' + scr + '</div><nav class="tabs" aria-label="Nawigacja aplikacji">' + tabs + '</nav></div>' +
      '<div class="aside"><h2>Scenariusz</h2><p>Czwartek 19.11.2026, 14:52. Instruktor Marek Zieliński (SUPER OSK MIKRUS) ma rezerwację R-2611-0147: Clio (automat) + tor 2, 15:00–16:00.</p><ol><li>Otwórz rezerwację i szlaban.</li><li>Zrób 5 zdjęć stanu auta i otwórz Clio.</li><li>Zakończ najem, przejdź checklistę zwrotu.</li><li>Wybierz: dopłata za paliwo z portfela albo tankowanie.</li><li>Zakładka Portfel: saldo, historia, doładowanie (Apple Pay, BLIK, karta).</li></ol><p class="muted">Wszystkie dane są przykładowe.</p></div></div>';
  }
  function aHome() {
    var a = S.a;
    return '<div><div style="font-size:13px;color:#5f6368">czw., 19.11.2026 · 14:52</div><h1 style="font-size:24px;margin-top:2px">Cześć, Marek</h1><div style="font-size:13px;color:#5f6368">SUPER OSK MIKRUS · instruktor kat. B</div></div>' +
      '<button type="button" class="hero"' + act('aScr', 'detail') + '><span style="font-size:12px;color:#f5c400;font-weight:700;letter-spacing:.04em">DZIŚ · START ZA 8 MIN</span><span style="font-size:20px;font-weight:700">15:00–16:00</span><span style="font-size:14px">Clio (automat) + tor 2</span><span style="font-size:13px;color:#c3c7e0">WORD Gorzów Wlkp. · R-2611-0147 · ' + (a.ended ? 'zakończona' : a.gate ? 'na placu' : 'opłacona') + '</span></button>' +
      '<h2 style="margin:6px 0 0;font-size:15px">Kolejne rezerwacje</h2>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:2px"><b style="font-size:15px">pt. 20.11 · 16:00–16:30</b><span style="font-size:14px;color:#5f6368">Plac kat. B – pojazd OSK · FZ 4521K</span></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:2px"><b style="font-size:15px">pon. 23.11 · 10:00–11:00</b><span style="font-size:14px;color:#5f6368">Najem auta WORD · Fiat 500e (elektryk) · miasto</span></div>';
  }
  function aDetail() {
    var a = S.a;
    return '<button class="back" type="button"' + act('aScr', 'home') + '>‹ Rezerwacje</button><div><div style="font-size:13px;color:#5f6368">R-2611-0147 · dziś 15:00–16:00</div><h1 style="margin-top:2px">Clio (automat) + tor 2</h1></div>' +
      '<div class="near">' + PIN + '<span>Jesteś przy obiekcie · 40 m od szlabanu</span></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="cap">SZLABAN · WJAZD NA PLAC</div>' +
      (a.gate ? '<div style="font-size:14px;color:#1e6b34">Szlaban otwarty 14:52 · wjazd zapisany, obecność potwierdzona</div>' : '<button class="big yel" type="button"' + act('aGate') + '>Otwórz szlaban</button>') + '</div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="cap">AUTO · RENAULT CLIO (AT)</div><div style="font-size:14px">Miejsce postojowe nr 3 · kluczyki w schowku</div><button class="big navy" type="button"' + act('aScr', 'photos') + '>Otwórz auto</button><div style="font-size:12px;color:#5f6368">Najpierw 5 zdjęć stanu auta. Otwieranie aktywne od 14:55 do 16:00.</div></div>' +
      '<div class="card"><div class="r"><span>Tor</span><span>2 (kat. B)</span></div><div class="r"><span>Zapłacono</span><span>180,00 zł</span></div><div class="r"><span>Faktura</span><span>FV 147/11/2026 · SUPER OSK MIKRUS</span></div></div>';
  }
  function aPhotos() {
    var a = S.a;
    var n = a.ph.filter(Boolean).length;
    var tiles = ['Przód', 'Tył', 'Lewy bok', 'Prawy bok', 'Deska rozdzielcza'].map(function (l, i) {
      return '<button type="button" class="tile' + (a.ph[i] ? ' on' : '') + '" aria-pressed="' + a.ph[i] + '"' + act('aPh', i) + '>' + CAM + '<span>' + l + '</span><small>' + (a.ph[i] ? 'zrobione' : 'dotknij, by zrobić') + '</small></button>';
    }).join('');
    var ready = n === 5 && a.mark;
    return '<button class="back" type="button"' + act('aScr', 'detail') + '>‹ Rezerwacja</button><h1>Stan auta przed jazdą</h1><p style="margin:0;font-size:14px;color:#5f6368">Zrób zdjęcia – chronią Cię przy rozliczeniu szkód.</p>' +
      '<div class="tiles">' + tiles + '</div><div class="card" style="font-size:14px;display:flex;flex-direction:column;gap:4px"><b>Odczyt automatyczny (telematyka)</b><span>Paliwo 6/8 · ok. 33 l</span><span>Przebieg 48 212 km</span></div>' +
      '<div class="card" style="display:flex;flex-direction:column;gap:6px"><div class="cap">OZNACZENIE POJAZDU SZKOLENIOWEGO</div><label class="chk"><input type="checkbox"' + ck(a.mark) + act('aMark') + '> Założyłem oznaczenie SUPER OSK MIKRUS (nazwa i adres) na prawym i lewym boku</label><span style="font-size:12px;color:#5f6368">Wymóg: § 3 ust. 4 rozporządzenia w sprawie szkolenia osób ubiegających się o uprawnienia do kierowania pojazdami. Auto WORD jeździ dla wielu OSK – instruktor zakłada magnesy swojego OSK. Tablica „L” jest na aucie na stałe.</span></div>' +
      (ready ? '<button class="big navy" type="button"' + act('aScr', 'ride') + '>Otwórz auto</button>' : '<button class="big" type="button" disabled>Otwórz auto · zdjęcia ' + n + '/5' + (a.mark ? '' : ' · oznaczenie OSK') + '</button>');
  }
  function aRide() {
    return '<div class="timer"><span style="font-size:13px;color:#c3c7e0">Do końca najmu</span><b>58:12</b><span style="font-size:13px;color:#f5c400">koniec 16:00 · tor 2</span></div>' +
      '<div class="card" style="font-size:14px;display:flex;flex-direction:column;gap:6px"><span>Auto otwarte 14:56 · kluczyki w schowku</span><span style="color:#5f6368">Jazda po placu (tor 2) i po mieście. Wróć na miejsce nr 3 przed 16:00.</span></div>' +
      '<button class="big out" type="button">Zgłoś usterkę</button><button class="big out" type="button">Zadzwoń do obsługi WORD</button><button class="big yel" type="button"' + act('aScr', 'ret') + '>Zakończ najem i zamknij auto</button>';
  }
  function aReturn() {
    var a = S.a;
    var items = ['Kluczyki w schowku', 'Auto na miejscu nr 3', 'Nic nie zostało w aucie', 'Zdjąłem oznaczenie OSK – magnesy zabieram'].map(function (l, i) {
      return '<label class="chk"><input type="checkbox"' + ck(a.k[i]) + act('aK', i) + '> ' + l + '</label>';
    }).join('');
    var ok = a.k.every(Boolean);
    return '<button class="back" type="button"' + act('aScr', 'ride') + '>‹ Jazda</button><h1>Zwrot auta</h1><div class="card" style="display:flex;flex-direction:column">' + items + '</div>' +
      '<div class="card" style="font-size:14px;display:flex;flex-direction:column;gap:4px"><b>Paliwo przy zwrocie: 5/8 · ok. 27 l</b><span style="color:#9b1c1c">Brakuje ok. 6 l względem odbioru (6/8).</span></div>' +
      '<label class="opt"><input type="radio" name="fuel"' + ck(a.fuel === 'card') + act('aFuel', 'card') + '><span><b>Pobierz z portfela: 6 l × 10 zł = 60,00 zł</b><br>W portfelu: ' + zl(S.wal.bal) + ' · faktura na SUPER OSK MIKRUS.</span></label>' +
      '<label class="opt"><input type="radio" name="fuel"' + ck(a.fuel === 'tank') + act('aFuel', 'tank') + '><span><b>Zatankuję teraz</b><br>Auto zostaje otwarte jeszcze 15 min. Stacja: 1,2 km.</span></label>' +
      '<button class="big' + (ok ? ' yel' : '') + '" type="button"' + dis(!ok) + act('aFinish') + '>Zamknij auto</button>';
  }
  function aDone() {
    var card = S.a.fuel === 'card';
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 0"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1e6b34" stroke-width="2" role="img" aria-label="Zakończono"><circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.2 3L17 9"/></svg><h1>Najem zakończony</h1><span style="font-size:14px;color:#5f6368">Auto zamknięte 15:58 · miejsce nr 3</span></div>' +
      '<div class="card"><div class="r"><span>Rezerwacja</span><span>180,00 zł · z portfela</span></div><div class="r"><span>Paliwo</span><span>' + (card ? '60,00 zł · z portfela' : 'zatankowano · 0,00 zł') + '</span></div><div class="r"><span>Saldo portfela</span><b>' + zl(S.wal.bal) + '</b></div><div class="r"><span>Faktury</span><span>SUPER OSK MIKRUS</span></div></div>' +
      '<p style="margin:0;font-size:13px;color:#5f6368">' + (card ? 'Dopłatę pobrano z portfela po odczycie telematyki. Fakturę wystawiamy na SUPER OSK MIKRUS.' : 'Poziom paliwa po tankowaniu sprawdzi telematyka przy zamknięciu auta.') + '</p>' +
      '<button class="big navy" type="button"' + act('aScr', 'wal') + '>Zobacz portfel</button><button class="big out" type="button"' + act('aRestart') + '>Wróć do rezerwacji</button>';
  }
  A.aTopUp = function () { S.a.topAmt = S.a.topAmt || 25; S.a.scr = 'top'; };
  A.aTopAmt = function (v) { S.a.topAmt = Number(v); };
  A.aTopConfirm = function () { walletTopUp(S.a.topAmt); S.a.scr = 'wal'; S.a.toast = 'Doładowano ' + zl(S.a.topAmt); };
  function aWal() {
    var t = S.a.toast; S.a.toast = '';
    return '<h1>Portfel</h1>' + (t ? '<div class="near">' + t + ' · ' + METHODS[S.wal.method] + '</div>' : '') +
      '<div class="walcard"><span class="bl">Środki w portfelu</span><b>' + zl(S.wal.bal) + '</b><button type="button" class="big yel"' + act('aTopUp') + '>Doładuj portfel</button></div>' +
      '<p style="margin:0;font-size:13px;color:#5f6368">Z portfela płacisz za rezerwacje i dopłaty (paliwo, energia). Zwroty wracają na saldo. Faktury wystawiamy na SUPER OSK MIKRUS przy każdej usłudze.</p>' +
      '<h2 style="margin:4px 0 0;font-size:15px">Historia</h2><div class="card">' + S.wal.hist.map(function (h) {
        return '<div class="r"><span>' + h.t + '<br><span style="color:#5f6368;font-size:12px">' + h.d + ' · ' + h.s + '</span></span><span style="white-space:nowrap;font-weight:500;color:' + (h.v > 0 ? '#1e6b34' : '#1f2328') + '">' + signed(h.v) + '</span></div>';
      }).join('') + '</div>';
  }
  function aTop() {
    return '<div class="topbar"><button class="back" type="button" aria-label="Zamknij"' + act('aScr', 'wal') + '>✕</button><b>Portfel</b><span></span></div>' + topUpBody(S.a, 'aTop');
  }
  function aBook() {
    return '<h1>Zarezerwuj</h1><p style="margin:0;font-size:14px;color:#5f6368">Rezerwacja otwiera widżet WORD z Twoim kontem – bez ponownego logowania.</p><button class="big yel" type="button"' + act('goView', 'strona') + '>Otwórz rezerwację WORD Gorzów</button>';
  }
  function aAcc() {
    return '<h1>Konto</h1><div class="card">' + [['Instruktor', 'Marek Zieliński'], ['Uprawnienia', 'kat. B · zweryfikowane'], ['OSK', 'SUPER OSK MIKRUS'], ['Umowa najmu floty WORD', '5 aut · aktywna do 31.10.2027'], ['Portfel', zl(S.wal.bal)], ['Metoda doładowania', METHODS[S.wal.method]], ['Aktywne urządzenie', 'ten telefon']].map(function (r) {
      return '<div class="r"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>';
    }).join('') + '</div><div class="card" style="font-size:13px;color:#5f6368">Nie stawił się w ostatnich 30 dniach: 0 z 3 dopuszczalnych.</div>';
  }

  /* ---------------- render i zdarzenia ---------------- */
  function render() {
    var keepAppScroll = S.view === 'aplikacja' && document.getElementById('appscr') ? document.getElementById('appscr').scrollTop : 0;
    var v = { panel: panel, strona: strona, aplikacja: aplikacja }[S.view]();
    root.innerHTML = demoBar() + v;
    // etykiety kolumn dla tabel układanych w karty na telefonie
    Array.prototype.forEach.call(root.querySelectorAll('.v-panel table'), function (t) {
      var heads = Array.prototype.map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent; });
      Array.prototype.forEach.call(t.querySelectorAll('tbody tr'), function (tr) {
        Array.prototype.forEach.call(tr.children, function (td, i) { if (heads[i]) td.setAttribute('data-label', heads[i]); });
      });
    });
    document.body.classList.toggle('noscroll', !!(S.view === 'panel' && S.p.menu));
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
