import { Anchor } from "@normalfinance/types";
import { openTransferServer, TransferServer } from "./transfer-server";
import { fetchTransferInfos, TransferServerInfo } from "./info";
import { Asset, Networks } from "@stellar/stellar-sdk";
import { sep10AuthSend, sep10AuthSign, sep10AuthStart } from "../sep10";
// import { NETWORK_PASSPHRASE } from "../constants";
import { Deposit } from "./deposit";
import { SOROBAN_NETWORK_PASSPHRASE } from "../../constants";

/**
 * DepositManager class
 * Usage:
 *  const transferServer = await this.openTransferServer();
 *  const transferInfos = await this.fetchTransferInfos(transferServer);
 *  const { depositableAssets } = transferInfos;
 *  const token = await this.startSep10Auth(transferServer);
 *  return await this.handleDeposit(transferServer, depositableAssets, token);
 */
export class DepositManager {
  private anchor: Anchor;
  private walletAddress: string;

  constructor(anchor: Anchor, walletAddress: string) {
    this.anchor = anchor;
    this.walletAddress = walletAddress;
  }

  // Method to open the transfer server
  async openTransferServer(): Promise<TransferServer> {
    console.log("Opening transfer server", this.anchor);
    try {
      return await openTransferServer(this.anchor.domain, Networks.PUBLIC, {
        lang: "en",
        walletName: "Demo wallet",
      });
    } catch (error) {
      console.log("Error opening transfer server:", error);
      throw error;
    }
  }

  // Method to fetch transfer information
  async fetchTransferInfos(
    transferServer: TransferServer
  ): Promise<TransferServerInfo> {
    try {
      return await fetchTransferInfos(transferServer);
    } catch (error) {
      console.log("Error fetching transfer info:", error);
      throw error;
    }
  }

  // Method to start SEP-10 Authentication
  async startSep10Auth(transferServer: TransferServer): Promise<string> {
    try {
      const challengeTransaction = await sep10AuthStart({
        authEndpoint: transferServer.auth,
        serverSigningKey: transferServer.signingKey,
        publicKey: this.walletAddress,
        homeDomain: transferServer.domain,
        clientDomain: "app.phoenix-hub.io",
      });

      const signedChallengeTransaction = await sep10AuthSign({
        networkPassphrase: SOROBAN_NETWORK_PASSPHRASE,
        challengeTransaction,
      });

      return await sep10AuthSend({
        authEndpoint: transferServer.auth,
        signedChallengeTransaction,
      });
    } catch (error) {
      console.log("Error in SEP-10 Authentication:", error);
      throw error;
    }
  }

  // Method to handle the deposit process
  async handleDeposit(
    transferServer: TransferServer,
    depositableAssets: Asset[],
    token: string
  ): Promise<Window | null> {
    try {
      const deposit = Deposit(
        transferServer,
        depositableAssets[1],
        "GAFNG7UOA2FDD745PVHFYHSZEIMJ6NYY2BY7ONJ74MRZGHSU2NEHBZ74"
      );

      const instructions = await deposit.interactive(token);

      //@ts-ignore
      const url = new URL(instructions.data.url);
      return open(url.toString(), "popup", "width=500,height=800");
    } catch (error) {
      console.log("Error handling deposit:", error);
      throw error;
    }
  }
}
