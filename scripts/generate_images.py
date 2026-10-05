#!/usr/bin/env python3
"""Brand image generator — creates HoneyPot's service card artwork with
Gemini (Nano Banana) so every card has original, on-brand imagery instead
of stock photos.

Style is locked to the studio identity: near-black background, neon
fuchsia/violet/cyan glow, honeycomb hexagon motifs, no text.

Usage: python3 scripts/generate_images.py
Output: frontend/public/images/services/<name>.webp (1200px, optimised)
"""
import asyncio
import base64
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

OUT_DIR = Path("/app/frontend/public/images/services")
MODEL = "gemini-3.1-flash-image-preview"

STYLE = (
    "Premium 3D render icon illustration for a website design studio brand. "
    "Pure near-black background (#050505). Subject glows with neon light: "
    "magenta pink (#FF00FF), violet purple (#8A2BE2) and cyan (#00FFFF) "
    "gradient rim lighting, soft volumetric glow, subtle floating hexagon "
    "particles around the subject. Dark cyber aesthetic, high contrast, "
    "clean minimal composition with the subject centered. "
    "Absolutely no text, no letters, no words, no logos anywhere in the image."
)

IMAGES = {
    "landing-pages": "A glowing rocket launching off a laptop screen with an upward arrow trail, symbolising a high-converting landing page.",
    "tradie-websites": "A hard hat and crossed wrench and hammer tools, floating above a glowing smartphone showing a website wireframe.",
    "custom-websites": "An open laptop with glowing code brackets and modular website blocks assembling themselves above the keyboard.",
    "digital-marketing": "A rising analytics bar chart with a glowing upward arrow and a target with an arrow in the bullseye, floating orbs of light.",
    "social-media": "A smartphone tilted in 3D with glowing heart, chat bubble and share icons floating out of the screen.",
    "website-hosting": "A stack of glowing server racks with a protective shield and a small cloud above, symbolising secure managed hosting.",
}


async def generate_one(name: str, subject: str) -> bool:
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=f"hp-img-{name}",
        system_message="You generate brand artwork exactly matching the requested style.",
    )
    chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
    msg = UserMessage(text=f"{subject}\n\nStyle requirements:\n{STYLE}")
    try:
        text, images = await chat.send_message_multimodal_response(msg)
    except Exception as e:  # noqa: BLE001
        print(f"[{name}] generation failed: {e}")
        return False
    if not images:
        print(f"[{name}] no image returned (text: {str(text)[:80]})")
        return False
    raw = base64.b64decode(images[0]["data"])
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    # standardise: max 1200px wide, optimised webp
    if img.width > 1200:
        img = img.resize((1200, int(img.height * 1200 / img.width)), Image.LANCZOS)
    out = OUT_DIR / f"{name}.webp"
    img.save(out, "WEBP", quality=82, method=6)
    print(f"[{name}] saved {out} ({img.width}x{img.height}, {out.stat().st_size // 1024}KB)")
    return True


async def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results = await asyncio.gather(*[generate_one(n, s) for n, s in IMAGES.items()])
    ok = sum(results)
    print(f"done: {ok}/{len(IMAGES)} images generated")
    return 0 if ok == len(IMAGES) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
