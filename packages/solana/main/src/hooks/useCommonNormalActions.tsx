import createNormalActions from '../actions/normalActions';
import { useCommonNormalStore } from '../stores';

/**
 * Returns the common Normal actions object.
 */
export function useCommonNormalActions(): ReturnType<typeof createNormalActions> {
  const actions = useCommonNormalStore((s) => s.actions);

  return actions;
}
