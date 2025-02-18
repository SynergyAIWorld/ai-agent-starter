import { parseJsonArrayFromText, parseJSONObjectFromText } from "@acmeos/core";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { w3Logger } from "@acme/lib/tools";

import type { Character, GameMap, GameState } from "./types";

let db: Map<string, GameState>;

function initializeDatabase() {
  db = new Map<string, GameState>();
}

function getGameState(playerId: string) {
  return new Promise<GameState | undefined>((resolve) => {
    const map = db.get(playerId);
    resolve(map?.questCompleted ? undefined : map);
  });
}

function saveGameState(gameState: GameState) {
  const player = gameState.characters.find((c) =>
    !c.isNPC ? c.id : undefined,
  );

  if (player) {
    db.set(player.id, gameState);
  }
  return new Promise((resolve) => resolve(gameState));
}

async function createNewGame(playerId: string): Promise<GameState> {
  const map = await generateMap();
  const characters = await generateCharacters(playerId, map);
  const gameState: GameState = {
    obstacles: [],
    characters,
    dialogues: [],
    questCompleted: false,
    map,
  };
  const blockVecMap: string[] = characters.map(
    (c) => `${c.position.x}_${c.position.y}`,
  );
  const isStepOnBlockVec = (x: number, y: number, w: number, h: number) => {
    let isStep = false;
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        const vecX = x + i;
        const vecY = y + j;
        if (blockVecMap.includes(`${vecX}_${vecY}`)) {
          isStep = true;
          break;
        } else {
          blockVecMap.push(`${vecX}_${vecY}`);
        }
      }
    }
    return isStep;
  };

  for (let i = 0; i < map.obstacleCount; i++) {
    let x = Math.floor(Math.random() * map.size);
    let y = Math.floor(Math.random() * map.size);
    let w = Math.floor(Math.random() * 2) + 1;
    let h = Math.floor(Math.random() * 2) + 1;

    const centerPoint = { x: map.size / 2, y: map.size / 2 };

    while (
      (x <= centerPoint.x &&
        x + w >= centerPoint.x &&
        y <= centerPoint.y &&
        y + h >= centerPoint.y) ||
      x + w >= map.size ||
      y + h >= map.size ||
      isStepOnBlockVec(x, y, w, h)
      // ||
      // (x <= npcX && x + w >= npcX && y <= npcY && y + h >= npcY)
    ) {
      x = Math.floor(Math.random() * map.size);
      y = Math.floor(Math.random() * map.size);
      w = Math.floor(Math.random() * 2) + 1;
      h = Math.floor(Math.random() * 2) + 1;
    }

    gameState.obstacles.push({
      x,
      y,
      w,
      h,
    });
  }
  await saveGameState(gameState);
  console.log("New game created.", JSON.stringify(gameState));
  return gameState;
}

async function generateMap(): Promise<GameMap> {
  w3Logger.log("Generating Map....");
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt:
      "Generate a JSON object for a game map with the following properties: id (string), story (string), size (number between 10 and 15), obstacleCount (number between size and size + 1), npcCount (number between 1 and 7  base on size), questDescription (string) , completionCondition(string)\n" +
      `Response format should be formatted in a valid JSON block like this:
      \`\`\`json
      {
        id: string;
        story: string;
        size: number;
        obstacleCount: number;
        npcCount: number;
        questDescription: string;
        completionCondition: string;
        playerId: string;
      }
      \`\`\`
  `,
  });
  w3Logger.log(text);
  return parseJSONObjectFromText(text) as GameMap;
}

async function generateCharacters(
  playerId: string,
  map: GameMap,
): Promise<Character[]> {
  const prompt =
    `Story:${map.story}\n` +
    `QuestDescription:${map.questDescription}\n` +
    `CompletionCondition:${map.completionCondition}\n` +
    `Generate ${map.npcCount} JSON object array for an NPC character with the following properties: id (uuid), nickName(string), configId(Random numbers between 101-107 and do not repeat), position (object with x and y, both numbers between 0 and ${map.size - 1} ,Cannot overlap with other characters), inventory (array of strings), greetings(string), description (string), isNPC (should be true).\n` +
    `Response should be a JSON object array inside a JSON markdown block. Correct response format:
    \`\`\`json
    [{
      id: string;
      nickName: string;
      configId: number;
      position: { x: number; y: number };
      inventory: string[];
      description: string;
      greeting: string;
      isNPC: boolean;
    }]
    \`\`\``;
  w3Logger.log("Generating Characters....", prompt);
  const { text } = await generateText({
    model: openai.languageModel("gpt-4o"),
    prompt,
  });
  w3Logger.log(text);
  const characters = parseJsonArrayFromText(text) as Character[];
  if (characters[0]) {
    characters[0].id = playerId;
    characters[0].configId = 1;
    characters[0].isNPC = false;
    characters[0].position = { x: (map.size / 2) | 0, y: (map.size / 2) | 0 };
    return characters;
  }
  return [];
}

const database = {
  initializeDatabase,
  getGameState,
  saveGameState,
  createNewGame,
};
export default database;
