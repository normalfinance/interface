import { useCommonNormalStore } from '../stores';

/**
 * Checks if the normal client is subscribed and ready to use.
 */
export const useNormalClientIsReady = () => {
  const normalClientIsReady = useCommonNormalStore((s) => {
    return s.checkIsNormalClientReady();
  });

  return normalClientIsReady;
};
