export interface MarketData {
  description: number[];
  end_time: string;
  fee_percentage: string;
  id: string;
  is_resolved: boolean;
  no_pool: string;
  owner: string;
  result: boolean;
  start_time: string;
  title: number[];
  yes_pool: string;
}

export interface FormattedMarket {
  id: string;
  title: string;
  description: string; 
  endTime: number;
  feePercentage: number;
  isResolved: boolean;
  noPool: number;
  yesPool: number;
  owner: string;
  result: boolean;
  startTime: number;
}
