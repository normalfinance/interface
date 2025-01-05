import { Horizon } from '@stellar/stellar-sdk';
import { constants } from '..';
/**
 * SorobanClient.Server instance, initialized using {@link SOROBAN_RPC_URL} used to
 * initialize this library.
 */
export const Server = new Horizon.Server(constants.SOROBAN_RPC_URL, {
  allowHttp: constants.SOROBAN_RPC_URL.startsWith('http://'),
});
