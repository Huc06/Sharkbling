export interface StatsSummaryProps {
    icon: React.ComponentType<{ 
      className?: string;
      size?: number | string  // Allow string values for size
    }>;
    value: string | number;
    label: string;
    change?: string;
  }