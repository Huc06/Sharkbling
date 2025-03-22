
module prediction_market::prediction_market {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct PredictionMarket has key {
        id: UID,
        title: vector<u8>,
        description: vector<u8>,
        end_time: u64,
        market_fee: u64,
        initial_pool: u64
    }

    public fun create_market(
        title: vector<u8>,
        description: vector<u8>,
        end_time: u64,
        market_fee: u64,
        initial_pool: u64,
        ctx: &mut TxContext
    ) {
        let market = PredictionMarket {
            id: object::new(ctx),
            title,
            description,
            end_time,
            market_fee,
            initial_pool
        };
        transfer::transfer(market, tx_context::sender(ctx));
    }
}
