# Direzione immagini — Mila Ecosystem

Riferimento per ogni immagine dell'ecosistema, generata con AI o fotografata.
Deriva dal punto 5 del brief e dalle immagini della web app originale che
funzionano già bene.

---

## 1. Il principio

> **La palette è il filo. La cultura è la variazione.**

Ogni donna che compare è diversa dalle altre per età, etnia, cultura e fisico.
Quello che le tiene insieme non è l'aspetto: è il colore. Bianco, crema e verde
salvia attraversano tutte le immagini, e quando una donna appartiene a una
cultura diversa **cambia la forma dell'abito, non la sua palette**.

Un gele nigeriano in salvia. Un hijab in lino crema. Un kurta bianco ricamato.
Un velo avorio. La forma dice da dove viene, il colore dice che è di casa qui.

Questo è il cuore del punto 5 e il motivo per cui il set attuale funziona.

---

## 2. Palette

Sono gli stessi token del sito (`src/index.css`), così immagine e interfaccia
non litigano mai.

| Ruolo nell'immagine | Colore | Token |
| --- | --- | --- |
| Abiti chiari, luce | `#FEFAF1` crema · bianco puro | `--color-ivory` |
| Abiti e vegetazione | `#B7CDB7` → `#809B80` salvia | `--color-sage` / `--color-sage-deep` |
| Pietra, sabbia, intonaco | `#F4ECDE` · `#DCCFBC` | `--color-ivory-2` / `--color-blush-deep` |
| Incarnati, legno, terra | toni bruni caldi verso `#31261E` | `--color-ink` |
| Luce di taglio, dettagli | `#D9B06B` oro, **pochissimo** | `--color-gold` |

**Fuori palette:** blu, turchese, magenta, rosso acceso, arancioni saturi,
verde smeraldo o menta. Il verde è sempre *polveroso*, mai brillante.

---

## 3. Abbigliamento

- Tuniche bianche e tuniche verde salvia — il capo firma dell'ecosistema
- Tessuti morbidi: lino, cotone lavato, mussola, seta opaca
- Eleganti ma naturali: nessuna passerella, nessun tailleur, nessun logo
- Ricami tono su tono, mai stampe a contrasto
- Gioielli minimi: un filo d'oro sottile, niente bigiotteria vistosa

### Abito e cultura

Quando la donna appartiene a una cultura specifica, si tiene la **silhouette
autentica** e si porta il **colore nella palette**:

| Cultura | Capo | Come |
| --- | --- | --- |
| Africa occidentale | gele / boubou | salvia o avorio, ricamo tono su tono |
| Nord Africa, Medio Oriente | hijab, kaftano | lino crema o salvia, drappeggio morbido |
| Asia meridionale | kurta, dupatta, sari | bianco ricamato, bordo salvia |
| Asia orientale | tunica a collo alto, lino | crema, linee pulite |
| Europa, Americhe | tunica, abito lungo | bianco o salvia, scollo semplice |

Mai travestimento, mai folklore da cartolina: l'abito deve sembrare quello che
quella donna indosserebbe davvero.

---

## 4. Inclusività — come si verifica

Non basta dichiararla. Si controlla, immagine per immagine e su tutto il set.

**In una foto di gruppo** devono convivere almeno:

- [ ] tre fasce d'età diverse (la community va dai 17 ai 62 anni, più bambine)
- [ ] tre carnagioni diverse, con almeno una pelle scura
- [ ] due segni culturali diversi (copricapo, ricamo, acconciatura)
- [ ] corporature diverse — non solo taglie piccole
- [ ] capelli diversi: lisci, ricci, afro, coperti, grigi

**Su tutto il set** vale una regola in più: nessuna donna deve essere sempre
quella al centro, e le donne non bianche non devono comparire solo nei gruppi.
Devono avere anche i primi piani, i ritratti, gli spazi da sole.

---

## 5. Luce, ambientazione, inquadratura

**Luce** — sempre naturale e diffusa: mattina presto o tardo pomeriggio, cielo
velato, luce da finestra. Ombre morbide. Mai flash diretto, mai controluce
arancione forte, mai notte.

**Ambientazione** — giardini fioriti, muri di pietra chiara, rose, ulivi,
interni caldi e minimali con piante, tessuti, candele. Spazi che sembrano
abitati, non set.

**Inquadratura** — profondità di campo media, sfondo morbido ma leggibile.
Nessun grandangolo deformante. Le donne si guardano tra loro più di quanto
guardino in camera.

**Tono** — presenza, non posa. Gesti veri: una mano sulla spalla, uno sguardo
di lato, una risata a metà.

---

## 6. Cosa evitare

- La **donna sola** come eroina al centro della scena — questo è un ecosistema
  di community, e il brief chiede esplicitamente il concept con più donne
- Ambienti da ufficio, vetri, superfici corporate
- Tramonti arancioni e cieli saturi: bellissimi, ma fuori palette
- Sorrisi da stock photo, pose frontali da brochure
- Pelle levigata al punto da sembrare plastica
- Un'unica etnia per immagine quando l'immagine è di gruppo

---

## 7. Impianto di prompt

Base riutilizzabile, in inglese perché i modelli rendono meglio. Si sostituisce
solo ciò che sta fra parentesi quadre.

```
[SOGGETTO E AZIONE].
Wardrobe: flowing tunics and soft draped fabrics in warm white, cream and dusty
sage green; washed linen and cotton; tone-on-tone embroidery; no prints, no logos,
minimal thin gold jewellery.
Cast: women of visibly different ages, ethnicities, body types and hair textures —
including dark skin, grey hair, covered hair and natural afro hair. Cultural dress
reinterpreted in the same cream-and-sage palette.
Setting: [AMBIENTE].
Light: soft diffused natural daylight, overcast or early morning, gentle shadows,
no harsh flash, no orange sunset.
Palette: warm cream #FEFAF1, dusty sage #809B80, pale stone #F4ECDE, warm brown
skin tones. No blue, no teal, no saturated colour.
Style: natural editorial photography, medium depth of field, real skin texture,
candid unposed gestures, warm and luminous, elegant and calm.
```

**Rapporti d'aspetto** — hero e sezioni larghe `3:2`; ritratti e colonne `3:4`;
tessere quadrate `1:1`; la colonna della call `9:16`.

---

## 8. Stato del set attuale

Verificato guardando tutte e 14 le immagini in `public/images`.

| Immagine | Giudizio |
| --- | --- |
| `hero-circle`, `hero-circle-portrait` | ✅ Esattamente la direzione: gruppo numeroso, età ed etnie diverse, gele e veli in salvia e bianco |
| `garden-circle` | ✅ Cerchio intergenerazionale in giardino fiorito, palette perfetta |
| `community-circle`, `community-circle-crop` | ✅ Multigenerazionale, abiti salvia, muro di pietra e rose |
| `avatar-1…4` | ✅ Quattro donne davvero diverse — corona di fiori, hijab salvia, gele, anziana con velo |
| `founder-story` | ✅ Mano di bambina nella mano della nonna, gonna salvia |
| `coaching`, `coaching-square` | ⚠️ In palette, ma le due donne si somigliano troppo: è il punto debole del set sull'inclusività |
| `martina-call` | ❌ Fondo turchese da ufficio, blazer verde smeraldo saturo: fuori palette su tutta la linea |
| `hero-photo` | ❌ Donna sola e tramonto arancione — contraddice sia la palette sia il concept di community del punto 7 |

**Da rifare: tre immagini.** Il resto del set si tiene.

### Prompt pronti

**`hero-photo` → gruppo (3:2)**

```
A group of eight women and two young girls standing close together outdoors in a
sunlit garden, turned slightly toward one another, some laughing, one with a hand
on another's shoulder.
[+ blocco base]
Setting: a walled garden with pale stone, climbing roses and olive trees.
```

**`martina-call` → ritratto della call (9:16)**

```
A woman in her early thirties with long dark hair sitting by a large window in a
calm, warm room, holding a phone to her ear, listening with a soft attentive
expression, plants and a linen curtain behind her.
[+ blocco base]
Setting: a bright minimal interior with wooden surfaces, greenery and natural linen.
```

**`coaching` → due donne diverse fra loro (3:2)**

```
Two women facing each other on a low sofa in a warm minimal room, mid-conversation,
one listening with her hand resting on her knee. One is in her twenties with deep
brown skin and natural afro hair; the other is in her fifties with grey hair and a
sage linen tunic.
[+ blocco base]
Setting: a calm sunlit room with plants, a lit candle and soft textiles.
```

---

## 9. Pipeline

1. Salvare l'originale a piena risoluzione in `_ref/` (cartella ignorata da git)
2. Aggiungere la voce in `scripts/optimize-images.mjs`
3. `npm run images` → genera il WebP ottimizzato in `public/images`
4. Aggiornare il testo alternativo in `src/data/content.ts`

### Testo alternativo

Si descrive **chi c'è e cosa succede**, non l'estetica. Si nominano età e
provenienze quando sono visibili e rilevanti, perché l'inclusività deve
arrivare anche a chi la pagina la ascolta invece di guardarla.

- ✅ «Cerchio di donne e bambine di culture diverse in un giardino fiorito»
- ❌ «Bella immagine di community femminile»
