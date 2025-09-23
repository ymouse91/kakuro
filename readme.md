# Kakuro App

Kakuro on klassinen numeroristikko, jossa täytät ruudukon numeroilla 1–9 niin, että jokaisen rivin tai sarakkeen ”sanan” summa vastaa vihjettä, eikä sama numero saa toistua saman sanan sisällä. Tämä sovellus tarjoaa kevyen ja mobiiliystävällisen version Kakurosta, joka toimii suoraan selaimessa.

## Ominaisuudet

- 🎮 Classic-tila: perinteinen kakuro
- 🔢 Latin-tila (9×9): latinalaisruudukon kaltainen variaatio (vain 9×9)
- 🎛️ Siemenperusteinen arvonta: sama siemen → sama ruudukko
- 📱 Toimii iPhonella ja iPadilla: responsiivinen ruudukko ja virtuaalinäppäimistö
- 🌀 Latausindikaattori (spinner) ja gradienttikehys ruudukon ympärillä
- 🧩 Tarkistukset ja palautteet: optiona vihjeitä ja värikorostuksia

## Pelin säännöt

- Täytä jokainen valkoinen ruutu numerolla 1–9
- Jokaisen vihjeen (summa) mukainen vaaka- tai pystyrivi tulee täsmälleen täyttää siihen asti jatkuvilla numeroilla
- Sama numero ei saa toistua saman summan alueella
- Tavoitteena on täyttää koko ruudukko sääntöjen mukaan

## Käyttö

1. Valitse ruudukon koko (esim. 8×8, 9×9, 10×10)
2. Valitse tila:
   - classic kaikille ko’oille
   - latin vain 9×9
3. Syötä halutessasi siemen (esim. `KAKURO-2025`), jotta sama tehtävä on uudelleentoistettavissa
4. Paina **Uusi ruudukko** luodaksesi tehtävän
5. Syötä numerot ruudukkoon hiirellä, näppäimistöllä tai mobiilinumeropadilla

## Asennus ja ajaminen

### Paikallisesti

Ei riippuvuuksia — riittää staattinen palvelu:

```bash
python -m http.server 8000
```

Avaa selaimessa osoite: [http://localhost:8000/](http://localhost:8000/)

Voit myös avata `index.html` suoraan selaimella, mutta pieni http-palvelin vastaa paremmin tuotantoa.

### GitHub Pages

1. Lisää koodi repositorioosi (esim. `main`-haaraan)
2. Avaa *Settings → Pages → Source: Deploy from a branch* ja valitse juuri (`/`)
3. Odota hetki ja avaa luotu osoite

### (Valinnainen) PWA

Repo voi sisältää:
- `manifest.json` (ikonit, sovelluksen nimi)
- `service-worker.js` (offline-välimuisti)

Asenna selaimen *Install / Lisää Kotiin* -toiminnolla.

## Kehitys

- Sovellus on toteutettu **HTML + CSS + JavaScript**
- Ei build-järjestelmää, ei riippuvuuksia
- Testattu PC:llä, iPadilla ja iPhonella

Kehitysvinkkejä:
- Optimoi DOM-päivitykset yhteen `requestAnimationFrame`-kutsuun
- Käytä `classList`-togglausta tyyleihin, vältä raskaita inline-muutoksia
- Näytä spinneri, kun ruudukkoa luodaan

## Tiedostorakenne

```
/
├─ index.html          # Pääsivu
├─ styles.css          # Tyylit
├─ app.js              # Päälogiikka
├─ assets/             # Kuvakkeet, spinnerit
├─ manifest.json       # (valinnainen) PWA-manifesti
└─ service-worker.js   # (valinnainen) offline-käyttö
```

## Vianmääritys

- Latin-tila ei toimi muilla kuin 9×9 → tämä on tarkoituksellista
- Ruudukko ei skaalaudu iPhonessa → käytä vaakasuuntaa tai pienennä zoomausta
- PWA ei päivity → tyhjennä selaimen välimuistit (*Clear storage / Unregister service worker*)

## Lisenssi

Lisensoitu projektin juuren `LICENSE`-tiedoston mukaisesti. Jos lisenssi puuttuu, lisää sopiva avoin lisenssi (esim. MIT).

## Kiitos!

Palaute, bugiraportit ja parannusehdotukset ovat tervetulleita.  
Hyviä ratkaisuhetkiä! 🧩

