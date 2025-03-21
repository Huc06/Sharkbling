module social_prediction::prediction_market {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::vec_map::{Self, VecMap};
    use sui::dynamic_object_field as dof;
    use std::string::{Self, String};
    use std::vector;
    use std::option::{Self, Option};

    // Error codes
    const EMarketNotActive: u64 = 0;
    const EMarketAlreadyEnded: u64 = 1;
    const EMarketNotEnded: u64 = 2;
    const EMarketAlreadyResolved: u64 = 3;
    const EInvalidPrediction: u64 = 4;
    const EInvalidAmount: u64 = 5;
    const EInsufficientBalance: u64 = 6;
    const EInvalidMarketId: u64 = 7;
    const EMarketEnded: u64 = 8;
    const ENotAuthorized: u64 = 9;
    const EAlreadyClaimed: u64 = 10;
    const EPredictionNotFound: u64 = 11;

    // Market status
    const MARKET_STATUS_ACTIVE: u8 = 0;
    const MARKET_STATUS_ENDED: u8 = 1;
    const MARKET_STATUS_RESOLVED: u8 = 2;

    // Prediction direction
    const PREDICTION_YES: bool = true;
    const PREDICTION_NO: bool = false;

    // Market result
    const RESULT_PENDING: u8 = 0;
    const RESULT_YES: u8 = 1;
    const RESULT_NO: u8 = 2;

    // Shared resource representing the prediction market platform
    struct PredictionMarketPlatform has key {
        id: UID,
        admin: address,
        fee_percentage: u64, // Fee percentage in basis points (e.g. 100 = 1%)
        fee_balance: Coin<SUI>,
        market_count: u64,
    }

    // Represents a single prediction market
    struct Market has key, store {
        id: UID,
        market_id: u64,
        creator: address,
        title: String,
        description: String,
        platform: String, // "GitHub", "LinkedIn", "Farcaster", "Discord"
        content_url: String,
        end_time: u64, // Unix timestamp when market ends
        market_fee: u64, // Fee percentage specific to this market (in basis points)
        status: u8, // 0: active, 1: ended, 2: resolved
        result: u8, // 0: pending, 1: yes, 2: no
        yes_pool: u64, // Total amount in yes pool
        no_pool: u64, // Total amount in no pool
        total_predictions: u64,
        creation_time: u64, // Unix timestamp when market was created
        resolution_method: String, // How the market will be resolved ("Automatic", "Community", "Oracle")
    }

    // Represents a user's prediction in a market
    struct Prediction has key, store {
        id: UID,
        prediction_id: u64,
        market_id: u64,
        user: address,
        prediction: bool, // true: yes, false: no
        amount: u64, // Amount of SUI
        odds: u64, // Odds at time of prediction (in basis points, e.g. 15000 = 1.5x)
        claimed: bool, // Whether winnings have been claimed
        timestamp: u64, // When the prediction was made
    }

    // Events
    struct MarketCreated has copy, drop {
        market_id: ID,
        creator: address,
        title: String,
        end_time: u64,
        initial_pool: u64,
    }

    struct PredictionPlaced has copy, drop {
        prediction_id: ID,
        market_id: ID,
        user: address,
        prediction: bool,
        amount: u64,
        odds: u64,
    }

    struct MarketResolved has copy, drop {
        market_id: ID,
        result: u8,
        yes_pool: u64,
        no_pool: u64,
    }

    struct WinningsClaimed has copy, drop {
        prediction_id: ID,
        market_id: ID,
        user: address,
        amount: u64,
    }

    // Initialize the prediction market platform
    fun init(ctx: &mut TxContext) {
        let platform = PredictionMarketPlatform {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            fee_percentage: 100, // Default 1%
            fee_balance: coin::zero(ctx),
            market_count: 0,
        };
        
        transfer::share_object(platform);
    }

    // Create a new prediction market
    public entry fun create_market(
        platform: &mut PredictionMarketPlatform,
        title: vector<u8>,
        description: vector<u8>,
        platform_name: vector<u8>,
        content_url: vector<u8>,
        end_time: u64,
        market_fee: u64,
        initial_pool: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let initial_pool_value = coin::value(&initial_pool);
        
        // Ensure minimum initial pool amount (e.g. 50 SUI)
        assert!(initial_pool_value >= 50_000_000_000, EInvalidAmount);
        
        // Cap market fee at 5%
        assert!(market_fee <= 500, EInvalidAmount);
        
        // Ensure end time is in the future
        let current_time = clock::timestamp_ms(clock) / 1000; // Convert from ms to seconds
        assert!(end_time > current_time, EInvalidAmount);
        
        // Create the new market with a unique ID
        platform.market_count = platform.market_count + 1;
        
        let market_id = platform.market_count;
        
        // Split initial pool equally between yes and no for initial odds
        let half_pool = coin::value(&initial_pool) / 2;
        let yes_pool = half_pool;
        let no_pool = coin::value(&initial_pool) - half_pool;
        
        // Take platform fee from initial pool
        let fee_amount = (coin::value(&initial_pool) * platform.fee_percentage) / 10000;
        let fee_coin = coin::split(&mut initial_pool, fee_amount, ctx);
        coin::join(&mut platform.fee_balance, fee_coin);
        
        // Create the market object
        let market = Market {
            id: object::new(ctx),
            market_id,
            creator: sender,
            title: string::utf8(title),
            description: string::utf8(description),
            platform: string::utf8(platform_name),
            content_url: string::utf8(content_url),
            end_time,
            market_fee,
            status: MARKET_STATUS_ACTIVE,
            result: RESULT_PENDING,
            yes_pool,
            no_pool,
            total_predictions: 0,
            creation_time: current_time,
            resolution_method: string::utf8(b"Automatic"), // Default to automatic
        };
        
        // Transfer remaining initial pool to market
        transfer::public_transfer(initial_pool, sender);
        
        // Emit event
        event::emit(MarketCreated {
            market_id: object::id(&market),
            creator: sender,
            title: market.title,
            end_time: market.end_time,
            initial_pool: initial_pool_value,
        });
        
        // Share the market object
        transfer::share_object(market);
    }

    // Place a prediction on a market
    public entry fun place_prediction(
        platform: &mut PredictionMarketPlatform,
        market: &mut Market,
        prediction: bool,
        amount: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let amount_value = coin::value(&amount);
        
        // Check market is still active
        let current_time = clock::timestamp_ms(clock) / 1000;
        assert!(market.status == MARKET_STATUS_ACTIVE, EMarketNotActive);
        assert!(current_time < market.end_time, EMarketEnded);
        
        // Ensure minimum bet amount (e.g. 1 SUI)
        assert!(amount_value >= 1_000_000_000, EInvalidAmount);
        
        // Calculate odds based on current pools
        let total_pool = market.yes_pool + market.no_pool;
        let odds = if (prediction == PREDICTION_YES) {
            // If predicting YES, odds are based on ratio of total_pool to yes_pool
            // Multiply by 10000 for precision (later divide by 10000 to get the final odds)
            if (market.yes_pool > 0) {
                (total_pool * 10000) / market.yes_pool
            } else {
                20000 // Default 2x odds if pool is empty
            }
        } else {
            // If predicting NO, odds are based on ratio of total_pool to no_pool
            if (market.no_pool > 0) {
                (total_pool * 10000) / market.no_pool
            } else {
                20000 // Default 2x odds if pool is empty
            }
        };
        
        // Take platform fee
        let fee_amount = (amount_value * market.market_fee) / 10000;
        let fee_coin = coin::split(&mut amount, fee_amount, ctx);
        coin::join(&mut platform.fee_balance, fee_coin);
        
        // Add prediction amount to appropriate pool
        if (prediction == PREDICTION_YES) {
            market.yes_pool = market.yes_pool + (amount_value - fee_amount);
        } else {
            market.no_pool = market.no_pool + (amount_value - fee_amount);
        }
        
        // Create prediction object
        market.total_predictions = market.total_predictions + 1;
        let prediction_id = market.total_predictions;
        
        let prediction_obj = Prediction {
            id: object::new(ctx),
            prediction_id,
            market_id: market.market_id,
            user: sender,
            prediction,
            amount: amount_value - fee_amount, // Amount after fee
            odds,
            claimed: false,
            timestamp: current_time,
        };
        
        // Store the prediction as a child object of the market
        let prediction_uid = object::uid_to_inner(&prediction_obj.id);
        dof::add(&mut market.id, prediction_uid, prediction_obj);
        
        // Transfer remaining coins to market creator (simplified pool management)
        transfer::public_transfer(amount, market.creator);
        
        // Emit event
        event::emit(PredictionPlaced {
            prediction_id: object::uid_to_inner(&market.id),
            market_id: object::id(market),
            user: sender,
            prediction,
            amount: amount_value - fee_amount,
            odds,
        });
    }

    // End a market (can be called by admin or automatically)
    public entry fun end_market(
        market: &mut Market,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only market creator or admin can end a market before end time
        let current_time = clock::timestamp_ms(clock) / 1000;
        
        // Check if market has reached end time
        let is_admin = sender == market.creator; 
        
        // Allow automatic ending if current time > end time
        if (current_time >= market.end_time || is_admin) {
            assert!(market.status == MARKET_STATUS_ACTIVE, EMarketAlreadyEnded);
            market.status = MARKET_STATUS_ENDED;
        } else {
            // If not admin and not past end time, revert
            assert!(false, ENotAuthorized);
        }
    }

    // Resolve a market (set the final result)
    public entry fun resolve_market(
        market: &mut Market,
        result: bool, // true for YES, false for NO
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only market creator can resolve for now
        // In a real implementation, would use oracle or social media API data
        assert!(sender == market.creator, ENotAuthorized);
        
        // Ensure market is ended but not resolved
        assert!(market.status == MARKET_STATUS_ENDED, EMarketNotEnded);
        assert!(market.result == RESULT_PENDING, EMarketAlreadyResolved);
        
        // Set the result and mark as resolved
        market.result = if (result) RESULT_YES else RESULT_NO;
        market.status = MARKET_STATUS_RESOLVED;
        
        // Emit event
        event::emit(MarketResolved {
            market_id: object::id(market),
            result: market.result,
            yes_pool: market.yes_pool,
            no_pool: market.no_pool,
        });
    }

    // Claim winnings from a resolved market
    public entry fun claim_winnings(
        market: &mut Market,
        prediction_id: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure market is resolved
        assert!(market.status == MARKET_STATUS_RESOLVED, EMarketNotEnded);
        
        // Get the prediction
        let prediction_uid = dof::borrow_mut<u64, Prediction>(&mut market.id, prediction_id);
        
        // Check prediction belongs to sender
        assert!(prediction_uid.user == sender, ENotAuthorized);
        
        // Check prediction has not already been claimed
        assert!(!prediction_uid.claimed, EAlreadyClaimed);
        
        // Check if prediction matches result
        let is_winner = (market.result == RESULT_YES && prediction_uid.prediction == PREDICTION_YES) ||
                        (market.result == RESULT_NO && prediction_uid.prediction == PREDICTION_NO);
        
        if (is_winner) {
            // Calculate winnings (amount * odds / 10000)
            let winnings_amount = (prediction_uid.amount * prediction_uid.odds) / 10000;
            
            // Create coin object for winnings
            let winnings = coin::mint_for_testing<SUI>(winnings_amount, ctx);
            
            // Transfer winnings to user
            transfer::public_transfer(winnings, sender);
            
            // Mark prediction as claimed
            prediction_uid.claimed = true;
            
            // Emit event
            event::emit(WinningsClaimed {
                prediction_id: object::uid_to_inner(&prediction_uid.id),
                market_id: object::id(market),
                user: sender,
                amount: winnings_amount,
            });
        } else {
            // Mark as claimed even if user lost (to avoid repeated claim attempts)
            prediction_uid.claimed = true;
        }
    }

    // Get market details
    public fun get_market_details(market: &Market): (
        String, String, String, String, u64, u8, u8, u64, u64, u64
    ) {
        (
            market.title,
            market.description,
            market.platform,
            market.content_url,
            market.end_time,
            market.status,
            market.result,
            market.yes_pool,
            market.no_pool,
            market.total_predictions
        )
    }

    // Check if a user has a prediction in a market
    public fun has_prediction(
        market: &Market, 
        user: address,
        prediction_id: u64
    ): bool {
        if (dof::exists_(&market.id, prediction_id)) {
            let prediction = dof::borrow<u64, Prediction>(&market.id, prediction_id);
            prediction.user == user
        } else {
            false
        }
    }

    // Get prediction details
    public fun get_prediction_details(
        market: &Market,
        prediction_id: u64
    ): (address, bool, u64, u64, bool, u64) {
        assert!(dof::exists_(&market.id, prediction_id), EPredictionNotFound);
        
        let prediction = dof::borrow<u64, Prediction>(&market.id, prediction_id);
        (
            prediction.user,
            prediction.prediction,
            prediction.amount,
            prediction.odds,
            prediction.claimed,
            prediction.timestamp
        )
    }

    // Admin function to update platform fee
    public entry fun update_platform_fee(
        platform: &mut PredictionMarketPlatform,
        new_fee: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only admin can update fee
        assert!(sender == platform.admin, ENotAuthorized);
        
        // Cap fee at 5%
        assert!(new_fee <= 500, EInvalidAmount);
        
        platform.fee_percentage = new_fee;
    }

    // Admin function to withdraw platform fees
    public entry fun withdraw_platform_fees(
        platform: &mut PredictionMarketPlatform,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only admin can withdraw fees
        assert!(sender == platform.admin, ENotAuthorized);
        
        // Ensure sufficient balance
        assert!(coin::value(&platform.fee_balance) >= amount, EInsufficientBalance);
        
        // Split and transfer the requested amount
        let fee_coin = coin::split(&mut platform.fee_balance, amount, ctx);
        transfer::public_transfer(fee_coin, sender);
    }

    // Tests
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
