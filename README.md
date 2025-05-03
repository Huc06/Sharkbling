# SocialPrediction: A Decentralized Prediction Platform on Sui Blockchain

## Installation and Setup Guide

Follow these steps to clone and run the project using Visual Studio Code.

### System Requirements

- Node.js (Version 18.x or higher)
- npm (Version 9.x or higher) 
- Visual Studio Code
- Git

### 1. Clone the Project from GitHub

```bash
# Clone repository
git clone https://github.com/Huc06/Sharkbling

# Navigate to project directory
cd Sharkbling
```

### 2. Install Dependencies 

```bash
# Install project dependencies
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env from template
cp .env.example .env
```

Open `.env` and configure required variables:

```
# Sui environment (testnet, devnet, or mainnet)
SUI_NETWORK=testnet

# Deployed package ID on Sui
SUI_PACKAGE_ID=your_package_id

### 4. Run Development Environment

```bash
# Start development server
npm run dev
```

The application will launch at `http://localhost:5173/`.

### 5. VS Code Configuration

For the best development experience, install these VS Code extensions:

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

Create VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 6. Project Structure

The project follows this organization:

```
SharkBling/
├── client/                  # Frontend code
│   ├── src/                 # Frontend source code
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Libraries and utilities
│   │   ├── pages/          # Application pages
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
|
├── .env                    # Environment variables
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

### 7. Deploy Smart Contract on Sui

To deploy Move smart contracts on Sui network:

1. Install Sui CLI:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

2. Navigate to smart contract directory:
```bash
cd SmartContract/move
```

3. Compile and export package:
```bash
sui move build
```

4. Deploy to Sui Testnet:
```bash
sui client publish --gas-budget 200000000
```

5. Update package ID in your `.env` file.

### Development Workflow

1. Create new branch from `main` for new features
2. Follow commit convention: `feat: description` or `fix: description`
3. Create Pull Request to merge into `main` branch

---

If you encounter any issues during setup or operation, please create an issue on the GitHub repository or contact the development team.