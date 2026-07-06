/*
 * Lucy's pose registry — the single place her artwork is defined.
 *
 * UPGRADING A POSE TO AN ANIMATED ASSET LATER:
 *   1. Drop the file into /public/lucy (animated .gif, .webp and .apng all
 *      work — <img> plays them natively, nothing else changes).
 *   2. Point that pose's `src` here at the new file. Done.
 *
 * BLINKING:
 *   Add a `blink` entry to any pose (a frame identical to `src` but with
 *   eyes closed, e.g. blink: "/lucy/base_blink.png"). LucySprite detects it
 *   and starts a natural randomized blink loop automatically — no code edits.
 *
 * FULL RIG (Live2D / Rive / spritesheet):
 *   Replace the internals of LucySprite.jsx only. LucyStage and every page
 *   section talk in pose names, never in image tags.
 *
 * `anchor` is the horizontal center of Lucy's body as a fraction of image
 * width (poses with an extended arm are off-center; this keeps her torso
 * still when poses crossfade).
 */

const LUCY_POSES = {
  base: { src: "/lucy/base.png", anchor: 0.5 },
  wave: { src: "/lucy/wave.png", anchor: 0.44 },
  point: { src: "/lucy/point.png", anchor: 0.58 },
  excited: { src: "/lucy/excited.png", anchor: 0.55 },
  shush: { src: "/lucy/shush.png", anchor: 0.5 },
  thumbs: { src: "/lucy/thumbs.png", anchor: 0.52 },
};

export default LUCY_POSES;
