from PIL import Image
import os
import sys

def generate_favicons(source_path, output_dir):
    try:
        img = Image.open(source_path)
        print(f"Opened image: {source_path}")

        # Ensure output directory exists
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # 1. Generate favicon.ico (includes 16x16, 32x32, 48x48)
        icon_sizes = [(16, 16), (32, 32), (48, 48)]
        img.save(os.path.join(output_dir, 'favicon.ico'), format='ICO', sizes=icon_sizes)
        print(f"Generated: {os.path.join(output_dir, 'favicon.ico')}")

        # 2. Generate icon.png (standard 192x192 is good for PWA/Android, but Next.js likes `icon.png` to be around 32x32 or up to 192)
        # We'll stick to a generally good size like 192x192 or just keep original resolution if reasonable
        # Let's make a standard 32x32 for the 'icon' and a larger one for PWA if needed, but for now just `icon.png`
        img_resized = img.resize((192, 192), Image.Resampling.LANCZOS)
        img_resized.save(os.path.join(output_dir, 'icon.png'), format='PNG')
        print(f"Generated: {os.path.join(output_dir, 'icon.png')}")

        # 3. Generate apple-icon.png (180x180)
        img_apple = img.resize((180, 180), Image.Resampling.LANCZOS)
        img_apple.save(os.path.join(output_dir, 'apple-icon.png'), format='PNG')
        print(f"Generated: {os.path.join(output_dir, 'apple-icon.png')}")

    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    source = r"d:\dev\seojack.app\Legacy_CRM\public\seojack-icon-1025-6b7885d0.webp"
    output = r"d:\dev\seojack.app\Legacy_CRM\public"
    generate_favicons(source, output)
