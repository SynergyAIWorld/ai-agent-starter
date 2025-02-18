export interface GameMap {
  id: string;
  story: string;
  size: number;
  obstacleCount: number;
  npcCount: number;
  questDescription: string;
  completionCondition: string;
  playerId: string;
}

export interface Character {
  id: string;
  nickName: string;
  configId: number;
  position: { x: number; y: number };
  inventory: string[];
  description: string;
  greeting: string;
  isNPC: boolean;
}

export interface DialogueContent {
  id: number;
  role: string;
  content: string;
}

export interface Dialogue {
  playerId: string;
  c2Id: string;
  c1Id: string;
  history: DialogueContent[];
}

export interface DialogueRequest {
  playerId: string;
  c1Id: string;
  c2Id: string;
  message: string;
}

export interface DialogueResponse {
  content: DialogueContent[];
  history: DialogueContent[];
  action: string;
  request: DialogueRequest;
}

export interface GameState {
  characters: Character[];
  dialogues: Dialogue[];
  obstacles: { x: number; y: number; w: number; h: number }[];
  questCompleted: boolean;
  map: GameMap;
}
