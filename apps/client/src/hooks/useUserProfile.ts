import { useContext } from "react";

import { ProfileContext } from "~/app/_components/ProfileContext";

const useUserProfile = () => {
  const data = useContext(ProfileContext);
  return { ...data };
};
export default useUserProfile;
