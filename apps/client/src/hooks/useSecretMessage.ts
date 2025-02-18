import { api } from "~/trpc/react";

const useSecretMessage = () => {
  return api.auth.secretMessage.useQuery();
};
export default useSecretMessage;
