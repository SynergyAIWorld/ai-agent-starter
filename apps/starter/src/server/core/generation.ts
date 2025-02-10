import type { Content, IAgentRuntime, Media, Memory } from "@elizaos/core";
import {
  composeContext,
  generateMessageResponse,
  messageCompletionFooter,
  ModelClass,
  stringToUuid,
} from "@elizaos/core";
import path from "node:path";

export const messageHandlerTemplate =
  // {{goals}}
  // "# Action Examples" is already included
  `{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}.
` + messageCompletionFooter;

export const aiAgent = async ({
  user,
  text,
  runtime,
  file,
}: {
  user: { id: string; name: string };
  text: string;
  file?: { originalName: string; mimetype: string; filename: string };
  runtime?: IAgentRuntime;
}) => {
  if (!runtime) {
    return [
      {
        text: "Some error occurred and the startup was abnormal.",
      } as Content,
    ];
  }
  const { agentId } = runtime;
  const roomId = stringToUuid(`default-room-${agentId}`);
  const userId = stringToUuid(user.id);

  await runtime.ensureConnection(
    userId,
    roomId,
    user.name,
    user.name,
    "direct",
  );

  const messageId = stringToUuid(Date.now());
  const attachments: Media[] = [];
  if (file) {
    const filePath = path.join(process.cwd(), "data", "uploads", file.filename);
    attachments.push({
      id: Date.now().toString(),
      url: filePath,
      title: file.originalName,
      source: "direct",
      description: `Uploaded file: ${file.originalName}`,
      text: "",
      contentType: file.mimetype,
    });
  }
  const content: Content = {
    text,
    attachments,
    source: "direct",
    inReplyTo: undefined,
  };

  const userMessage = {
    content,
    userId,
    roomId,
    agentId: runtime.agentId,
  };

  const memory: Memory = {
    id: stringToUuid(messageId + "-" + userId),
    ...userMessage,
    agentId: runtime.agentId,
    userId,
    roomId,
    content,
    createdAt: Date.now(),
  };

  await runtime.messageManager.addEmbeddingToMemory(memory);
  await runtime.messageManager.createMemory(memory);

  let state = await runtime.composeState(userMessage, {
    agentName: runtime.character.name,
  });

  const context = composeContext({
    state,
    template: messageHandlerTemplate,
  });

  const response = await generateMessageResponse({
    runtime: runtime,
    context,
    modelClass: ModelClass.LARGE,
  });

  // save response to memory
  const responseMessage: Memory = {
    id: stringToUuid(messageId + "-" + runtime.agentId),
    ...userMessage,
    userId: runtime.agentId,
    content: response,
    // embedding: getEmbeddingZeroVector(),
    createdAt: Date.now(),
  };

  await runtime.messageManager.createMemory(responseMessage);

  state = await runtime.updateRecentMessageState(state);

  let message = null as Content | null;

  await runtime.processActions(
    memory,
    [responseMessage],
    state,
    async (newMessages) => {
      message = newMessages;
      return new Promise((r) => r([memory]));
    },
  );

  await runtime.evaluate(memory, state);

  // Check if we should suppress the initial message
  const action = runtime.actions.find((a) => a.name === response.action);
  const shouldSuppressInitialMessage = action?.suppressInitialMessage;
  const data = [];
  if (!shouldSuppressInitialMessage) {
    if (message) {
      data.push(response, message);
    } else {
      data.push(response);
    }
  } else {
    if (message) {
      data.push(message);
    }
  }
  return data;
};
