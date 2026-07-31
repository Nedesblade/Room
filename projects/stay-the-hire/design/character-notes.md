# Cozy Chibi Pixel Character Portfolio

This portfolio defines a first cast for a cozy fantasy top-down RPG. The visual target is cute chibi pixel art: big heads, tiny bodies, dark outlines, simple faces, clear silhouettes, and color blocks that remain readable at `32x32`.

Creation approach: this board is the AI concept pass. The next pass should redraw the chosen designs manually in Piskel as clean `32x32` sprites, using the notes below as constraints rather than tracing every generated pixel.

![Character lineup](character-lineup.png)

## Style Rules

- Canvas target: `32x32` per front-facing sprite.
- View angle: front-facing/top-down RPG character read, not side-view and not full portrait art.
- Shape language: large rounded head, compact body, short legs, chunky hair or hat silhouette.
- Face: two dark vertical eyes, optional blush pixels, no mouth unless needed for personality.
- Outline: dark navy or charcoal outline around the sprite, with a few internal dark pixels for hair, clothes, or props.
- Shading: one darker shade per main material; keep highlights minimal.
- Props: one small readable prop per character, never bigger than the body.
- Readability rule: zoom out to actual `32x32` size; if the role is unclear, simplify before adding detail.
- Export path for later Piskel redraws: `/Users/meledens/Documents/Game idea/sprites/`.

## Character Lineup

| # | Name | Role | Palette | Personality | Outfit / Prop Notes | 32x32 Redraw Notes |
|---|---|---|---|---|---|---|
| 1 | Nia Brightstep | Apprentice hero | Sky blue, warm cream, chestnut, charcoal, brass | Brave, curious, slightly impulsive | Blue scarf, simple tunic, tiny wooden sword | Make the scarf the main silhouette cue; sword should be a 3-4 pixel side prop. |
| 2 | Luma Thistle | Village healer | Cream, sage, soft pink, honey, dark teal | Gentle, practical, observant | Cream robe, herb satchel, little sprig detail | Use the satchel and pale robe shape to separate her from the mage. |
| 3 | Pip Vellum | Potion seller | Dusty purple, berry, bottle green, warm tan, charcoal | Chatty, clever, a little dramatic | Purple cloak, tiny potion bottle, swept hair or hood | Potion bottle should be bright and readable as a tiny accent near one hand. |
| 4 | Bram Emberhand | Blacksmith | Terracotta, leather brown, steel gray, ember orange, charcoal | Warm, sturdy, protective | Leather apron, small hammer, rolled sleeves | Give him the widest body shape; hammer head only needs a few pixels. |
| 5 | Fernwyn | Forest mage | Sage green, moss, cream, pale gold, deep teal | Quiet, strange, kind | Green hood, leaf staff, soft cloak | Hood silhouette and leaf staff are the identity anchors. |
| 6 | Tavi Quickpost | Courier | Honey yellow, denim blue, tan, cream, charcoal | Fast, optimistic, forgetful | Yellow cap, messenger bag, short boots | Cap brim and diagonal bag strap should read even at small size. |
| 7 | Orlo Drowse | Sleepy guard | Soft gray, slate, muted blue, cream, charcoal | Loyal, tired, deadpan | Rounded helmet, soft armor, droopy stance | Tilt helmet or lower eyes by one pixel to sell the sleepy mood. |
| 8 | Vesper Vale | Mysterious rival | Aubergine, midnight navy, silver, pale lavender, charcoal | Elegant, guarded, secretly helpful | Dark cloak, crescent charm, sharp hair shape | Strongest silhouette: cloak triangle plus tiny crescent accent. |

## Piskel Build Targets

- Keep each final sprite on a transparent `32x32` canvas.
- Use a consistent shadow color beneath the feet so the lineup feels like one shared game.
- Limit each character to the listed 3-5 main colors, plus outline and skin tone where needed.
- Use the AI lineup for silhouette, palette, and prop placement; simplify tiny textures that will not survive at `32x32`.
- Save single front-facing PNGs first. Walking and idle animation sheets come later.

## Piskel Redraw Checklist

1. Create a `32x32` canvas.
2. Draw a dark silhouette first: head, body, feet, prop.
3. Fill the main color blocks.
4. Add face pixels and one personality detail.
5. Add one shadow color under hair, clothing, and feet.
6. Zoom out to 100 percent and confirm the role is still readable.
7. Save each sprite as an individual PNG before making animation frames.

## First Sprite File Names

- `sprites/nia-brightstep-front.png`
- `sprites/luma-thistle-front.png`
- `sprites/pip-vellum-front.png`
- `sprites/bram-emberhand-front.png`
- `sprites/fernwyn-front.png`
- `sprites/tavi-quickpost-front.png`
- `sprites/orlo-drowse-front.png`
- `sprites/vesper-vale-front.png`
