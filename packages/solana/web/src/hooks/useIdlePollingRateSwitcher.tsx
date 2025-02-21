import { useEffect, useRef } from 'react';
import { useIdle } from 'react-use';
import { useNormalClientIsReady } from './useNormalClientIsReady';
import { PollingNormalClientAccountSubscriber } from '@normalfinance/solana-sdk';
import { useCommonNormalStore } from '../stores';

const IDLE_1_MIN_POLLING_RATE = 10000;
const IDLE_10_MIN_POLLING_RATE = 60000;

const IDLE_1_MIN_POLLING_MULTIPLIER = 10;
const IDLE_10_MIN_POLLING_MULTIPLIER = 60;

/**
 * Switches the polling rate of the bulkAccountLoader based on idle time of the user
 */
const useIdlePollingRateSwitcher = () => {
  const idle1Minute = useIdle(60e3);
  const idle10Minutes = useIdle(600e3);
  const wasIdle = useRef(false);
  const setCommonNormalStore = useCommonNormalStore((s) => s.set);
  const normalClient = useCommonNormalStore((s) => s.normalClient.client);
  const normalClientIsReady = useNormalClientIsReady();
  const basePollingRateMs = useCommonNormalStore((s) => s.env.basePollingRateMs);

  useEffect(() => {
    if (!normalClientIsReady || !normalClient) return;

    if (normalClient.accountSubscriber instanceof PollingNormalClientAccountSubscriber) {
      if (idle10Minutes) {
        wasIdle.current = true;
        normalClient.accountSubscriber.updateAccountLoaderPollingFrequency(
          IDLE_10_MIN_POLLING_RATE
        );
        setCommonNormalStore((s) => {
          s.pollingMultiplier = IDLE_10_MIN_POLLING_MULTIPLIER;
        });
      } else if (idle1Minute) {
        wasIdle.current = true;
        normalClient.accountSubscriber.updateAccountLoaderPollingFrequency(IDLE_1_MIN_POLLING_RATE);
        setCommonNormalStore((s) => {
          s.pollingMultiplier = IDLE_1_MIN_POLLING_MULTIPLIER;
        });
      } else if (wasIdle.current) {
        wasIdle.current = false;
        normalClient.accountSubscriber.updateAccountLoaderPollingFrequency(basePollingRateMs);
        setCommonNormalStore((s) => {
          s.pollingMultiplier = 1;
        });
      }
    }
  }, [idle1Minute, idle10Minutes, normalClientIsReady, basePollingRateMs]);
};

export default useIdlePollingRateSwitcher;
