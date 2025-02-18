import type { Root } from "protobufjs";
import { parseJsonArrayFromText } from "@acmeos/core";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import protobuf from "protobufjs";

import { w3Logger } from "@acme/lib/tools";

import type {
  Character,
  DialogueContent,
  DialogueRequest,
  DialogueResponse,
  GameState,
} from "./types";
import { defaultContent } from "~/games/common";
import database from "./database";

export class GameHandler {
  private readonly protoDir: string;
  private protoRoot: Root | undefined;

  constructor(protoDir: string) {
    this.protoDir = protoDir;
    void this.loadProtoFile().then(({ root }) => {
      this.protoRoot = root;
    });
  }

  private async loadProtoFile() {
    return await protobuf.load(`${this.protoDir}/games.proto`);
  }

  private async errorResponse(message: string) {
    const root = await this.loadProtoFile();
    const protoSResponse = root.lookupType("SError");
    const responseMessage = protoSResponse.create({ message, code: 500 });
    const responseBuffer = protoSResponse.encode(responseMessage).finish();
    return { cmd: "games.SError", buffer: responseBuffer };
  }

  public async handle(
    cmd: string,
    buffer: Uint8Array,
  ): Promise<{ cmd: string; buffer: Uint8Array }> {
    const decodedMessage = this.protoRoot?.lookupType(cmd).decode(buffer);
    if (!decodedMessage || !this.protoRoot) {
      return this.errorResponse(`${cmd} no found`);
    }
    const payload = decodedMessage.toJSON();
    let data;
    switch (cmd) {
      case "games.CGameStart": {
        data = await this.handleGameStart(payload);
        break;
      }
      case "games.CMoved": {
        data = await this.handleMoved(payload);
        break;
      }
      case "games.CDialogue": {
        data = await this.handleDialogue(payload as DialogueRequest);
        break;
      }
      case "games.CHeartBeat": {
        data = { timestamp: Date.now() };
        break;
      }
      default:
        w3Logger.warn(">>>Received:", cmd, payload);
        return this.errorResponse(`${cmd} no found`);
    }
    const sCmd = cmd.replace(/\.C/, ".S");
    const sResponse = this.protoRoot.lookupType(sCmd);
    const responseMessage = sResponse.create(data);
    const responseBuffer = sResponse.encode(responseMessage).finish();
    return { cmd: sCmd, buffer: responseBuffer };
  }

  public async handleGameStart(data: unknown) {
    const { playerId } = data as { playerId: string };
    let gameState = await database.getGameState(playerId);
    if (gameState) {
      return {
        message:
          "Existing game found. Do you want to continue or start a new game?",
        gameState: JSON.stringify(gameState),
      };
    } else {
      gameState = await database.createNewGame(playerId);
      return {
        message: "New game created.",
        gameState: JSON.stringify(gameState),
      };
    }
  }

  public async handleMoved(data: unknown) {
    const { playerId, locations } = data as {
      playerId: string;
      locations: {
        playerId: string;
        newX: number;
        newY: number;
      }[];
    };

    const gameState = await database.getGameState(playerId);
    if (!gameState) {
      return { error: "No active game found", synced: false };
    }
    gameState.characters.forEach((c) => {
      const newPosition = locations.find((p) => p.playerId == c.id);
      if (newPosition) {
        c.position = { x: newPosition.newX, y: newPosition.newY };
      }
    });
    await database.saveGameState(gameState);
    return { synced: true };
  }

  public async handleDialogue(
    request: DialogueRequest,
  ): Promise<DialogueResponse> {
    const { playerId, c1Id, c2Id, message } = request;
    const gameState = await database.getGameState(playerId);
    if (!gameState) {
      w3Logger.warn("GameState No Found");
      return defaultContent(request, c1Id, "!!!>_<", []);
    }
    const c1 = gameState.characters.find((c) => c.id === c1Id);
    const c2 = gameState.characters.find((c) => c.id === c2Id);

    if (!c1 || !c2) {
      w3Logger.warn("No Found character ", c1, c2);
      return defaultContent(request, c1Id, "!!!@_@", []);
    }

    let dialogue = gameState.dialogues.find(
      (d) =>
        [c1Id, c2Id].includes(d.c1Id) &&
        [c1Id, c2Id].includes(d.c2Id) &&
        d.playerId === playerId,
    );
    if (!dialogue) {
      dialogue = {
        playerId,
        c1Id,
        c2Id,
        history: [],
      };
      gameState.dialogues.push(dialogue);
    }
    dialogue.history.push({
      id: Date.now(),
      role: c1Id,
      content: message,
    });
    if (!this.areAdjacent(c1.position, c2.position)) {
      w3Logger.warn("Is AreAdjacent ", c1, c2);
      return defaultContent(request, c1Id, "!!!—_-", dialogue.history);
    }

    let action = "NONE";
    const newContent: DialogueContent[] = [];
    if (c1.isNPC && c2.isNPC) {
      try {
        const prompt =
          `Story:${gameState.map.story}\n` +
          `QuestDescription:${gameState.map.questDescription}\n` +
          `CompletionCondition:${gameState.map.completionCondition}\n` +
          `Character C1:name(${c1.nickName}),description(${c1.description})\n` +
          `Character C2:name(${c2.nickName}),description(${c2.description})\n` +
          `Generate a small scene dialogue for characters C1 and C2 based on the story, 5-10 sentences, return an array of JSON objects, attributes including id (current timestamp, do not repeat), role (c1 or c2), content (dialogue content)\n` +
          `Response should be a JSON object array inside a JSON markdown block. Correct response format:
          \`\`\`json
          [{
            id: number,
            role: string,
            content: string,
          }]
          \`\`\``;
        w3Logger.log("Generating DialogueContent....", prompt);
        const { text } = await generateText({
          model: openai.languageModel("gpt-4o"),
          prompt,
        });
        const generatedContent = parseJsonArrayFromText(
          text,
        ) as DialogueContent[];
        generatedContent.map((content) => {
          newContent.push({
            ...content,
            role: content.role.toLowerCase() == "c1" ? c1Id : c2Id,
          });
        });
      } catch (error) {
        w3Logger.warn("Generate DialogueContent Error", error);
        newContent.push(
          {
            id: Date.now(),
            role: c2Id,
            content: "I'm super anxious right now, don't wanna talk.",
          },
          {
            id: Date.now(),
            role: c1Id,
            content: "Got it, sorry to bother ya.",
          },
        );
      }
      action = "COMPLETED";
    } else {
      const response = await generateText({
        model: openai.languageModel("gpt-4o"),
        system:
          `Story:${gameState.map.story}\n` +
          `QuestDescription:${gameState.map.questDescription}\n` +
          `CompletionCondition:${gameState.map.completionCondition}\n` +
          `You are ${c1.description}, name(${c1.nickName}) \n.` +
          `Dialogue history ${dialogue.history
            .slice(-10)
            .map(
              (item) =>
                `${item.role == c1.id ? c1.nickName : c2.nickName}:${item.content}`,
            )
            .join("\n")} \n`,
        prompt: `You says: "${message}". Respond in character, considering the game's story and your role.`,
      });
      newContent.push({
        id: Date.now(),
        role: c2Id,
        content: response.text,
      });
      await database.saveGameState(gameState);
      if (await this.checkQuestCompletion(c1, gameState)) {
        gameState.questCompleted = true;
        await database.saveGameState(gameState);
        action = "QUEST_COMPLETED";
      }
    }
    dialogue.history.push(...newContent);
    if (dialogue.history.length > 32) {
      dialogue.history.shift();
    }
    return {
      content: newContent,
      history: dialogue.history,
      action,
      request,
    };
  }

  areAdjacent(
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
  ): boolean {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return dx * dx + dy * dy <= 2 * 2;
    // const dx = Math.abs(pos1.x - pos2.x);
    // const dy = Math.abs(pos1.y - pos2.y);
    // return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  systemPrompt(player: Character, gameState: GameState) {
    return (
      `#Story:${gameState.map.story}\n` +
      `#QuestDescription:${gameState.map.questDescription}\n` +
      `#CompletionCondition:${gameState.map.completionCondition}\n` +
      `You are ${player.description}, name(${player.nickName}) \n.` +
      `#Dialogue history
             ${gameState.dialogues
               .find((d) => [d.c1Id, d.c2Id].includes(player.id))
               ?.history.slice(-10)
               .map(
                 (item) =>
                   `${item.role == player.id ? player.nickName : "NPC"}:${item.content}`,
               )
               .join("\n")} \n`
    );
  }

  async checkQuestCompletion(
    player: Character,
    gameState: GameState,
  ): Promise<boolean> {
    if (
      gameState.dialogues.length < gameState.map.npcCount / 2 ||
      gameState.dialogues.find(
        (d) => [d.c1Id, d.c2Id].includes(player.id) && d.history.length < 3,
      )
    ) {
      return false;
    }
    const { text } = await generateText({
      model: openai("gpt-4"),
      system: this.systemPrompt(player, gameState),
      prompt: `Has the player completed the quest? Respond with only 'true' or 'false'.`,
    });
    return text.trim().toLowerCase() === "true";
  }
}
