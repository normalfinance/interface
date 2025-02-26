// import toast from 'react-hot-toast';
// import { MarketAccount } from '@normalfinance/solana-sdk';
// import { BN, NormalClient } from '@normalfinance/solana-sdk';
// import { PublicKey, TransactionSignature } from '@solana/web3.js';

// export const depositMarketCollateral = async (
//   normalClient: NormalClient,
//   market: MarketAccount,
//   amount: BN,
//   vaultDepositor?: VaultDepositor
// ): Promise<TransactionSignature | undefined> => {
//   if (!vaultDepositor && vault.permissioned) {
//     toast.error('You are not authorized to deposit into this vault');
//     return undefined;
//   }

//   const authority = normalClient.authority;
//   const toastId = 'depositVault';

//   try {
//     toast.loading('Awaiting transaction confirmation', {
//       id: toastId,
//     });

//     let txSig: TransactionSignature;

//     if (!vaultDepositor) {
//       if (!authority) {
//         toast.error('Please connect your wallet to deposit into this vault');
//         return undefined;
//       }

//       const vaultDepositorPubkey = VaultDepositorAccount.getAddressSync(
//         VAULT_PROGRAM_ID,
//         vault.pubkey,
//         authority
//       );

//       txSig = await normalClient.depositCollateral(vaultDepositorPubkey, amount, {
//         authority,
//         vault: vault.pubkey,
//       });
//     } else {
//       txSig = await normalClient.depositCollateral(vaultDepositor.pubkey, amount, undefined);
//     }

//     toast.success('Deposit successful!');

//     return txSig;
//   } catch (e) {
//     console.error(e);
//     toast.error('There was an error depositing into this vault');
//     return undefined;
//   }
// };

// export const withdrawCollateralFromMarket = async (
//   normalClient: NormalClient,
//   vaultDepositor: VaultDepositor,
//   vaultClient: VaultClient
// ): Promise<TransactionSignature | undefined> => {
//   if (!vaultClient || !vaultDepositor) {
//     console.error('No vault client or vault depositor provided');
//     return undefined;
//   }

//   try {
//     toast.loading('Awaiting transaction confirmation');

//     const txSig = await normalClient.withdrawCollateral(vaultDepositor.pubkey);

//     toast.success('Withdrawal successful');

//     return txSig;
//   } catch (err) {
//     console.error(err);
//     toast.error('There was an error withdrawing from this vault');
//     return undefined;
//   }
// };
