
module prediction_market::prediction_market {
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::event;

    /// Custom errors
    const EMarketNotActive: u64 = 0;
    const EMarketEnded: u64 = 1;
    const EMarketNotResolved: u64 = 2;
    const EMarketNotEnded: u64 = 3;
    const EMarketAlreadyResolved: u64 = 4;
    const EInvalidOwner: u64 = 5;
    const EAlreadyClaimed: u64 = 6;

    struct PredictionMarket has key {
        id: UID,
        owner: address,
        title: vector<u8>,
        description: vector<u8>,
        start_time: u64,
        end_time: u64,
        yes_pool: Balance<SUI>,
        no_pool: Balance<SUI>,
        is_resolved: bool,
        result: bool,
        fee_percentage: u64,
    }

    struct Prediction has key {
        id: UID,
        market_id: address,
        is_yes: bool,
        amount: u64,
        claimed: bool,
    }

    // Events
    struct MarketCreated has copy, drop {
        market_id: ID,
        title: vector<u8>,
        description: vector<u8>,
        end_time: u64,
    }

    struct PredictionPlaced has copy, drop {
        prediction_id: ID,
        market_id: ID,
        is_yes: bool,
        amount: u64,
    }

    struct MarketResolved has copy, drop {
        market_id: ID,
        result: bool,
    }

    public entry fun create_market(
        title: vector<u8>,
        description: vector<u8>,
        end_time: u64,
        fee_percentage: u64,
        initial_balance: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let market = PredictionMarket {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            title,
            description,
            start_time: tx_context::epoch(ctx),
            end_time,
            yes_pool: balance::zero(),
            no_pool: balance::zero(),
            is_resolved: false,
            result: false,
            fee_percentage,
        };

        // Add initial liquidity
        let initial_bal = coin::into_balance(initial_balance);
        let half_amount = balance::value(&initial_bal) / 2;
        let split_balance = balance::split(&mut initial_bal, half_amount);
        balance::join(&mut market.yes_pool, split_balance);
        balance::join(&mut market.no_pool, initial_bal);

        event::emit(MarketCreated {
            market_id: object::uid_to_inner(&market.id),
            title: market.title,
            description: market.description,
            end_time: market.end_time,
        });

        transfer::share_object(market);
    }

    public entry fun place_prediction(
        market: &mut PredictionMarket,
        prediction_coin: Coin<SUI>,
        is_yes: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::epoch(ctx) < market.end_time, EMarketEnded);

        let prediction = Prediction {
            id: object::new(ctx),
            market_id: object::uid_to_address(&market.id),
            is_yes,
            amount: coin::value(&prediction_coin),
            claimed: false,
        };

        let prediction_balance = coin::into_balance(prediction_coin);

        if (is_yes) {
            balance::join(&mut market.yes_pool, prediction_balance);
        } else {
            balance::join(&mut market.no_pool, prediction_balance);
        }

        event::emit(PredictionPlaced {
            prediction_id: object::uid_to_inner(&prediction.id),
            market_id: object::uid_to_inner(&market.id),
            is_yes: prediction.is_yes,
            amount: prediction.amount,
        });

        transfer::transfer(prediction, tx_context::sender(ctx));
    }

    public entry fun resolve_market(
        market: &mut PredictionMarket,
        result: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == market.owner, EInvalidOwner);
        assert!(tx_context::epoch(ctx) >= market.end_time, EMarketNotEnded);
        assert!(!market.is_resolved, EMarketAlreadyResolved);

        market.is_resolved = true;
        market.result = result;

        event::emit(MarketResolved {
            market_id: object::uid_to_inner(&market.id),
            result
        });
    }

    public fun claim_winnings(
        market: &mut PredictionMarket,
        prediction: &mut Prediction,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(market.is_resolved, EMarketNotResolved);
        assert!(!prediction.claimed, EAlreadyClaimed);
        assert!(prediction.market_id == object::uid_to_address(&market.id), 0);
        
        let winning_amount = if (prediction.is_yes == market.result) {
            let total_pool = balance::value(&market.yes_pool) + balance::value(&market.no_pool);
            let fee_amount = (total_pool * market.fee_percentage) / 100;
            let winning_pool = total_pool - fee_amount;
            (winning_pool * prediction.amount) / (if (market.result) {
                balance::value(&market.yes_pool)
            } else {
                balance::value(&market.no_pool)
            })
        } else {
            0
        };

        prediction.claimed = true;

        if (prediction.is_yes) {
            coin::from_balance(balance::split(&mut market.yes_pool, winning_amount), ctx)
        } else {
            coin::from_balance(balance::split(&mut market.no_pool, winning_amount), ctx)
        }
    }
}
