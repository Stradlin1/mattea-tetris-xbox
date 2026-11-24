# Mattea Tetris — Xbox / Gamepad Edition

## 在线游玩 / Play online

**[点击这里开始游戏 · Play Mattea Tetris Xbox](https://stradlin1.github.io/mattea-tetris-xbox/)**

游戏链接：<https://stradlin1.github.io/mattea-tetris-xbox/>

- **部署状态：成功。** GitHub Pages 已开启，2026-11-22 的 [Pages 构建和部署](https://github.com/Stradlin1/mattea-tetris-xbox/actions/runs/45034981922) 显示 `build`、`deploy` 全部成功。
- **游戏方式：** 电脑浏览器直接打开，支持键盘和符合浏览器 Standard Gamepad 映射的 Xbox 布局手柄；这是网页游戏，不是 Xbox 主机原生应用。
- **键盘：** A/D 或 ←/→ 左右，J/K/W/5（含小键盘 5）旋转，S/↓ 加速下落，Space 直接落底，R 重开，P 暂停，M 切换音效。
- **手柄：** 左摇杆或方向键移动，A 落底，B/X/LB/RB 旋转，Start 暂停，Back/View 重开。
- **存档：** 每局从 Level 0 开始；历史最高分保存在本浏览器的本地存储，清除站点数据可能使记录丢失。

> 部署成功不代表所有实体手柄均已完成兼容性测试。若页面暂未更新，稍后刷新页面；若手柄未显示连接状态，先连接手柄并按一次按键。

[查看源代码](https://github.com/Stradlin1/mattea-tetris-xbox) · [Pages 部署记录](https://github.com/Stradlin1/mattea-tetris-xbox/actions/runs/45034981922)

---

This repository is a separate controller-enabled edition of [mattea-tetris](https://github.com/Stradlin1/mattea-tetris). The original repository is unchanged. The existing Tetris gameplay, React/Redux interface, sound effects, scoring, and BGM player are retained.

## Play

The live site is published from the `docs/` directory with GitHub Pages. **[Play online](https://stradlin1.github.io/mattea-tetris-xbox/)**. To restore publishing if settings are changed, go to **Settings → Pages → Deploy from a branch → main → /docs**.

### Keyboard

| Action | Keys |
| --- | --- |
| Move left / right | A / D or ← / → |
| Rotate | J / K / W / 5 / Numpad 5 (all rotate clockwise, as in original gameplay) |
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
2. Confirm D-pad/stick direction, rotation, soft and hard drop, pause, restart, and keyboard actions, including rotation using both 5 keys.
3. Reach a higher level, press R, and verify the next round shows Level 0.
4. Beat the high score, reload the page, and confirm it persists; restart and verify best score remains.

