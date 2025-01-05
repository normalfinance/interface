import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { configs, NormalClient, Wallet } from '@normalfinance/sdk';

async function main() {
	const normalConfig = configs['mainnet-beta'];
	const connection = new Connection('https://api.mainnet-beta.solana.com');

	const normalClient = new NormalClient({
		connection: connection,
		wallet: new Wallet(new Keypair()),
		programID: new PublicKey(normalConfig.NORMAL_PROGRAM_ID),
		userStats: true,
		env: 'mainnet-beta',
	});
	console.log(`normalClientSubscribed: ${await normalClient.subscribe()}`);

	const txHash =
		'3gvGQufckXGHrFDv4dNWEXuXKRMy3NZkKHMyFrAhLoYScaXXTGCp9vq58kWkfyJ8oDYZrz4bTyGayjUy9PKigeLS';

	const tx = await normalClient.connection.getParsedTransaction(txHash, {
		commitment: 'confirmed',
		maxSupportedTransactionVersion: 0,
	});

	let logIdx = 0;
	// @ts-ignore
	for (const event of normalClient.program._events._eventParser.parseLogs(
		tx!.meta!.logMessages
	)) {
		console.log('----------------------------------------');
		console.log(`Log ${logIdx++}`);
		console.log('----------------------------------------');
		console.log(`${JSON.stringify(event, null, 2)}`);
	}

	console.log('========================================');
	console.log('Raw transaction logs');
	console.log('========================================');
	console.log(JSON.stringify(tx!.meta!.logMessages, null, 2));

	process.exit(0);
}

main().catch(console.error);
