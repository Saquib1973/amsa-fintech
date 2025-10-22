# Sell Flow Setup Instructions

## Overview
This setup implements a complete sell flow for your fintech application using Transak. When users want to sell crypto, they'll be redirected to a completion page where your custodial wallet will transfer the crypto to Transak's wallet.

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Transak Configuration
NEXT_PUBLIC_TRANSAK_API=your_transak_api_key
NEXT_PUBLIC_TRANSAK_ENV=STAGING
NEXT_PUBLIC_TRANSAK_TEST_EMAIL=test@example.com
NEXT_PUBLIC_TRANSAK_PARTNER_CUSTOMER_ID=your_partner_customer_id

# Custodial Wallet Configuration
# IMPORTANT: Keep this private key secure! This is your custodial wallet that will send crypto to Transak
CUSTODIAL_WALLET_PRIVATE_KEY=your_private_key_here

# Default wallet address (optional)
NEXT_PUBLIC_DEFAULT_WALLET_ADDRESS=0xcd8857bA99B602212F679E3802Da48D98B195052
```

## How It Works

1. **User initiates sell**: User clicks sell on a holding (e.g., USDT)
2. **Transak widget opens**: Shows sell flow with amount and payment method
3. **User confirms payment**: User completes payment details
4. **Redirect to completion page**: User is redirected to `/sell/complete` with order details
5. **Crypto transfer**: Your backend transfers crypto from custodial wallet to Transak's wallet
6. **Transaction completion**: User is redirected back to holdings

## Key Features

- **No Infura required**: Uses free RPC endpoints for Polygon and Ethereum
- **Supports multiple tokens**: USDT, USDC, TRNSK on Polygon
- **Custodial wallet integration**: Your wallet sends crypto to Transak
- **Error handling**: Comprehensive error handling and user feedback
- **Transaction tracking**: All transactions are saved to your database

## Supported Networks and Tokens

### Polygon Network
- USDT: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
- USDC: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
- TRNSK: `0x0c86A754A29714C4Fe9C6F1359fa7099eD174c0b`

### Ethereum Network
- USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

## Setup Steps

1. **Configure environment variables** (see above)
2. **Fund your custodial wallet** with the tokens you want to support
3. **Test the flow** in staging environment
4. **Configure Transak webhooks** (optional but recommended)

## Testing

1. Start your development server: `npm run dev`
2. Navigate to a holding and click "Sell"
3. Complete the Transak flow
4. Check that you're redirected to `/sell/complete`
5. Verify the crypto transfer happens
6. Check that you're redirected back to holdings

## Troubleshooting

- **"Insufficient balance"**: Make sure your custodial wallet has enough tokens
- **"Missing parameters"**: Check that Transak is properly configured with redirectURL
- **"Network error"**: Verify your RPC endpoints are working
- **"Transaction failed"**: Check your private key and wallet configuration

## Security Notes

- Keep your custodial wallet private key secure
- Use environment variables for all sensitive data
- Consider using a hardware wallet for production
- Monitor your custodial wallet balance
- Set up proper logging and monitoring
