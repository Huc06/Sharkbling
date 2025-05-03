// Định nghĩa các loại hành động mà người dùng có thể yêu cầu
export type UserActionCategory = 
  | 'topcoin'
  | 'trendingTokens' 
  | 'balance'
  | 'transfer'
  | 'swap'
  | 'stake'
  | 'getStake'
  | 'unstake'
  | 'stakeSuilend'
  | 'withdrawSuilend'
  | 'lendingSuilend'
  | 'getVaults'
  | 'deployToken'
  | 'general';

// Cấu trúc cho kết quả phân tích câu hỏi người dùng
export interface UserQueryAnalysis {
  detectedIntent: UserActionCategory;
  confidence: number; // 0-100
  entities: {
    tokens?: string[];
    amount?: number;
    recipient?: string;
    timeframe?: string;
    network?: string;
  };
  suggestedAction?: string;
}

// Cấu trúc cho phản hồi AI chi tiết
export interface AIDetailedResponse {
  // Phần tóm tắt chung
  summary: string;
  
  // Phân tích theo danh mục
  categoryAnalysis: {
    topcoin?: {
      trending: TokenData[];
      recommendation: string;
    };
    trendingTokens?: {
      tokens: TokenData[];
      timeframe: string;
      insights: string;
    };
    balance?: {
      totalValue: number;
      tokenBreakdown: {
        token: string;
        amount: number;
        valueUSD: number;
      }[];
    };
    transfer?: {
      status: 'pending' | 'completed' | 'failed';
      details: string;
      txHash?: string;
    };
    swap?: {
      fromToken: string;
      toToken: string;
      exchangeRate: number;
      priceImpact: number;
      recommendation: string;
    };
    stake?: {
      apy: number;
      estimatedRewards: string;
      lockupPeriod?: string;
      recommendation: string;
    };
    getStake?: {
      totalStaked: number;
      rewards: number;
      unlockTime?: string;
    };
    unstake?: {
      amount: number;
      penalty?: number;
      processingTime: string;
    };
    stakeSuilend?: {
      apy: number;
      liquidityPool: number;
      risks: string[];
    };
    withdrawSuilend?: {
      amount: number;
      newBalance: number;
      processingTime: string;
    };
    lendingSuilend?: {
      availablePools: {
        token: string;
        apy: number;
        totalLiquidity: number;
      }[];
      recommendation: string;
    };
    getVaults?: {
      vaults: {
        name: string;
        tvl: number;
        apy: number;
        risk: 'low' | 'medium' | 'high';
      }[];
    };
    deployToken?: {
      steps: string[];
      estimatedCost: number;
      requirements: string[];
    };
    betScenario?:  {
      title: string;
      description: string;
    };
  };
  
  // Các token liên quan
  relatedTokens: TokenData[];
  
  // Các hành động được đề xuất
  suggestedActions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  
  // Các nguồn dữ liệu
  dataSources?: string[];
}

// Sử dụng lại TokenData từ TokenTrends.ts
import { TokenData } from './TokenTrends';

// Cấu trúc cho phản hồi AI ngắn gọn
export interface AISimpleResponse {
  answer: string;
  relatedTokens?: TokenData[];
  suggestedAction?: string;
}