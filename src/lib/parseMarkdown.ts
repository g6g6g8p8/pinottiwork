export interface StatItem {
  value: string;
  label: string;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'gallery' | 'video' | 'stats';
  content: {
    text?: string;
    url?: string;
    title?: string;
    gallery?: string[];
    autoplay?: boolean;
    stats?: StatItem[];
  };
  order: number;
}

export function parseMarkdownContent(body: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let order = 0;

  const sections = body.split(/(:::gallery[\s\S]*?:::|:::stats[\s\S]*?:::|\\[video(?:\\s+autoplay)?\\]\\([^)]+\\))/g);

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith(':::gallery')) {
      const imageMatches = [...trimmed.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
      if (imageMatches.length > 0) {
        blocks.push({
          type: 'gallery',
          content: { gallery: imageMatches.map((m) => m[2]) },
          order: order++,
        });
      }
      continue;
    }

    if (trimmed.startsWith(':::stats')) {
      const lines = trimmed
        .replace(/^:::stats/, '')
        .replace(/:::$/, '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      const stats: StatItem[] = lines.map((line) => {
        const [value, ...rest] = line.split('|');
        return { value: value.trim(), label: rest.join('|').trim() };
      });
      if (stats.length > 0) {
        blocks.push({ type: 'stats', content: { stats }, order: order++ });
      }
      continue;
    }

    const videoMatch = trimmed.match(/^\[video(\s+autoplay)?\]\(([^"]+?)(?:\s+"([^"]*)")?\)$/);
    if (videoMatch) {
      blocks.push({
        type: 'video',
        content: {
          url: videoMatch[2].trim(),
          title: videoMatch[3] || '',
          autoplay: Boolean(videoMatch[1]),
        },
        order: order++,
      });
      continue;
    }

    const lines = trimmed.split('\n');
    let textBuffer: string[] = [];

    for (const line of lines) {
      const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        if (textBuffer.length > 0) {
          blocks.push({
            type: 'text',
            content: { text: textBuffer.join('\n').trim() },
            order: order++,
          });
          textBuffer = [];
        }
        blocks.push({
          type: 'image',
          content: { url: imgMatch[2], title: imgMatch[1] },
          order: order++,
        });
      } else {
        textBuffer.push(line);
      }
    }

    if (textBuffer.length > 0 && textBuffer.join('').trim()) {
      blocks.push({
        type: 'text',
        content: { text: textBuffer.join('\n').trim() },
        order: order++,
      });
    }
  }

  return blocks;
}
