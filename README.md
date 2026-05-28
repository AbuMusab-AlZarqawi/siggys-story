# 🐱 Siggy's Story — The Eternal Onchain Lore

A collaborative dApp where anyone adds one sentence to a never-ending story, and **Siggy** — an ancient wizard cat — narrates what happens next using AI.

## How it actually works

```
User types sentence → wallet signs tx → stored on Ritual Chain (permanent, costs only gas)
                                              ↓
                              Groq API called server-side (last 5 sentences as context)
                                              ↓
                              Siggy generates the next paragraph (3-5 sentences)
                                              ↓
                     Narration shows as live typewriter animation on screen
                                              ↓
                     Narration saved to Vercel KV (free, persists for all visitors)
```

- **Sentences** → onchain forever, no gas from you
- **Siggy's narrations** → generated per submission (not the whole story each time), stored free in Vercel KV
- **No hidden costs** — you pay nothing. Users pay only Ritual Chain testnet gas (free from faucet)

---

## Project Structure

```
siggys-story/
├── contract/
│   ├── contracts/LoreKeeper.sol   ← clean, stores sentences only
│   ├── scripts/deploy.ts
│   ├── hardhat.config.ts
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/narrate/route.ts      ← Groq call (server-side)
│   │   │   ├── api/narrations/route.ts   ← Vercel KV store/fetch
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── StoryScroll.tsx           ← main story display
│   │   │   ├── SubmitSentence.tsx        ← wallet tx + narration trigger
│   │   │   ├── ContributorsSidebar.tsx
│   │   │   ├── TypewriterText.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Providers.tsx
│   │   ├── lib/
│   │   │   ├── contract.ts
│   │   │   ├── wagmiConfig.ts
│   │   │   └── asyncStorageMock.js
│   │   └── types/index.ts
│   ├── public/
│   │   └── background.png               ← your wizard cat image ✅
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Step 1 — Deploy the Contract

```powershell
cd siggys-story\contract
npm install
copy .env.example .env
```

Edit `.env`:
```
PRIVATE_KEY=your_metamask_private_key
RITUAL_RPC_URL=https://rpc.ritualfoundation.org
```

```powershell
npm run compile
npm run deploy
```

Output will show:
```
✅ LoreKeeper deployed to: 0xAbC123...
NEXT_PUBLIC_CONTRACT_ADDRESS=0xAbC123...
```

Copy that address.

---

## Step 2 — Run the Frontend

```powershell
cd ..\frontend
npm install
copy .env.example .env.local
```

Edit `.env.local` — fill in all values:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...    ← from Step 1
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID= ← from cloud.walletconnect.com (free)
NEXT_PUBLIC_RITUAL_RPC_URL=https://rpc.ritualfoundation.org
GROQ_API_KEY=gsk_...                  ← from console.groq.com (free)
KV_REST_API_URL=                      ← leave blank for local dev
KV_REST_API_TOKEN=                    ← leave blank for local dev
```

```powershell
npm run dev
```

Open http://localhost:3000

> Local dev note: Without KV vars set, narrations show live (typewriter effect) but won't persist on page refresh. That's fine for testing. KV is only needed on Vercel.

---

## Step 3 — Deploy to Vercel

```powershell
cd ..
git init
git add .
git commit -m "feat: Siggy's Story"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/siggys-story.git
git push -u origin main
```

On Vercel:
1. New Project → import your repo
2. **Root Directory: `frontend`**
3. Add environment variables (all 4 required + KV if you want persistence):
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_RITUAL_RPC_URL`
   - `GROQ_API_KEY`
4. For Vercel KV: Storage tab → Create KV Store → it auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`
5. Deploy

---

## Ritual Chain Testnet

| | |
|---|---|
| Network Name | Ritual Chain Testnet |
| RPC URL | https://rpc.ritualfoundation.org |
| Chain ID | 1979 |
| Symbol | RITUAL |

Add to MetaMask: Settings → Networks → Add Network → fill above values.

---

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | ✅ | From deploy |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ | WalletConnect Cloud |
| `NEXT_PUBLIC_RITUAL_RPC_URL` | ✅ | Already set in example |
| `GROQ_API_KEY` | ✅ | Server-side only |
| `KV_REST_API_URL` | Recommended | Auto from Vercel KV |
| `KV_REST_API_TOKEN` | Recommended | Auto from Vercel KV |

---

*Siggy watches. The tome is open. Write your sentence.*
