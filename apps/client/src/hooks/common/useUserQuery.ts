import { api } from "~/trpc/react";

export interface PageInfo {
  page: number;
  size: number;
  status: number;
}

const useUserQuery = (page: PageInfo) => {
  return api.general.topPtsUser.useQuery({ ...page });
};
export default useUserQuery;
