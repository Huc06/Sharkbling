
module prediction_market::prediction_market {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    /// Custom errors
    const EMarketNotActive: u64 = 0;
    const EMarketEnded: u64 = 1;
    const EMarketNotResolved: u64 = 2;
    const EMarketNotEnded: u64 = 3;
    const EMarketAlreadyResolved: u64 = 4;
    const EInvalidOwner: u64 = 5;
    const EAlreadyClaimed: u64 = 6;
    const EInvalidPrediction: u64 = 7;

    struct PredictionMarket has key {
        id: UID,
        title: vector<u8>,
        description: vector<u8>,
        end_time: u64,
        market_fee: u64,
        yes_pool: Balance<SUI>,
        no_pool: Balance<SUI>,
        is_resolved: bool,
        result: bool, // true for yes, false for no
        owner: address
    }

    struct Prediction has key {
        id: UID,
        market_id: address,
        user: address,
        amount: u64,
        is_yes: bool,
        claimed: bool
    }

    // Events
    struct MarketCreated has copy, drop {
        market_id: address,
        title: vector<u8>,
        end_time: u64
    }

    struct PredictionPlaced has copy, drop {
        market_id: address,
        user: address,
        amount: u64,
        is_yes: bool
    }

    struct MarketResolved has copy, drop {
        market_id: address,
        result: bool
    }

    public fun create_market(
        title: vector<u8>,
        description: vector<u8>,
        end_time: u64,
        market_fee: u64,
        initial_balance: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let market = PredictionMarket {
            id: object::new(ctx),
            title,
            description,
            end_time,
            market_fee,
            yes_pool: balance::zero(),
            no_pool: balance::zero(),
            is_resolved: false,
            result: false,
            owner: tx_context::sender(ctx)
        };

        // Add initial liquidity
        let initial_bal = coin::into_balance(initial_balance);
        balance::join(&mut market.yes_pool, balance::split(&mut initial_bal, balance::value(&initial_bal) / 2));
        balance::join(&mut market.no_pool, initial_bal);

        event::emit(MarketCreated {
            market_id: object::uid_to_address(&market.id),
            title: title,
            end_time: end_time
        });

        transfer::share_object(market);
    }

    public fun place_prediction(
        market: &mut PredictionMarket,
        payment: Coin<SUI>,
        is_yes: bool,
        ctx: &mut TxContext
    ) {
        assert!(!market.is_resolved, EMarketNotActive);
        assert!(tx_context::epoch(ctx) < market.end_time, EMarketEnded);

        let amount = coin::value(&payment);
        let prediction = Prediction {
            id: object::new(ctx),
            market_id: object::uid_to_address(&market.id),
            user: tx_context::sender(ctx),
            amount,
            is_yes,
            claimed: false
        };

        if (is_yes) {
            balance::join(&mut market.yes_pool, coin::into_balance(payment));
        } else {
            balance::join(&mut market.no_pool, coin::into_balance(payment));
        };

        event::emit(PredictionPlaced {
            market_id: object::uid_to_address(&market.id),
            user: tx_context::sender(ctx),
            amount,
            is_yes
        });

        transfer::transfer(prediction, tx_context::sender(ctx));
    }

    public fun resolve_market(
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
            market_id: object::uid_to_address(&market.id),
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
            // Calculate winnings based on pool sizes and original bet
            let total_pool = balance::value(&market.yes_pool) + balance::value(&market.no_pool);
            let win_amount = (prediction.amount * total_pool) / 
                           (if (market.result) balance::value(&market.yes_pool) 
                            else balance::value(&market.no_pool));
            win_amount
        } else {
            0
        };

        prediction.claimed = true;

        if (winning_amount > 0) {
            let pool = if (market.result) &mut market.yes_pool else &mut market.no_pool;
            coin::from_balance(balance::split(pool, winning_amount), ctx)
        } else {
            coin::zero(ctx)
        }
    }
}
