import type { DialogueContent, DialogueRequest } from "~/games/types";

export const defaultContent = (
  request: DialogueRequest,
  subContent: string,
  cId: string,
  history: DialogueContent[],
) => {
  const content = {
    id: Date.now(),
    role: cId,
    content: `There was something unusual, Sorry ${subContent}`,
  };
  return {
    content: [content],
    history: [...history, content],
    action: "COMPLETED",
    request,
  };
};
