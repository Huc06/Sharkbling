import axios from "axios";

// Base URLs for different social media platforms
const API_BASE_URLS = {
  GitHub: "https://api.github.com",
  LinkedIn: "/api/linkedin-proxy", // We'll proxy LinkedIn requests through our backend
  Farcaster: "/api/farcaster-proxy", // We'll proxy Farcaster requests through our backend
  Discord: "/api/discord-proxy", // We'll proxy Discord requests through our backend
};

// API Keys (would be provided through environment variables in production)
const API_KEYS = {
  GitHub: process.env.GITHUB_API_KEY || "",
  LinkedIn: process.env.LINKEDIN_API_KEY || "",
  Farcaster: process.env.FARCASTER_API_KEY || "",
  Discord: process.env.DISCORD_API_KEY || "",
};

// GitHub API helpers
export const getGitHubRepoStats = async (owner: string, repo: string) => {
  try {
    const response = await axios.get(`${API_BASE_URLS.GitHub}/repos/${owner}/${repo}`, {
      headers: {
        Authorization: API_KEYS.GitHub ? `token ${API_KEYS.GitHub}` : undefined,
      },
    });
    
    return {
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      watchers: response.data.subscribers_count,
      issues: response.data.open_issues_count,
    };
  } catch (error) {
    console.error("Error fetching GitHub repo stats:", error);
    throw error;
  }
};

// LinkedIn API helpers (these would be proxied through our backend)
export const getLinkedInPostStats = async (postId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URLS.LinkedIn}/${postId}`);
    
    return {
      likes: response.data.likes,
      comments: response.data.comments,
      shares: response.data.shares,
    };
  } catch (error) {
    console.error("Error fetching LinkedIn post stats:", error);
    throw error;
  }
};

// Farcaster API helpers (these would be proxied through our backend)
export const getFarcasterPostStats = async (postId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URLS.Farcaster}/${postId}`);
    
    return {
      recasts: response.data.recasts,
      likes: response.data.likes,
      replies: response.data.replies,
    };
  } catch (error) {
    console.error("Error fetching Farcaster post stats:", error);
    throw error;
  }
};

// Discord API helpers (these would be proxied through our backend)
export const getDiscordMessageStats = async (serverId: string, channelId: string, messageId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URLS.Discord}/servers/${serverId}/channels/${channelId}/messages/${messageId}`
    );
    
    return {
      reactions: response.data.reactions,
      replies: response.data.replies,
      views: response.data.views,
    };
  } catch (error) {
    console.error("Error fetching Discord message stats:", error);
    throw error;
  }
};

// Get social media metrics based on platform and URL
export const getSocialMediaMetrics = async (platform: string, url: string) => {
  try {
    switch (platform) {
      case "GitHub":
        // Extract owner/repo from URL
        const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (githubMatch) {
          const [, owner, repo] = githubMatch;
          return await getGitHubRepoStats(owner, repo);
        }
        break;
      
      case "LinkedIn":
        // Extract post ID from URL
        const linkedinMatch = url.match(/linkedin\.com\/(?:posts|feed)\/([^\/]+)/);
        if (linkedinMatch) {
          const [, postId] = linkedinMatch;
          return await getLinkedInPostStats(postId);
        }
        break;
      
      case "Farcaster":
        // Extract post ID from URL
        const farcasterMatch = url.match(/farcaster\.xyz\/(?:post|cast)\/([^\/]+)/);
        if (farcasterMatch) {
          const [, postId] = farcasterMatch;
          return await getFarcasterPostStats(postId);
        }
        break;
      
      case "Discord":
        // Extract server/channel/message IDs from URL
        const discordMatch = url.match(/discord\.com\/channels\/([^\/]+)\/([^\/]+)\/([^\/]+)/);
        if (discordMatch) {
          const [, serverId, channelId, messageId] = discordMatch;
          return await getDiscordMessageStats(serverId, channelId, messageId);
        }
        break;
    }
    
    throw new Error(`Could not parse URL or unsupported platform: ${platform}`);
  } catch (error) {
    console.error(`Error fetching ${platform} metrics:`, error);
    throw error;
  }
};
