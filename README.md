# Mattea Tetris — Xbox / Gamepad Edition

This repository is a separate controller-enabled edition of [mattea-tetris](https://github.com/Stradlin1/mattea-tetris). The original repository is unchanged. The existing Tetris gameplay, React/Redux interface, sound effects, scoring, and BGM player are retained.

## Play

The ready-to-serve site is in `docs/`. To publish it, enable **Settings → Pages → Deploy from a branch → main → /docs** on GitHub.

### Keyboard

| Action | Keys |
| --- | --- |
| Move left / right | A / D or ← / → |
| Rotate | J / K / W (all rotate clockwise, as in original gameplay) |
| Soft drop | S or ↓ |
| Hard drop | Space |
| Restart | R |
| Pause | P |
| Toggle game sound effects | M |

### Xbox / Standard Gamepad API

| Action | Control |
| --- | --- |
| Move left / right | Left stick or D-pad ← / → |
| Soft drop | Left stick down or D-pad ↓ |
| Rotate clockwise | B, X, LB, or RB |
| Hard drop | A |
| Pause | Start/Menu or Y |
| Restart | Back/View |

Plug in or pair the controller and press any gamepad button if the browser has not yet exposed it. The status in the lower-left corner reports whether a standard controller is detected. The browser Gamepad API is used: this is a browser game for PCs with compatible controllers, **not** an Xbox console executable. Other controllers with the standard mapping may work too.

## Reset, levels and high score

Each new game starts at visible **Level 0** with an empty board and a fresh score. The original engine uses internal speed indices 1–6, displayed as levels 0–5. Playing longer still increases speed according to the existing scoring rules. Scores and games use Xbox-specific storage keys, so they do not overwrite data saved by the original edition. The highest-ever score is saved separately in `localStorage` under `MATTEA_TETRIS_XBOX_HIGH_SCORE`, including scores achieved immediately before game over; browser privacy settings or clearing site data may remove it. There is no cloud account or cross-device leaderboard.

## Source and deployment

- `src/`: the original React/Redux source with Xbox-edition keyboard, level-reset and high-score changes.
- `docs/app-1.0.1.js`: ready-to-run deployed bundle containing the corresponding gameplay modifications.
- `docs/gamepad.js`: gamepad input adapter, forwarding button presses to the game's existing keyboard action handlers rather than replacing the game engine.
- `docs/bgm.js`: original BGM controls; the large MP3 remains hosted on the original project's public GitHub Pages site to avoid duplicating the 21 MB asset.

The shipped `docs/` site can be served statically. The original project's older webpack build tooling is retained in `package.json`; recompiling from source will require the original compatible toolchain, and a normal rebuild may overwrite deployed bundle patches. This repository's controller script should remain included in `docs/index.html` after rebuilding.

## Testing

Manual checklist:
1. Open the published page and start using Space or A on a paired controller.
2. Confirm D-pad/stick direction, rotation, soft and hard drop, pause, restart, and keyboard actions.
3. Reach a higher level, press R, and verify the next round shows Level 0.
4. Beat the high score, reload the page, and confirm it persists; restart and verify best score remains.

