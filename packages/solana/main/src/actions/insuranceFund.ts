import toast from 'react-hot-toast';
import { BN, NormalClient } from '@normalfinance/solana-sdk';
import { PublicKey, TransactionSignature } from '@solana/web3.js';

export const depositInsuranceFund = async (
  normalClient: NormalClient,
  amount: BN
): Promise<TransactionSignature | undefined> => {
  if (!normalClient || !amount) {
    console.error('No Normal client or amount provided');
    return undefined;
  }

  toast.loading('Awaiting transaction confirmation');

  try {
    const txSig = await normalClient.addInsuranceFundStake({
      amount,
    });

    toast.success('Stake successful!');

    return txSig;
  } catch (e) {
    console.error(e);
    toast.error('There was an error staking into the Insurance Fund');
    return undefined;
  }
};

export const requestInsuranceFundWithdrawal = async (
  ifDepositorPubKey: PublicKey,
  userSharesPercentage: BN,
  normalClient: NormalClient
): Promise<TransactionSignature | undefined> => {
  if (!normalClient) {
    console.error('No Normal client provided');
    return undefined;
  }

  try {
    toast.loading('Awaiting transaction confirmation');

    const txSig = await normalClient.requestRemoveInsuranceFundStake(
      ifDepositorPubKey,
      userSharesPercentage,
      WithdrawUnit.SHARES_PERCENT
    );

    toast.success('Withdrawal request successful');

    return txSig;
  } catch (err) {
    console.error(err);
    toast.error('There was an error requesting a withdrawal from the Insurance Fund');
    return undefined;
  }
};

export const cancelInsuranceFundWithdrawalRequest = async (
  ifDepositorPubKey: PublicKey,
  normalClient: NormalClient
): Promise<TransactionSignature | undefined> => {
  if (!normalClient || !ifDepositorPubKey) {
    console.error('No Normal client or IF depositor pubkey provided');
    return undefined;
  }

  toast.loading('Awaiting transaction confirmation');

  try {
    const txSig = await normalClient.cancelRequestRemoveInsuranceFundStake(ifDepositorPubKey);

    toast.success('Withdrawal request canceled');

    return txSig;
  } catch (err) {
    console.error(err);
    toast.error('There was an error canceling a withdrawal request from the Insurance Fund');
    return undefined;
  }
};

export const withdrawFromInsuranceFund = async (
  normalClient: NormalClient
): Promise<TransactionSignature | undefined> => {
  if (!normalClient) {
    console.error('No Normal client or IF depositor provided');
    return undefined;
  }

  try {
    toast.loading('Awaiting transaction confirmation');

    const txSig = await normalClient.removeInsuranceFundStake();

    toast.success('Withdrawal successful');

    return txSig;
  } catch (err) {
    console.error(err);
    toast.error('There was an error withdrawing from the Insurance Fund');
    return undefined;
  }
};
