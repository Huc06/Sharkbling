import { useWallet } from "@/contexts/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

const ReputationNFTs = () => {
  const { walletAddress, isConnected } = useWallet();

  const { data: user } = useQuery<User | null>({
    queryKey: [`/api/users/${walletAddress}`],
    enabled: !!walletAddress && isConnected,
  });

  // Parse NFTs from string if they exist
  const nfts = user?.nftsMinted ? JSON.parse(user.nftsMinted) : [];
  const hasNFTs = nfts.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="border-b border-slate-200 p-5">
        <h3 className="font-medium text-slate-900">Reputation NFTs</h3>
      </div>
      
      <div className="p-5">
        <p className="text-sm text-slate-600 mb-4">Earn unique NFTs based on your prediction accuracy and participation.</p>
        
        {/* NFT Gallery Preview */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`aspect-square rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center`}>
            {hasNFTs && nfts.includes('rookie') ? (
              <i className="fas fa-award text-primary-500"></i>
            ) : (
              <i className="fas fa-lock text-primary-300"></i>
            )}
          </div>
          
          <div className={`aspect-square rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center`}>
            {hasNFTs && nfts.includes('expert') ? (
              <i className="fas fa-medal text-blue-500"></i>
            ) : (
              <i className="fas fa-lock text-blue-300"></i>
            )}
          </div>
          
          <div className={`aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center`}>
            {hasNFTs && nfts.includes('oracle') ? (
              <i className="fas fa-crown text-purple-500"></i>
            ) : (
              <i className="fas fa-lock text-purple-300"></i>
            )}
          </div>
        </div>
        
        <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium">
          View NFT Gallery
        </button>
      </div>
    </div>
  );
};

export default ReputationNFTs;
