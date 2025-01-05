import {
	NormalMarketInfo,
	NormalPriorityFeeLevels,
	NormalPriorityFeeResponse,
	fetchNormalPriorityFee,
} from './normalPriorityFeeMethod';
import {
	DEFAULT_PRIORITY_FEE_MAP_FREQUENCY_MS,
	PriorityFeeSubscriberMapConfig,
} from './types';

/**
 * takes advantage of /batchPriorityFees endpoint from normal hosted priority fee service
 */
export class PriorityFeeSubscriberMap {
	frequencyMs: number;
	intervalId?: ReturnType<typeof setTimeout>;

	normalMarkets?: NormalMarketInfo[];
	normalPriorityFeeEndpoint?: string;
	feesMap: Map<string, Map<number, NormalPriorityFeeLevels>>; // marketType -> marketIndex -> priority fee

	public constructor(config: PriorityFeeSubscriberMapConfig) {
		this.frequencyMs = config.frequencyMs;
		this.frequencyMs =
			config.frequencyMs ?? DEFAULT_PRIORITY_FEE_MAP_FREQUENCY_MS;
		this.normalPriorityFeeEndpoint = config.normalPriorityFeeEndpoint;
		this.normalMarkets = config.normalMarkets;
		this.feesMap = new Map<string, Map<number, NormalPriorityFeeLevels>>();
		this.feesMap.set('perp', new Map<number, NormalPriorityFeeLevels>());
		this.feesMap.set('spot', new Map<number, NormalPriorityFeeLevels>());
	}

	private updateFeesMap(normalPriorityFeeResponse: NormalPriorityFeeResponse) {
		normalPriorityFeeResponse.forEach((fee: NormalPriorityFeeLevels) => {
			this.feesMap.get(fee.marketType)!.set(fee.marketIndex, fee);
		});
	}

	public async subscribe(): Promise<void> {
		if (this.intervalId) {
			return;
		}

		await this.load();
		this.intervalId = setInterval(this.load.bind(this), this.frequencyMs);
	}

	public async unsubscribe(): Promise<void> {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
	}

	public async load(): Promise<void> {
		try {
			if (!this.normalMarkets) {
				return;
			}
			const fees = await fetchNormalPriorityFee(
				this.normalPriorityFeeEndpoint!,
				this.normalMarkets.map((m) => m.marketType),
				this.normalMarkets.map((m) => m.marketIndex)
			);
			this.updateFeesMap(fees);
		} catch (e) {
			console.error('Error fetching normal priority fees', e);
		}
	}

	public updateMarketTypeAndIndex(normalMarkets: NormalMarketInfo[]) {
		this.normalMarkets = normalMarkets;
	}

	public getPriorityFees(
		marketType: string,
		marketIndex: number
	): NormalPriorityFeeLevels | undefined {
		return this.feesMap.get(marketType)?.get(marketIndex);
	}
}

/** Example usage:
async function main() {
    const normalMarkets: NormalMarketInfo[] = [
        { marketType: 'perp', marketIndex: 0 },
        { marketType: 'perp', marketIndex: 1 },
        { marketType: 'spot', marketIndex: 2 }
    ];

    const subscriber = new PriorityFeeSubscriberMap({
        normalPriorityFeeEndpoint: 'https://dlob.normal.trade',
        frequencyMs: 5000,
        normalMarkets
    });
    await subscriber.subscribe();

    for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        normalMarkets.forEach(market => {
            const fees = subscriber.getPriorityFees(market.marketType, market.marketIndex);
            console.log(`Priority fees for ${market.marketType} market ${market.marketIndex}:`, fees);
        });
    }


    await subscriber.unsubscribe();
}

main().catch(console.error);
*/
