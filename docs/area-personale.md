# Area personale — come è fatta, e dove si innesta il server

Riferimento per i punti 20-31 e 34 del brief. Serve a una cosa sola: quando
arriveranno l'accesso e il database, si deve sapere in mezz'ora dove mettere le
mani.

> **Punto 34:** «l'importante è che la piattaforma venga sviluppata con una
> struttura abbastanza modulare da consentire di aggiungere queste cose
> successivamente».

---

## 1. La regola che tiene tutto

**Niente dati finti.** Senza account, percorsi, prenotazioni ed eventi sono
vuoti per davvero, e ogni scheda mostra il suo stato vuoto — che dice cosa
comparirà lì e offre la strada più corta per arrivarci.

Per vedere l'area da piena c'è un interruttore, in cima alla pagina: **dati di
esempio**. Mentre è acceso, ogni scheda porta il segnalino «Dati di esempio» e
sotto l'interruttore c'è scritto cosa sta succedendo. L'esempio vive in un file
solo, `src/data/esempio.ts`, e i suoi nomi arrivano da `content.ts`: se un
percorso cambia nome, l'esempio lo chiama subito nel modo giusto.

Un 62% di avanzamento inventato chiede a chi guarda di fingere che sia vero, e
rende impossibile distinguere ciò che funziona da ciò che è scenografia.

---

## 2. Cosa funziona già oggi, senza server

| Zona | Punto | Stato |
| --- | --- | --- |
| Frase del giorno | 24 | Funziona. Deterministica sulla data, ciclo di 32 frasi. |
| Millina | 21-22 | Funziona. Motore in `src/lib/millina/`, banco di prova con `npm run millina`. |
| Ruota della Vita | 23 | Funziona. Dieci voci, analisi dentro lo stesso motore di Millina. |
| Diario | 25 | Funziona. Pagine nel `localStorage`, con il limite dichiarato in pagina. |
| Invita un'amica | 26 | Funziona. Codice, link, copia, condivisione, e cattura di `?invito=`. |
| Aggiungi al calendario | 29 | Funziona. File `.ics` conforme all'RFC 5545, generato nel browser. |
| Bentornata | 31 | Funziona a metà: il nome è chiesto una volta e resta su quel dispositivo. |
| I tuoi percorsi | 27 | Struttura pronta, dati vuoti finché non c'è l'account. |
| Bacheca e agenda | 28-30 | Struttura pronta, dati vuoti finché non c'è l'account. |

**Nessun sistema a punti**, come chiedono i punti 20 e 34: nel modello dei dati
non esiste nessun campo che assomigli a un punteggio.

---

## 3. I file

```
src/lib/account/
  types.ts      il contratto: OwnedItem, Booking, CollectiveEvent, Account
  store.ts      DA DOVE ARRIVANO I DATI  ← il punto di innesto
  calendar.ts   agenda, formattazioni italiane, file .ics
src/data/esempio.ts   i dati di esempio (nessun altro file li conosce)
src/sections/dashboard/
  kit.tsx       scheda, stato vuoto, segnalino esempio, interruttore
  Welcome.tsx   Bentornata + nome (31)
  Daily.tsx     frase del giorno (24)
  Wheel.tsx     Ruota della Vita (23)
  MyPaths.tsx   i tuoi percorsi (27)
  Board.tsx     prenotazioni + eventi (28, 29)
  Agenda.tsx    calendario personale (30)
  Diary.tsx     diario (25)
  QuickAccess.tsx  accesso rapido / le porte (31, 33)
  Invite.tsx    invita un'amica (26)
src/pages/Dashboard.tsx   la composizione, nell'ordine del punto 31
```

---

## 4. Il punto di innesto

Tutto passa da un solo gancio:

```ts
// src/lib/account/store.ts
export function useAccount(): Account & AccountData
```

Oggi legge nome, codice referral e codice di invito dal `localStorage`
(`mila.account.v1`) e restituisce `items`, `bookings`, `events` vuoti — oppure
i dati di esempio quando l'interruttore è acceso.

**Quando arriva il server**, cambia questo file e basta:

1. `leggi` / `salva` → chiamate all'API del profilo invece del `localStorage`.
2. Il blocco `dati` di `useAccount` → una fetch di `items`, `bookings`,
   `events` (o React Query, se nel frattempo entra in progetto).
3. Uno stato di caricamento: le schede hanno già lo stato vuoto, serve
   aggiungere quello «sto arrivando».

Nessuna sezione della dashboard importa `localStorage`, `esempio.ts` o una URL
di API: importano `useAccount` e i tipi. È questa la modularità che chiede il
punto 34.

### Cosa manca per andare in produzione

- **Accesso**: non esiste ancora. Il nome, il codice referral e il diario
  vivono sul dispositivo di chi guarda.
- **Conteggio degli inviti (26)**: il codice viene generato e il codice di chi
  invita viene catturato, ma nessuno li registra da nessuna parte. Serve una
  tabella `referral` lato server. Il premio, dice il brief, non è ancora deciso.
- **Il lettore dei contenuti (27)**: l'area sa cosa è tuo, non sa ancora
  aprirlo. Gli elementi senza `to` mostrano «Presto disponibile».
- **I link delle call (28-29)**: il campo `link` esiste; finché è vuoto la
  pagina dice quando arriverà il link, invece di mostrare un pulsante che non
  porta in nessuna call.
- **Moduli di `/risorse` e `/blog` (32)**: validano e mostrano cosa verrebbe
  inviato, ma non spediscono: manca il servizio email. Il punto di innesto è la
  funzione `invia` in `src/sections/risorse/Lista.tsx` e
  `src/sections/blog/Suggest.tsx`. **Prima di collegarli** serve la spunta di
  consenso privacy con il link all'informativa: da quel momento in poi
  raccolgono dati personali per davvero.

---

## 5. Aggiungere una zona nuova

1. Il tipo in `types.ts`, se porta dati suoi.
2. Il campo in `AccountData` e in `VUOTO`, più le righe in `esempio.ts`.
3. Una sezione in `src/sections/dashboard/`, che usa `Card` e `Vuoto` dal
   `kit.tsx` e legge da `useAccount()`.
4. La riga in `Dashboard.tsx`, nel punto giusto dell'ordine del punto 31.
