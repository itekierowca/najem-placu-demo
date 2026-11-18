# Najem placu i aut WORD – demo

Klikalna wersja pokazowa modułu najmu placu manewrowego i pojazdów WORD dla PanelWORD (Prawko.pl / e-Kierowca).

**Dane:** nazwy, numery rejestrowe i zdawalność OSK pod nadzorem UM w Gorzowie Wlkp. pochodzą z rejestru OSK i danych egzaminacyjnych opracowanych w [Jedna miara](https://jedna-miara.netlify.app). **Wszystko inne jest fikcyjne**: instruktorzy, rezerwacje, umowy najmu, transakcje, faktury, obciążenia, nieobecności, numery rejestracyjne pojazdów, stawki i prowizja 5% – służą wyłącznie do pokazania działania. Aplikacja nie ma backendu i niczego nie zapisuje.

## Trzy perspektywy

| Widok | Adres | Co pokazuje |
| --- | --- | --- |
| Panel WORD | `#panel` | Rozliczenia (KPI, sprzedaż dzienna, podział na produkty i OSK, transakcje, prowizja), plan dnia, rezerwacje, umowy najmu aut, rozliczenia (paliwo itp.), zasoby i cennik, instruktorzy, ustawienia |
| Strona WORD | `#strona` | Widżet rezerwacji osadzony na stronie WORD: usługa → termin → logowanie → zgody → płatność → potwierdzenie; rejestracja instruktora |
| Aplikacja instruktora | `#aplikacja` | Telefon: rezerwacja, otwarcie szlabanu, zdjęcia stanu auta, otwarcie Clio, zwrot z rozliczeniem paliwa (10 zł/l) |

Flota WORD: 5 aut z automatyczną skrzynią – Renault Clio E-Tech (egzaminacyjne), Toyota Yaris Hybrid, BYD Dolphin, Fiat 500e, Škoda Epiq 35.

Scenariusz: WORD Gorzów Wlkp., czwartek 19.11.2026, rezerwacja R-2611-0147 (Renault Clio z automatyczną skrzynią + stanowisko B2, 15:00–16:00).

## Portfel

Płatności idą przez portfel instruktora: doładowanie 10 / 25 / 50 / 100 zł (Apple Pay, BLIK, karta), opłata rezerwacji i dopłat za paliwo/energię z salda, zwroty na saldo. Przy aucie WORD po płatności musi zostać min. 50 zł na ewentualną dopłatę. Portfel jest wspólny dla widoków „Strona WORD” i „Aplikacja instruktora”; w panelu – saldo portfeli, doładowania i filtr „Doładowania”.

## Uruchomienie

Statyczna strona bez kroku budowania: otwórz `index.html` w przeglądarce albo uruchom dowolny serwer plików, np.

```
python3 -m http.server 8000
```

## Publikacja

GitHub Pages: *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.
