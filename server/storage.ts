import {
  type Market,
  type InsertMarket,
  type Prediction,
  type InsertPrediction,
  type SocialTrend,
  type InsertSocialTrend,
  type User,
  type InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Market methods
  getMarkets(): Promise<Market[]>;
  getMarketById(id: number): Promise<Market | undefined>;
  createMarket(market: InsertMarket): Promise<Market>;
  updateMarket(id: number, market: Partial<Market>): Promise<Market | undefined>;
  
  // Prediction methods
  getPredictions(marketId?: number, walletAddress?: string): Promise<Prediction[]>;
  getPredictionById(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePrediction(id: number, prediction: Partial<Prediction>): Promise<Prediction | undefined>;
  
  // Social trend methods
  getSocialTrends(platform?: string, limit?: number): Promise<SocialTrend[]>;
  createSocialTrend(trend: InsertSocialTrend): Promise<SocialTrend>;
  
  // User methods
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(walletAddress: string, user: Partial<User>): Promise<User | undefined>;
  getTopPredictors(limit?: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private markets: Map<number, Market>;
  private predictions: Map<number, Prediction>;
  private socialTrends: Map<number, SocialTrend>;
  private users: Map<string, User>;
  private marketIdCounter: number;
  private predictionIdCounter: number;
  private socialTrendIdCounter: number;
  private userIdCounter: number;

  constructor() {
    this.markets = new Map();
    this.predictions = new Map();
    this.socialTrends = new Map();
    this.users = new Map();
    this.marketIdCounter = 1;
    this.predictionIdCounter = 1;
    this.socialTrendIdCounter = 1;
    this.userIdCounter = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample markets
    const githubMarket: InsertMarket = {
      title: "Will Sui Framework reach 5,000 GitHub stars by Dec 31?",
      description: "Prediction market for Sui Framework GitHub repository",
      platform: "GitHub",
      contentUrl: "https://github.com/MystenLabs/sui",
      creatorAddress: "0x7de...f8a2",
      initialPool: 24580,
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      resolutionMethod: "Automatic",
      marketFee: 2,
      status: "active",
    };

    const linkedinMarket: InsertMarket = {
      title: "Will Mysten Labs' post about Move Language reach 1000+ reactions?",
      description: "Prediction market for Mysten Labs LinkedIn post",
      platform: "LinkedIn",
      contentUrl: "https://linkedin.com/company/mysten-labs",
      creatorAddress: "0x3ab...9c5d",
      initialPool: 12180,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      resolutionMethod: "Automatic",
      marketFee: 2,
      status: "active",
    };

    const linkedinMarket11: InsertMarket = {
      title: "Will Mysten Labs' post about Move Language reach 1000+ reactions?",
      description: "Prediction market for Mysten Labs LinkedIn post",
      platform: "LinkedIn",
      contentUrl: "https://linkedin.com/company/mysten-labs",
      creatorAddress: "0x3ab...9c5d",
      initialPool: 12180,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      resolutionMethod: "Automatic",
      marketFee: 2,
      status: "active",
    };
    const farcasterMarket: InsertMarket = {
      title: "Will the Farcaster post about Sui Prediction Markets exceed 500 recasts?",
      description: "Prediction market for Farcaster post about Sui",
      platform: "Farcaster",
      contentUrl: "https://farcaster.xyz",
      creatorAddress: "0x8fc...2e7b",
      initialPool: 18940,
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      resolutionMethod: "Automatic",
      marketFee: 2,
      status: "active",
    };

    this.createMarket(githubMarket);
    this.createMarket(linkedinMarket);
    this.createMarket(farcasterMarket);
    this.createMarket(linkedinMarket11);
    // Sample social trends
    const linkedinTrend: InsertSocialTrend = {
      platform: "LinkedIn",
      content: "Mysten Labs announced a new partnership with major DeFi protocols to build on Sui blockchain.",
      contentUrl: "https://linkedin.com/company/mysten-labs/posts/1",
      metrics: JSON.stringify({ likes: 348, comments: 52 }),
    };

    const githubTrend: InsertSocialTrend = {
      platform: "GitHub",
      content: "New PR merged: \"Add support for complex analytics in Move smart contracts\" has generated significant discussion.",
      contentUrl: "https://github.com/MystenLabs/sui/pull/123",
      metrics: JSON.stringify({ forks: 24, stars: 157 }),
    };

    const farcasterTrend: InsertSocialTrend = {
      platform: "Farcaster",
      content: "The Move Language community is discussing potential applications for prediction markets in DeFi.",
      contentUrl: "https://farcaster.xyz/posts/123",
      metrics: JSON.stringify({ recasts: 98, likes: 256 }),
    };

    this.createSocialTrend(linkedinTrend);
    this.createSocialTrend(githubTrend);
    this.createSocialTrend(farcasterTrend);

    // Sample top predictors
    const topPredictors = [
      { walletAddress: "0x7de...f8a2", predictionScore: 98 },
      { walletAddress: "0x3ab...9c5d", predictionScore: 95 },
      { walletAddress: "0x8fc...2e7b", predictionScore: 91 },
    ];

    topPredictors.forEach(predictor => {
      this.createUser({ walletAddress: predictor.walletAddress });
      this.updateUser(predictor.walletAddress, { 
        predictionScore: predictor.predictionScore,
        totalPredictions: 100,
        correctPredictions: Math.floor(predictor.predictionScore),
      });
    });
  }

  // Market methods
  async getMarkets(): Promise<Market[]> {
    return Array.from(this.markets.values());
  }

  async getMarketById(id: number): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async createMarket(market: InsertMarket): Promise<Market> {
    const id = this.marketIdCounter++;
    const yesPool = market.initialPool * 0.68; // Initial distribution for display
    const noPool = market.initialPool * 0.32;
    const createdAt = new Date();
    
    const newMarket: Market = {
      ...market,
      id,
      yesPool,
      noPool,
      createdAt,
      result: null,
    };
    
    this.markets.set(id, newMarket);
    return newMarket;
  }

  async updateMarket(id: number, market: Partial<Market>): Promise<Market | undefined> {
    const existingMarket = this.markets.get(id);
    if (!existingMarket) return undefined;
    
    const updatedMarket = { ...existingMarket, ...market };
    this.markets.set(id, updatedMarket);
    return updatedMarket;
  }

  // Prediction methods
  async getPredictions(marketId?: number, walletAddress?: string): Promise<Prediction[]> {
    let predictions = Array.from(this.predictions.values());
    
    if (marketId !== undefined) {
      predictions = predictions.filter(p => p.marketId === marketId);
    }
    
    if (walletAddress !== undefined) {
      predictions = predictions.filter(p => p.walletAddress === walletAddress);
    }
    
    return predictions;
  }

  async getPredictionById(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const id = this.predictionIdCounter++;
    const createdAt = new Date();
    
    const newPrediction: Prediction = {
      ...prediction,
      id,
      claimed: false,
      createdAt,
    };
    
    this.predictions.set(id, newPrediction);
    
    // Update market pools
    const market = await this.getMarketById(prediction.marketId);
    if (market) {
      if (prediction.prediction === "yes") {
        await this.updateMarket(market.id, { yesPool: market.yesPool + prediction.amount });
      } else {
        await this.updateMarket(market.id, { noPool: market.noPool + prediction.amount });
      }
    }
    
    // Update user stats
    const user = await this.getUserByWalletAddress(prediction.walletAddress);
    if (user) {
      await this.updateUser(prediction.walletAddress, {
        totalPredictions: user.totalPredictions + 1,
      });
    } else {
      await this.createUser({ walletAddress: prediction.walletAddress });
    }
    
    return newPrediction;
  }

  async updatePrediction(id: number, prediction: Partial<Prediction>): Promise<Prediction | undefined> {
    const existingPrediction = this.predictions.get(id);
    if (!existingPrediction) return undefined;
    
    const updatedPrediction = { ...existingPrediction, ...prediction };
    this.predictions.set(id, updatedPrediction);
    return updatedPrediction;
  }

  // Social trend methods
  async getSocialTrends(platform?: string, limit = 10): Promise<SocialTrend[]> {
    let trends = Array.from(this.socialTrends.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (platform !== undefined) {
      trends = trends.filter(t => t.platform === platform);
    }
    
    return trends.slice(0, limit);
  }

  async createSocialTrend(trend: InsertSocialTrend): Promise<SocialTrend> {
    const id = this.socialTrendIdCounter++;
    const timestamp = new Date();
    
    const newTrend: SocialTrend = {
      ...trend,
      id,
      timestamp,
    };
    
    this.socialTrends.set(id, newTrend);
    return newTrend;
  }

  // User methods
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return this.users.get(walletAddress);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    
    const newUser: User = {
      ...user,
      id,
      predictionScore: 0,
      totalPredictions: 0,
      correctPredictions: 0,
      nftsMinted: "[]",
      createdAt,
    };
    
    this.users.set(user.walletAddress, newUser);
    return newUser;
  }

  async updateUser(walletAddress: string, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(walletAddress);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(walletAddress, updatedUser);
    return updatedUser;
  }

  async getTopPredictors(limit = 3): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.predictionScore - a.predictionScore)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
