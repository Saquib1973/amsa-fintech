#!/usr/bin/env node

/**
 * Test script for the sell flow setup
 * Run with: node scripts/test-sell-flow.js
 */

const { ethers } = require('ethers');

async function testPolygonConnection() {
  console.log('🔍 Testing Polygon network connection...');
  
  try {
    // Test Polygon RPC connection
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const network = await provider.getNetwork();
    console.log('✅ Polygon network connected:', network.name, 'Chain ID:', network.chainId);
    
    // Test USDT contract on Polygon
    const usdtAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
    const usdtContract = new ethers.Contract(
      usdtAddress,
      [
        'function name() external view returns (string)',
        'function symbol() external view returns (string)',
        'function decimals() external view returns (uint8)',
        'function totalSupply() external view returns (uint256)'
      ],
      provider
    );
    
    const name = await usdtContract.name();
    const symbol = await usdtContract.symbol();
    const decimals = await usdtContract.decimals();
    
    console.log('✅ USDT contract on Polygon:');
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Decimals: ${decimals}`);
    
    return true;
  } catch (error) {
    console.error('❌ Polygon connection failed:', error.message);
    return false;
  }
}

async function testTRNSKToken() {
  console.log('🔍 Testing TRNSK token on Polygon...');
  
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const trnskAddress = '0x0c86A754A29714C4Fe9C6F1359fa7099eD174c0b';
    
    const trnskContract = new ethers.Contract(
      trnskAddress,
      [
        'function name() external view returns (string)',
        'function symbol() external view returns (string)',
        'function decimals() external view returns (uint8)'
      ],
      provider
    );
    
    const name = await trnskContract.name();
    const symbol = await trnskContract.symbol();
    const decimals = await trnskContract.decimals();
    
    console.log('✅ TRNSK token found:');
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Decimals: ${decimals}`);
    
    return true;
  } catch (error) {
    console.error('❌ TRNSK token test failed:', error.message);
    return false;
  }
}

async function testCustodialWallet() {
  console.log('🔍 Testing custodial wallet configuration...');
  
  const privateKey = process.env.CUSTODIAL_WALLET_PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('❌ CUSTODIAL_WALLET_PRIVATE_KEY not set in environment');
    return false;
  }
  
  try {
    const wallet = new ethers.Wallet(privateKey);
    console.log('✅ Custodial wallet address:', wallet.address);
    
    // Test with Polygon provider
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const walletWithProvider = wallet.connect(provider);
    
    const balance = await walletWithProvider.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log('✅ Wallet MATIC balance:', balanceInEth, 'MATIC');
    
    return true;
  } catch (error) {
    console.error('❌ Custodial wallet test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Sell Flow Setup\n');
  
  const results = await Promise.all([
    testPolygonConnection(),
    testTRNSKToken(),
    testCustodialWallet()
  ]);
  
  const allPassed = results.every(result => result);
  
  console.log('\n📊 Test Results:');
  console.log(`   Polygon Connection: ${results[0] ? '✅' : '❌'}`);
  console.log(`   TRNSK Token: ${results[1] ? '✅' : '❌'}`);
  console.log(`   Custodial Wallet: ${results[2] ? '✅' : '❌'}`);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Your sell flow setup is ready.');
    console.log('\nNext steps:');
    console.log('1. Fund your custodial wallet with USDT/TRNSK tokens');
    console.log('2. Test the sell flow in your application');
    console.log('3. Monitor transactions on Polygonscan');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testPolygonConnection, testTRNSKToken, testCustodialWallet };
