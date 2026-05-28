export interface StoryEntry {
  contributor: string;
  sentence: string;
  timestamp: bigint;
  index: bigint;
}

// A combined display item: either a user sentence or Siggy's narration
export type DisplayItem =
  | { kind: "sentence"; entry: StoryEntry }
  | { kind: "narration"; text: string; afterIndex: number };
