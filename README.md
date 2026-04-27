## AI Lead Qualification Backend (Express + Firestore)

### What this backend does
- **POST** `/api/start-call`: Triggers an outbound Bolna call for a phone number.
- **POST** `/api/webhook`: Receives Bolna webhook payload, extracts lead fields, classifies Hot/Warm/Cold, stores in Firestore.
- **GET** `/api/leads`: Lists all leads (latest first).
- **GET** `/api/leads/:id`: Fetch a single lead by id.
- **DELETE** `/api/leads/:id`: Delete a lead by id.

### Setup
1) Install dependencies

```bash
cd server
npm install
```

2) Configure environment
- Copy `server/.env.example` → `server/.env`
- Fill:
  - `BOLNA_API_KEY`, `BOLNA_AGENT_ID`, `WEBHOOK_URL`
  - Firestore auth (either ADC or env-based service account fields)

3) Run

```bash
cd server
npm run dev
```

### Example requests
Start a call:

```bash
curl -X POST "http://localhost:5000/api/start-call" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919999999999"}'
```

List leads:

```bash
curl "http://localhost:5000/api/leads"
```

### Notes
- Firestore collection name: `leads`
- Classification:
  - budget > 50000 and timeline == "urgent" → Hot
  - budget > 20000 → Warm
  - else → Cold

