export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function toSlug(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// region: 'bottom' for mobile/detail (gradient rises from bottom)
//         'left'   for desktop card/hero (gradient goes left → right)
export async function getImageColor(imageUrl: string, region: 'bottom' | 'left' = 'bottom'): Promise<string> {
  if (typeof window === 'undefined') return '#000000';
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const SIZE = 120; // normalised canvas — same pixels regardless of display size
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve('#000000'); return; }
      ctx.drawImage(img, 0, 0, SIZE, SIZE);

      let pixels: Uint8ClampedArray;
      try {
        if (region === 'left') {
          // left third — where the desktop gradient anchors
          pixels = ctx.getImageData(0, 0, Math.floor(SIZE * 0.33), SIZE).data;
        } else {
          // bottom third — where mobile + detail gradient anchors
          pixels = ctx.getImageData(0, Math.floor(SIZE * 0.66), SIZE, Math.floor(SIZE * 0.34)).data;
        }
      } catch {
        resolve('#000000');
        return;
      }

      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const toHex = (v: number) => v.toString(16).padStart(2, '0');
      resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    };

    img.onerror = () => resolve('#000000');
    img.src = imageUrl;
  });
}
