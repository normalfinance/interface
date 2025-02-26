import { useCommonNormalStore, usePriorityFeeStore } from '../../stores';

export const usePriorityFeesPollingRate = () => {
  const pollingMultiplier = useCommonNormalStore((s) => s.pollingMultiplier);
  const basePollingRateMs = useCommonNormalStore((s) => s.env.basePollingRateMs);
  const priorityFeePollingMultiplier = useCommonNormalStore(
    (s) => s.env.priorityFeePollingMultiplier
  );
  const isPriorityFeeStoreReady = usePriorityFeeStore((s) => s.ready);

  const pollingFrequencyMs = isPriorityFeeStoreReady
    ? basePollingRateMs * Math.max(pollingMultiplier, priorityFeePollingMultiplier)
    : 1000; // poll more frequently until priority fee store is ready

  return pollingFrequencyMs;
};
