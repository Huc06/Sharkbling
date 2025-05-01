import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TransactionSuccessAlertProps {
  digest: string;
  network?: string;
}

export const TransactionSuccessAlert = ({ digest, network = 'testnet' }: TransactionSuccessAlertProps) => {
  const suiVisionUrl = `https://suiexplorer.com/txblock/${digest}?network=${network}`;

  return (
    <Alert className="bg-green-50 border-green-200 mb-4">
      <AlertTitle className="text-green-800">
        Transaction Successful!
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-green-700 mb-2">
          Transaction ID: <span className="font-mono">{digest}</span>
        </p>
        <a
          href={suiVisionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View on Sui Explorer →
        </a>
      </AlertDescription>
    </Alert>
  );
};
