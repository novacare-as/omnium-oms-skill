export interface Markers {
  begin: string;
  end: string;
}

export function replaceBetweenMarkers(text: string, markers: Markers, content: string, fileName: string): string {
  const begin = text.indexOf(markers.begin);
  const end = text.indexOf(markers.end);
  if (begin === -1 || end < begin) {
    throw new Error(`${fileName} is missing the generated block markers:\n${markers.begin}\n${markers.end}`);
  }
  return `${text.slice(0, begin + markers.begin.length)}\n${content}\n${text.slice(end)}`;
}

export function anchor(heading: string): string {
  return heading.toLowerCase().replace(/[^\p{L}\p{N} -]/gu, "").replace(/ /g, "-");
}
