export interface TokenData {
  name: string;
  symbol: string;
  mentionPercentage: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface TokenTrendsResponse {
  network: string;
  count: number;
  timestamp: string;
  tokens: TokenData[];
}

// Định dạng cho câu trả lời phân tích
export interface TokenAnalysisResult {
  summary: string;
  topTokens: string[];
  sentimentAnalysis: string;
  recommendations: string[];
  trendingPairs?: string[];
}

// Thêm các interface mới cho phân tích AI

// Định dạng cho phân tích token theo danh mục
export interface CategoryTokenAnalysis {
  category: string;
  tokens: TokenData[];
  analysis: string;
  recommendation?: string;
}

// Định dạng cho phân tích chi tiết theo danh mục
export interface DetailedCategoryAnalysis {
  topcoin?: {
    tokens: TokenData[];
    analysis: string;
    timeframe: string;
  };
  trendingTokens?: {
    tokens: TokenData[];
    analysis: string;
    timeframe: string;
  };
  balance?: {
    tokens: {
      symbol: string;
      amount: number;
      value: number;
    }[];
    totalValue: number;
  };
  transfer?: {
    from: string;
    to: string;
    amount: number;
    token: string;
    status: string;
  };
  swap?: {
    fromToken: string;
    toToken: string;
    rate: number;
    impact: string;
    recommendation: string;
  };
  stake?: {
    token: string;
    apy: number;
    period: string;
    rewards: string;
  };
  getStake?: {
    stakedAmount: number;
    token: string;
    rewards: number;
    since: string;
  };
  unstake?: {
    amount: number;
    token: string;
    penalty: number;
    processingTime: string;
  };
  stakeSuilend?: {
    apy: number;
    token: string;
    lockPeriod: string;
    risks: string[];
  };
  withdrawSuilend?: {
    amount: number;
    token: string;
    processingTime: string;
  };
  lendingSuilend?: {
    pools: {
      token: string;
      apy: number;
      liquidity: number;
    }[];
  };
  getVaults?: {
    vaults: {
      name: string;
      tvl: number;
      apy: number;
      risk: string;
    }[];
  };
  deployToken?: {
    steps: string[];
    requirements: string[];
    estimatedCost: number;
  };
}

// Định dạng cho phản hồi AI tổng hợp
export interface AIResponse {
  query: string;
  detectedCategory: string;
  confidence: number;
  summary: string;
  detailedAnalysis: DetailedCategoryAnalysis;
  relatedTokens: TokenData[];
  suggestedActions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  timestamp: string;
}
