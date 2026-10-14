#!/usr/bin/env python3
"""Create placeholder JPEGs, PNGs, and MP4s under public/ (stdlib + optional Pillow/ffmpeg)."""
from __future__ import annotations

import shutil
import struct
import subprocess
import sys
import urllib.request
import zlib
from pathlib import Path

ROOT = Path("/home/ozai/eastshan-portal/public")
VIDEO_DIR = ROOT / "videos"
LEADER_DIR = ROOT / "samples" / "leaders"
VIDEO_DIR.mkdir(parents=True, exist_ok=True)
LEADER_DIR.mkdir(parents=True, exist_ok=True)

# Known-good 1x1 JPEG (JFIF)
TINY_JPEG = bytes.fromhex(
    "ffd8ffe000104a46494600010100000100010000"
    "ffdb004300080606070605080707070909080a0c14130c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720222c231c1c2837292c30313434341f27393d38323c2e333432"
    "ffc0000b080001000101011100"
    "ffc4001f0000010501010101010100000000000000000102030405060708090a0b"
    "ffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9fa"
    "ffda0008010100003f007f46ffd9"
)

# Small public sample MP4s (tried in order)
MP4_URLS = [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",  # webm — skip if wrong type
    "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
]


def write_png(path: Path, width: int, height: int, rgb: tuple[int, int, int]) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    rows = b"".join(b"\x00" + bytes(rgb) * width for _ in range(height))
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(rows, 9))
        + chunk(b"IEND", b"")
    )


def write_jpeg(path: Path, rgb: tuple[int, int, int], size: tuple[int, int] = (1280, 720)) -> str:
    try:
        from PIL import Image

        Image.new("RGB", size, rgb).save(path, "JPEG", quality=70)
        return "pillow"
    except Exception:
        path.write_bytes(TINY_JPEG)
        return "tiny-jpeg"


def try_ffmpeg_source(dest: Path) -> bool:
    ff = shutil.which("ffmpeg")
    if not ff:
        return False
    try:
        subprocess.check_call(
            [
                ff,
                "-y",
                "-f",
                "lavfi",
                "-i",
                "color=c=0x0a1433:s=640x360:d=2",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-t",
                "2",
                str(dest),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return dest.exists() and dest.stat().st_size > 100
    except Exception as exc:
        print(f"ffmpeg failed: {exc}", file=sys.stderr)
        return False


def download_mp4(dest: Path) -> str | None:
    # Prefer real .mp4 URLs only
    urls = [
        "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
        "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
        "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        "https://download.samplelib.com/mp4/sample-5s.mp4",
    ]
    for url in urls:
        try:
            print(f"downloading {url}")
            req = urllib.request.Request(url, headers={"User-Agent": "eastshan-portal-placeholder/1.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            if len(data) < 500:
                print(f"too small ({len(data)}), skip")
                continue
            # Basic MP4 signature check (ftyp)
            if b"ftyp" not in data[:64]:
                print("no ftyp box, skip")
                continue
            dest.write_bytes(data)
            return url
        except Exception as exc:
            print(f"download failed: {exc}", file=sys.stderr)
    return None


def main() -> None:
    print("checking tools")
    print(f"ffmpeg: {shutil.which('ffmpeg')}")
    try:
        from PIL import Image  # noqa: F401

        print("pillow: yes")
    except Exception:
        print("pillow: no")

    poster_colors = {
        "hero": (10, 20, 51),
        "card-1": (20, 40, 80),
        "card-2": (30, 50, 90),
        "card-3": (40, 60, 100),
        "card-4": (50, 70, 110),
        "card-5": (60, 80, 120),
        "card-6": (70, 90, 130),
        "leader-placeholder": (24, 36, 64),
    }

    methods: dict[str, str] = {}
    for name, rgb in poster_colors.items():
        path = VIDEO_DIR / f"{name}.jpg"
        methods[name] = write_jpeg(path, rgb)
        print(f"wrote {path} ({path.stat().st_size} bytes) via {methods[name]}")

    for i in range(1, 13):
        path = LEADER_DIR / f"leader-{i}.png"
        write_png(path, 480, 600, (18 + i * 4, 28 + i * 3, 55 + i * 2))
        print(f"wrote {path} ({path.stat().st_size} bytes)")

    mp4_src = VIDEO_DIR / "_source.mp4"
    mp4_method = "existing"
    if not (mp4_src.exists() and mp4_src.stat().st_size > 100):
        if try_ffmpeg_source(mp4_src):
            mp4_method = "ffmpeg"
        else:
            url = download_mp4(mp4_src)
            if url:
                mp4_method = f"download:{url}"
            else:
                print("ERROR: could not create source MP4", file=sys.stderr)
                sys.exit(1)

    print(f"mp4 source via {mp4_method}: {mp4_src} ({mp4_src.stat().st_size} bytes)")

    video_names = ["hero", "card-1", "card-2", "card-3", "card-4", "card-5", "card-6"]
    for name in video_names:
        dest = VIDEO_DIR / f"{name}.mp4"
        shutil.copyfile(mp4_src, dest)
        print(f"copied {dest} ({dest.stat().st_size} bytes)")

    print("--- summary ---")
    for p in sorted(VIDEO_DIR.iterdir()):
        print(f"{p.relative_to(ROOT)} {p.stat().st_size}")
    for p in sorted(LEADER_DIR.iterdir()):
        print(f"{p.relative_to(ROOT)} {p.stat().st_size}")
    print("done")


if __name__ == "__main__":
    main()
