# Demo – najem placu (i aut) WORD Gorzów Wlkp.

## Faza 1 · najem placu (domyślny widok)
Odpowiedź na problem WORD: przy każdej rezerwacji wynajmujący OSK ręcznie wpisuje nazwę, NIP, numer umowy i telefon – to frustruje instruktorów, a WORD dostaje puste, niepewne rezerwacje i błędy w danych.
- OSK i instruktorzy wpisani na stałe z rejestru (UM Gorzów Wlkp.); numery telefonów instruktorów zgłasza OSK.
- Logowanie: numer telefonu + jednorazowy kod SMS. Dane OSK trafiają do rezerwacji automatycznie.
- Tylko usługi najmu placu: kat. B (tory 1–4, 37 zł), kat. C (tor 6, 58 zł), B+E/C+E/D/T (tor 5, 58 zł), slot 30 min.
- Ścieżka jak dziś na stronie WORD: usługa → tor → kalendarz tygodniowy → (logowanie SMS) → potwierdzenie bez formularza.
- Panel WORD, nowa sekcja „Najem placu”: 1. Rezerwacje (plan dnia + lista), 2. Zasoby i cennik (cennik, dostępność tygodniowa, blokady, zasady), 3. OSK i instruktorzy (rejestr, telefony), 4. Rozliczenia (faktury zbiorcze na OSK).
- Bez płatności online – rozliczenie fakturą zbiorczą za miesiąc wg umowy z OSK.
Scenariusz: zakładka 1 · Strona WORD (telefon 600 100 200, kod 4821) → 2 · Panel WORD.

## Faza 2 · auta WORD, portfel, aplikacja instruktora
Przełącznik „Faza 2” w pasku demo. Zawartość jak wcześniej:

Klikalna wersja pokazowa modułu najmu placu manewrowego i pojazdów WORD dla PanelWORD (Prawko.pl / e-Kierowca).

**Dane:** nazwy, numery rejestrowe i zdawalność OSK pod nadzorem UM w Gorzowie Wlkp. pochodzą z rejestru OSK i danych egzaminacyjnych opracowanych w [Jedna miara](https://jedna-miara.netlify.app). **Wszystko inne jest fikcyjne**: instruktorzy, rezerwacje, umowy najmu, transakcje, faktury, obciążenia, nieobecności, numery rejestracyjne pojazdów, stawki i prowizja 5% – służą wyłącznie do pokazania działania. Aplikacja nie ma backendu i niczego nie zapisuje.

## Trzy perspektywy

| Widok | Adres | Co pokazuje |
| --- | --- | --- |
| Panel WORD | `#panel` | Rozliczenia (KPI, sprzedaż dzienna, podział na produkty i OSK, transakcje, prowizja), plan dnia, rezerwacje, umowy najmu aut, rozliczenia (paliwo itp.), zasoby i cennik, instruktorzy, ustawienia |
| Strona WORD | `#strona` | Widżet rezerwacji osadzony na stronie WORD: usługa → termin → logowanie → zgody → płatność → potwierdzenie; rejestracja instruktora |
| Aplikacja instruktora | `#aplikacja` | Telefon: rezerwacja, otwarcie szlabanu, zdjęcia stanu auta, otwarcie Clio, zwrot z rozliczeniem paliwa (10 zł/l) |

Flota WORD: 5 aut z automatyczną skrzynią – Renault Clio E-Tech (egzaminacyjne), Toyota Yaris Hybrid, BYD Dolphin, Fiat 500e, Škoda Fabia 1.0 TSI DSG (benzyna).

Scenariusz: WORD Gorzów Wlkp., czwartek 19.11.2026, rezerwacja R-2611-0147 (Renault Clio z automatyczną skrzynią + tor 2, 15:00–16:00).

## Portfel

Płatności idą przez portfel instruktora: doładowanie 10 / 25 / 50 / 100 zł (Apple Pay, BLIK, karta), opłata rezerwacji i dopłat za paliwo/energię z salda, zwroty na saldo. Przy aucie WORD po płatności musi zostać min. 50 zł na ewentualną dopłatę. Portfel jest wspólny dla widoków „Strona WORD” i „Aplikacja instruktora”; w panelu – saldo portfeli, doładowania i filtr „Doładowania”.

## Uruchomienie

Statyczna strona bez kroku budowania: otwórz `index.html` w przeglądarce albo uruchom dowolny serwer plików, np.

```
python3 -m http.server 8000
```

## Publikacja

GitHub Pages: *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.

## Październik 2026 – model pełnego miesiąca
W Panelu WORD → Rozliczenia przycisk „Październik 2026” pokazuje pełny miesiąc (22 dni robocze). Wszystkie kwoty są obliczone przy założeniu: 5 aut × 4 h najmu po mieście dziennie, auto + tor łącznie 4 h/dzień, plac z autem OSK 4 h/dzień, 2 dopłaty paliwowe dziennie, stawki z cennika i prowizja 5%. Zestawienie: `zestawienie-word-gorzow-2026-10.pdf`.

## Fakty z obecnego systemu WORD Gorzów (stan 19.11.2026)
- Usługi i ceny (30 min): plac kat. B – tory 1–4 – 37 zł; plac kat. C – tor 6 – 58 zł; plac kat. B+E, C+E, D, T – tor 5 – 58 zł.
- Ścieżka obecnie: wybór usługi → wybór toru (1–4) → kalendarz tygodniowy (sloty 30 min, weekendy „brak terminów”) → formularz bez logowania: nazwa OSK, NIP OSK, numer umowy, tel., e-mail, instruktor (opcjonalnie), uwagi, regulamin, zgoda SMS.
- Adres: ul. Podmiejska 18, 66-400 Gorzów Wlkp., tel. 95 732 43 77, sekretariat@wordgorzow.pl.
- W demo: plac kat. B 37 zł, tory 1–4 / 5 / 6, okno placu 15:00–21:00 (plac wydzielony w czasie egzaminów), brak terminów w weekendy, numer umowy OSK z WORD i przypomnienie SMS. Auto WORD + tor = 90 zł (plac 37 + auto 53).

## Auta egzaminacyjne
Wszystkie 5 aut to auta egzaminacyjne zarządzane przez WORD. Każde jeździ na egzaminach maks. 3 h dziennie (harmonogram rozłożony między auta), pozostały czas 8:00–21:00 idzie na najem. Plac dla OSK jest dostępny 15:00–21:00, bo w czasie egzaminów musi być wydzielony.

## Scenariusz klikania (3 kroki)
1. **Strona WORD** (domyślnie, zaznaczony „Plac kat. B – pojazd OSK”) – wybór usługi, terminu, logowanie, płatność z portfela.
2. **Aplikacja instruktora** – pokazuje właśnie zrobioną rezerwację: plac → szlaban i pojazd OSK; najem auta → otwarcie auta, zdjęcia, zwrot; auto + tor → szlaban i auto. Dopłata za paliwo tylko przy autach spalinowych/hybrydach.
3. **Panel WORD** – nowa rezerwacja widoczna w zakładce Rezerwacje; rozliczenia, październik jako model.
