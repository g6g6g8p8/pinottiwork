export interface ContentBlock {
  type: 'text' | 'image' | 'gallery' | 'video';
  content: {
    text?: string;
    url?: string;
    title?: string;
    gallery?: string[];
  };
  order: number;
}

export function parseMarkdownContent(body: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let order = 0;

  const sections = body.split(/(:::gallery[\s\S]*?:::|\[video\]\([^)]+\))/g);

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

    const videoMatch = trimmed.match(/^\[video\]\(([^"]+?)(?:\s+"([^"]*)")?\)$/);
    if (videoMatch) {
      blocks.push({
        type: 'video',
        content: { url: videoMatch[1].trim(), title: videoMatch[2] || '' },
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
