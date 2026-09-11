# Kitty Feeding Display

A small screen that answers one question at a glance: **has the cat been fed today?**

It's built to run full-screen on a **Raspberry Pi connected to a touch display** — e.g. sitting next to the food bowl — so anyone in the house can glance at it or tap it after feeding, without needing a phone app or a login.

## What it does

- Shows a beach scene with the current **day, date, and time**, updated live.
- The background photo swaps to a sunset version automatically between **19:00 and 06:00**.
- A **Feed Kitty** button asks for confirmation ("Did you feed the kitty?") before recording anything, to avoid accidental taps.
- Once confirmed, it:
  - saves the exact time of the feeding,
  - shows hearts floating up and a little happy hop animation,
  - makes the cat **glow** for the next 8 hours as a visual "fed" indicator,
  - displays how long ago the last feeding was (e.g. `2h 14m ago`), updated every second.
- The status text shows either the time it was fed today, or the last time it was fed on a previous day if it hasn't been fed yet today.

There is no server and no login: the last feeding time is stored in the browser's `localStorage`, so it persists across reloads and reboots as long as it's the same browser/device.

## Files

| File         | Purpose                                                                      |
| ------------ | ---------------------------------------------------------------------------- |
| `index.html` | Page structure — the clock, the button, the confirmation prompt, and the cat |
| `style.css`  | Layout, colors, fonts, and animations                                        |
| `script.js`  | The clock tick, day/night switch, feeding logic, and animations              |
| `images/`    | Background photos (day/night) and the cat image                              |

## Running it

This is plain HTML/CSS/JS — no build step, no dependencies. Just open `index.html` in a browser.

### On a Raspberry Pi with a touch display

1. Copy this folder onto the Pi.
2. Launch Chromium in kiosk mode pointed at the file, e.g.:
   ```
   chromium-browser --kiosk --app=file:///home/pi/kitty-feeding-display/index.html
   ```
3. Disable screen blanking/sleep on the Pi so the display stays on (e.g. via `raspi-config` or `xset s off -dpms`).
4. Set it to launch automatically on boot (add it to autostart) so the display is ready without any setup after a power cycle.

## Notes

- "Feed Kitty" only records that a feeding happened — it does not control any physical food dispenser.
