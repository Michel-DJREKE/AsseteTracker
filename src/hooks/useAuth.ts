
import { useAuthWithProfiles } from './useAuthWithProfiles';

export const useAuth = () => {
  const {
    user,
    session,
    loading,
    signOut
  } = useAuthWithProfiles();

  const logout = signOut;

  return {
    user,
    session,
    loading,
    logout
  };
};
