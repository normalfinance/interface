import toast from 'react-hot-toast';
import { NormalClient } from '@normalfinance/solana-sdk';
import { TransactionSignature } from '@solana/web3.js';

export const updateUserName = async (
  normalClient: NormalClient,
  name: string,
  subAccountId?: number
): Promise<TransactionSignature | undefined> => {
  if (!normalClient || !name) {
    console.error('No Normal client or username provided');
    return undefined;
  }

  try {
    toast.loading('Awaiting transaction confirmation');

    const txSig = await normalClient.updateUserName(name, subAccountId);

    toast.success('Update user name successful');

    return txSig;
  } catch (err) {
    console.error(err);
    toast.error('There was an error updating the user name');
    return undefined;
  }
};

export const reclaimRent = async (
  normalClient: NormalClient,
  subAccountId?: number
): Promise<TransactionSignature | undefined> => {
  if (!normalClient) {
    console.error('No Normal client provided');
    return undefined;
  }

  try {
    toast.loading('Awaiting transaction confirmation');

    const txSig = await normalClient.reclaimRent();

    toast.success('Reclaim rent successful');

    return txSig;
  } catch (err) {
    console.error(err);
    toast.error('There was an error reclaiming rent');
    return undefined;
  }
};

export const deleteUser = async (
  normalClient: NormalClient,
  subAccountId?: number
): Promise<TransactionSignature | undefined> => {
  if (!normalClient) {
    console.error('No Normal client provided');
    return undefined;
  }

  toast.loading('Awaiting transaction confirmation');

  try {
    const txSig = await normalClient.deleteUser();

    toast.success('User deleted');

    return txSig;
  } catch (err) {
    console.error(err);
    toast.error('There was an error deleting the user');
    return undefined;
  }
};
