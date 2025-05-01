import { TransactionResult } from '../lib/WalletAdapter';
import './TransactionDetails.css';

interface TransactionDetailsProps {
  txResult: TransactionResult;
}

export const TransactionDetails = ({ txResult }: TransactionDetailsProps) => {
  if (!txResult) return null;

  return (
    <div className="transaction-details">
      <div className="transaction-status">
        {txResult.loading && <div className="status loading">Processing...</div>}
        {txResult.error && <div className="status error">Error: {txResult.error}</div>}
        {txResult.success && <div className="status success">Transaction Successful!</div>}
      </div>

      {txResult.success && (
        <div className="transaction-info">
          <h3>Transaction Details</h3>
          <div className="info-row">
            <span className="label">Transaction ID:</span>
            <span className="value">{txResult.txId}</span>
          </div>
          
          {txResult.marketDetails && (
            <>
              <h3>Market Details</h3>
              <div className="info-row">
                <span className="label">Market ID:</span>
                <span className="value">{txResult.marketDetails.marketId}</span>
              </div>
              <div className="info-row">
                <span className="label">Title:</span>
                <span className="value">{txResult.marketDetails.title}</span>
              </div>
              <div className="info-row">
                <span className="label">Description:</span>
                <span className="value">{txResult.marketDetails.description}</span>
              </div>
              <div className="info-row">
                <span className="label">Min Amount:</span>
                <span className="value">{txResult.marketDetails.minAmount} SUI</span>
              </div>
              <div className="info-row">
                <span className="label">Resolution Time:</span>
                <span className="value">
                  {new Date(txResult.marketDetails.resolutionTime! * 1000).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
