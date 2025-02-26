import { PublicKey } from '@solana/web3.js';
import { useEffect, useRef } from 'react';
import { useNormalClientIsReady } from './useNormalClientIsReady';
import { useCommonNormalStore } from '../stores';
import { useCommonNormalActions } from './useCommonNormalActions';

export const useEmulation = () => {
  const actions = useCommonNormalActions();
  const normalClientIsReady = useNormalClientIsReady();
  const setCommonStore = useCommonNormalStore((s) => s.set);

  let urlAuthorityParam = '';
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    urlAuthorityParam = searchParams.get('authority') ?? '';
  }

  const alreadyUsedRouteParams = useRef(false);

  // Handle query params from router
  useEffect(() => {
    if (!normalClientIsReady) return;

    if (urlAuthorityParam) {
      alreadyUsedRouteParams.current = true;

      // Must be trying to emulate an account
      //// Sometimes users accidentally type random things into the address bar which aren't a public key - avoid sending error about this and do nothing
      try {
        const authority = new PublicKey(urlAuthorityParam);
        setCommonStore((s) => {
          s.authority = authority;
          s.authorityString = `authority=${authority.toString()}`;
        });
        actions.emulateAccount({ authority });
      } catch (e) {
        console.log('no authority: ' + urlAuthorityParam);
      }
    } else {
      setCommonStore((s) => {
        s.authorityString = '';
      });
    }
  }, [urlAuthorityParam, normalClientIsReady]);

  return null;
};
