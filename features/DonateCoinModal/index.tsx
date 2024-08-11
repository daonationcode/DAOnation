import React, { useEffect, useState } from 'react';

import { usePolkadotContext } from '../../contexts/PolkadotContext';

import { Button, Dropdown, IconButton, MenuItem, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import UseFormInput from '../../components/components/UseFormInput';

declare let window;

export default function DonateCoinModal({ ideasid, daoId, goalURI, show, onHide, address, recieveWallet, recievetype }) {
  const [Balance, setBalance] = useState('');
  const { userInfo, PolkadotLoggedIn, userWalletPolkadot, userSigner, showToast, api } = usePolkadotContext();
  const [CurrentChain, setCurrentChain] = useState('');
  const [CurrentChainNetwork, setCurrentChainNetwork] = useState(0);
  const [CurrentAddress, setCurrentAddress] = useState('');
  const [Coin, setCoin] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isSent, setisSent] = useState(false);

  const [transaction, setTransaction] = useState({
    link: '',
    token: ''
  });

  const [Amount, AmountInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: '0.00',
    id: 'amount',
    className: 'max-w-[140px]'
  });

  function ShowAlert(type = 'default', message) {}

  async function DonateCoinSubmission(e) {
    e.preventDefault();
    console.clear();
    setisSent(false);
    setisLoading(true);
    ShowAlert('pending', 'Donating ...');

    let feed1 = JSON.stringify({
      name: userInfo?.fullName?.toString(),
      badge: 'First Donation'
    });

    let feed2 = JSON.stringify({
      donated: Amount,
      goalTitle: goalURI.Title,
      ideasid: ideasid,
      daoId: daoId
    });

    async function onSuccess() {
      window.location.reload();
      LoadData();
      setisLoading(false);
      setisSent(true);

      onHide({ success: true });
    }
    if (Coin == 'DOT') {
      let recipient = recievetype == 'Polkadot' ? recieveWallet : address;
      const txs = [api.tx.balances.transferAllowDeath(recipient, `${Amount * 1e12}`), api._extrinsics.ideas.addDonation(ideasid, `${Amount * 1e12}`, Number(window.userid)), api._extrinsics.feeds.addFeed(feed2, 'donation', new Date().valueOf())];

      const transfer = api.tx.utility.batch(txs).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
        showToast(
          status,
          ShowAlert,
          'Donation successful!',
          () => {
            onSuccess();
          },
          true,
          null,
          true
        );
      });
    }
  }

  async function LoadData(currencyChanged = false) {
    async function setPolkadot() {
      if (Coin !== 'DOT') setCoin('DOT');
      const { nonce, data: balance } = await api.query.system.account(userWalletPolkadot);
      setBalance((Number(balance.free.toString()) / 1e12).toString());
    }

    if (PolkadotLoggedIn && currencyChanged == false && Coin == '') {
      setPolkadot();
    } else if (currencyChanged == true && Coin == 'DOT') {
      setPolkadot();
    }
  }

  function isInvalid() {
    return !Amount;
  }
  useEffect(() => {
    if (Coin !== '') LoadData(true);
  }, [Coin]);

  useEffect(() => {
    LoadData();
  }, [show]);

  return (
    <Modal open={show} onClose={onHide}>
      <Modal.Backdrop />
      <Modal.Panel className="min-w-[480px] bg-gohan">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Donate to idea</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onHide} />
          </div>
          <div className="flex flex-col gap-6 w-full max-h-[calc(90vh-162px)]">
            <form id="doanteForm" onSubmit={DonateCoinSubmission} autoComplete="off">
              <div className="flex flex-col gap-2 py-16 px-6">
                <div className="flex items-center ">
                  <span className="font-semibold flex-1">Total</span>
                  <div className="max-w-[140px] mr-4"> {AmountInput}</div>
                  <Dropdown value={Coin} onChange={setCoin} className="max-w-[100px] ">
                    <Dropdown.Select>{Coin}</Dropdown.Select>
                    <Dropdown.Options className="bg-gohan w-48 min-w-0">
                      <Dropdown.Option value="DOT">
                        <MenuItem>DOT</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="DEV">
                        <MenuItem>DEV</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="xcvGLMR">
                        <MenuItem>xcvGLMR</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="tBNB">
                        <MenuItem>BNB</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="CELO">
                        <MenuItem>CELO</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="GoerliETH">
                        <MenuItem>ETH</MenuItem>
                      </Dropdown.Option>
                    </Dropdown.Options>
                  </Dropdown>
                </div>

                <p className="text-trunks w-full text-right">Your balance is {Balance} </p>
              </div>

              <div className="flex justify-between border-t border-beerus w-full p-6">
                <Button variant="ghost" onClick={onHide}>
                  Cancel
                </Button>
                <Button animation={isLoading ? 'progress' : false} disabled={isLoading || isInvalid()} type="submit" id="CreateGoalBTN">
                  Donate
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
