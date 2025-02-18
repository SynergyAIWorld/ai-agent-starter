"use client";

import { useCallback, useEffect } from "react";

import { api } from "~/trpc/react";

const useUserSetting = ({
  key,
  value,
  type,
}: {
  key: string;
  value: string;
  type?: number;
}) => {
  const { data, refetch, isLoading, isFetched } =
    api.setting.getSettingByKey.useQuery({
      key,
      type,
    });

  const { mutate, isPending } = api.setting.settingMintOrUpdate.useMutation({
    onSuccess: (data) => {
      void refetch();
      console.log(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });
  useEffect(() => {
    void refetch();
  }, [key]);

  const set = useCallback(() => {
    return mutate({
      key,
      value: JSON.stringify({ value }),
    });
  }, [key, value]);
  return {
    data: data?.data?.value,
    isNotSet: data?.data?.value !== value,
    refetch,
    isLoading: isPending || isLoading,
    isFetched,
    set,
  };
};
export default useUserSetting;
