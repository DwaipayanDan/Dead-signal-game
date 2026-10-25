# DEAD SIGNAL — 3D Zombie Survival Prototype

A mobile-browser, third-person 3D survival prototype inspired by the feel of battle-royale shooters. It includes movement, sprinting, shooting, zombie AI, pickups, mission progression, health, and basic online room synchronization.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Open http://localhost:3000 on your phone or computer. For a phone on the same Wi-Fi, open `http://YOUR_COMPUTER_LAN_IP:3000`.

## Play with friends online

The server must be hosted on a public Node.js host that supports WebSockets (for example, Render, Railway, or a VPS). Deploy this project, then share the public URL with friends. Everyone opens the same URL and enters the same room code (e.g. `KITA01`). Socket.IO synchronizes player positions and room membership.

Important: this is an early prototype. It currently synchronizes player presence and positions; it does **not** yet synchronize zombie health, pickups, mission progress, or player combat authoritatively. It is not a production-ready or cheat-resistant multiplayer game. The 15-day progression is currently a prototype objective sequence rather than a full 15-day campaign. Three.js and Socket.IO browser client are loaded from CDNs/server respectively, so an internet connection is needed.

## Controls

- Mobile: left virtual stick; FIRE, SPRINT, USE ITEM buttons.
- Desktop: WASD/arrows, Shift to sprint, click or Space to shoot, E to interact.
- Aim: desktop mouse direction is not yet implemented; shots follow the character's facing direction.

## Project structure

- `public/index.html` — game client
- `server.js` — Node.js / Socket.IO room server
- `package.json` — dependencies and start script
