import { api } from "~/trpc/react";

export interface PageInfo {
  page?: number;
  size?: number;
  status?: number;
  query?: Record<string, unknown>;
}

const userPoolQuery = (page: PageInfo) => {
  const { data } = api.general.currentPool.useQuery({ ...page });
  const quest = data?.data?.subQuests[0];
  return { quest };
};
export default userPoolQuery;
