import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import LoginCard from '../../components/components/LoginCard';
import { useRouter } from 'next/router';

import Onboard, { WalletState } from "@subwallet-connect/core";
import injectedModule from "@subwallet-connect/injected-wallets";
import subwalletPolkadotModule from '@subwallet-connect/subwallet-polkadot';
import { ProviderLabel, WalletFilters } from '@subwallet-connect/injected-wallets/dist/types';
import {ApiPromise, WsProvider} from "@polkadot/api";
import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';
import { Chain } from '@subwallet-connect/common';



// Initialize the provider
const filter:WalletFilters = {
  "Polkadot{.js}":true,
  "Detected Wallet":false,
  "MetaMask":false,

}
const injected = injectedModule({filter:filter});
const subWalletP = subwalletPolkadotModule();
const polkadotInfo:Chain = {
  "namespace": "substrate",
  "id": "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
  "label": "Polkadot",
  "token": "DOT",
  "decimal": 10,
  "rpcUrl": "wss://daonation.snapminds.dev"
};

const onboard = Onboard({
  wallets: [ injected, subWalletP],
  chains: [  
  ],
  
  chainsPolkadot: [
    polkadotInfo
  ],
});

export default function Login() {
  const [isConnected, setIsConnected] = useState(false);
  const [step, setStep] = useState(2);

  const [wallets, setWallets] = useState<WalletState[]>([]);

  


  const router = useRouter();
  useEffect(() => {
    setConnectionStatus();
  }, []);

  // useEffect(() => {
  //   if ((hasMetamask || hasPolkadot) && isConnected) {
  //     window.location.href = '/joined';
  //   }
  // }, [hasMetamask, hasPolkadot, isConnected, router]); // Dependency array

  const setConnectionStatus = () => {
    if (window.localStorage.getItem('loggedin') === 'true') {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  async function onConnectPolkadot() {
   let walletList =  await onboard.connectWallet();
   console.log(walletList);
    window.localStorage.setItem('loggedin', 'true');
    setIsConnected(true);
    // setHasPolkadot(true);
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="DAOnation - Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`gap-8 flex w-full bg-gohan pt-10 pb-6 border-beerus border`}>
        <div className="container flex flex-col gap-2 w-full justify-between">
          <h1 className="text-moon-32 font-bold">Login to your account</h1>
          <p>Step {step} of 2</p>
        </div>
      </div>
      <div className="container flex flex-col items-center pt-10 gap-10">{<LoginCard setStep={setStep} step={step} onConnectPolkadot={onConnectPolkadot} />}</div>
    </>
  );
}
