
export enum AppMode {
  CONVERSATION = 'conversation',
  PHONE = 'phone',
  TEXT = 'text',
  LETTER = 'letter'
}

export interface TruthItem {
  q: string;
  v: string;
  t: string;
  r: string;
  ti: string;
  tc: string;
}

export interface AIResult {
  opening: string;
  script: string;
  verse: string;
  verseText: string;
  truth: string;
  followUp: string;
}

export type TopicData = Record<string, TruthItem[]>;

export interface CardProps {
  item: TruthItem;
  onCopy: (text: string) => void;
}
