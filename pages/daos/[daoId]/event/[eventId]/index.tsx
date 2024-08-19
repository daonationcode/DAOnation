import { Button, Tabs } from '@heathmont/moon-core-tw';
import { GenericLoyalty, ShopWallet } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { usePolkadotContext } from '../../../../../contexts/PolkadotContext';
import DonateCoinToEventModal from '../../../../../features/DonateCoinToEventModal';
import DonateNFTModal from '../../../../../features/DonateNFTModal';
import Loader from '../../../../../components/components/Loader';
import Link from 'next/link';
import { NFT } from '../../../../../data-model/nft';
import NFTCard from '../../../../../components/components/NFTCard';
import BidHistoryModal from '../../../../../features/BidHistoryModal';
import PlaceHigherBidModal from '../../../../../features/PlaceHigherBidModal';
import { Dao } from '../../../../../data-model/dao';
import { toast } from 'react-toastify';
import BuyTicketModal from '../../../../../features/BuyTicketModal';

declare let window;
export default function Events() {
  //Variables
  const [nfts, setNfts] = useState([]);
  const { api, getUserInfoById,GetAllDaos, GetAllEvents } = usePolkadotContext();
  const [eventIdTxt, setEventTxtID] = useState('');
  const [showDonateNftModal, setShowDonateNFTModal] = useState(false);
  const [showBuyTicketModal, setShowBuyTicketModal] = useState(false);
  const [showDonateCoinModal, setShowDonateCoinModal] = useState(false);
  const [showPlaceHigherBidModal, setShowPlaceHigherBidModal] = useState<NFT | null>(null);
  const [EventID, setEventID] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [isDistributing, setDistributing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [EventDAOURI, setEventDAOURI] = useState({} as Dao);
  const [showBidHistoryModal, setShowBidHistoryModal] = useState<NFT | null>(null);

  const router = useRouter();
  const [EventURI, setEventURI] = useState({
    EventId: '',
    daoId: '',
    Title: '',
    Description: '',
    Budget: '',
    End_Date: '',
    user_info: {
      fullName: '',
      id: null
    },
    reached: false,
    wallet: '',
    logo: '',
    isOwner: true,
    eventType: '',
    ticketPrice: 0,
    participantsCount: 0,
    status: ''
  });

  const mockInfo = {
    EventId: '0',
    daoId: '0',
    Title: 'Concert with Kendrick Martins',
    Description: 'A description about the Event and what it is all about is written here. It may be longer or shorter depending on what the creator added.',
    Budget: '10',
    End_Date: '2024-10-',
    user_info: {
      fullName: 'Thomas Goethals',
      id: '0'
    },
    reached: false,
    wallet: '',
    logo: '',
    isOwner: true,
    eventType: 'livestream',
    ticketPrice: 10,
    startDate: '20 Nov 2024 01:15PM',
    participantsCount: 30,
    status: ''
  };

  const mockNFTs: NFT[] = [
    {
      id: '',
      url: 'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
      name: 'NFT LSP9',
      highestBid: { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' },
      bidHistory: [
        { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Bert Bono', walletAddress: 'wallet-address-1' },
        { date: '19 Nov 2022 01:15PM', bidAmount: 19, bidder: 'Barry Bono', walletAddress: 'wallet-address-2' },
        { date: '18 Nov 2022 01:15PM', bidAmount: 18, bidder: 'Bevin Bono', walletAddress: 'wallet-address-3' }
      ],
      description: 'A description about the token and why its worth bidding for.'
    },
    {
      id: '',
      url: 'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
      name: 'NFT LSP9',
      highestBid: { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' },
      bidHistory: [{ date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' }],
      description: 'A description about the token and why its worth bidding for.'
    },
    {
      id: '',
      url: 'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
      name: 'NFT LSP9',
      highestBid: { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' },
      bidHistory: [{ date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' }],
      description: 'A description about the token and why its worth bidding for.'
    }
  ];

  useEffect(() => {
    getEventID();
    fetchData();
  }, [api, router]);

  const isAuction = () => {
    return EventURI.eventType === 'auction';
  };

  const isLivestream = () => {
    return EventURI.eventType === 'livestream';
  };

  async function fetchData() {
    if (router.query.eventId) {
      fetchContractDataFull();
    }
  }

  function getEventID() {
    const eventIdParam = router.query.eventId as string;
    if (!eventIdParam) {
      return;
    }
    setEventID(Number(eventIdParam));
    setEventTxtID(eventIdParam);
  }

  async function fetchContractDataFull() {
    setLoading(true);
    try {
      if (api && EventID !== undefined && EventID !== null) {
        //Load everything-----------

        let allEvents = await GetAllEvents();
        let eventURIFull = allEvents.filter((e) => e?.eventId == eventIdTxt.toString())[0];

        // let allNfts = await GetAllNfts();
        // let eventNFTs = allNfts.filter((e) => e.eventid == eventIdTxt.toString());
        // console.log(eventNFTs);
        // setNfts(eventNFTs);

        let allDaos = await GetAllDaos();
        let eventDAO = allDaos.filter((e) => e.daoId == eventURIFull.daoId)[0];
        setEventDAOURI(eventDAO);

        let user_info = await getUserInfoById(Number(eventURIFull.UserId));
        eventURIFull.user_info = user_info;
        eventURIFull.isOwner = eventURIFull.UserId == Number(window.userid);

        setEventURI(eventURIFull);
        setLoading(false);
      }
    } catch (error) {}
    setLoading(false);
  }

  function closeDonateCoinModal(event) {
    if (event) {
      setShowDonateCoinModal(false);
    }
  }

  function openDonateCoinModal() {
    setShowDonateCoinModal(true);
  }

  function closeDonateNFTModal(event) {
    if (event) {
      setShowDonateNFTModal(false);
    }
  }

  function openDonateNFTModal() {
    setShowDonateNFTModal(true);
  }

  function openBuyTicketModal() {
    setShowBuyTicketModal(true);
  }

  async function distributeNFTs() {
    setDistributing(true);

    console.log('======================>Distributing NFT');
    const ToastId = toast.loading('Distributing NFT ...');

    try {
      // Creating Event in Smart contract

      toast.update(ToastId, {
        render: 'Distributed NFTs!',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });
    } catch (e) {
      console.error(e);
    }
    setDistributing(false);
    window.location.reload();
  }

  return (
    <>
      <Head>
        <title>Event</title>
        <meta name="description" content="Event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex items-center flex-col gap-8`}>
        <div className={`gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border ${isLivestream() && 'pb-10'}`}>
          <div className="container flex w-full justify-between relative">
            <div className="flex flex-col gap-1">
              <Loader
                loading={loading}
                width={300}
                element={
                  <h5 className="font-semibold">
                    <Link className="text-piccolo" href={`../../${router.query.daoId}`}>
                      {EventDAOURI?.Title}
                    </Link>{' '}
                    &gt; {EventURI.eventType === 'auction' ? 'Event' : 'Live event'}
                  </h5>
                }
              />
              <Loader loading={loading} width={300} element={<h1 className="text-moon-32 font-bold">{EventURI.Title}</h1>} />
              <Loader
                loading={loading}
                width={770}
                element={
                  <h3 className="flex gap-2 whitespace-nowrap">
                    {isAuction() && <div className="font-bold">{EventURI.status == 'ended' ? 'Ended' : 'In progress'}</div>}
                    {isLivestream() && <div>{EventURI.participantsCount} participants</div>}
                    <div>•</div>
                    <div className="flex">
                      Created by &nbsp;
                      <a href={'/profile/' + EventURI.user_info.id} className="truncate text-piccolo max-w-[120px]">
                        @{EventURI.user_info.fullName}
                      </a>
                    </div>
                  </h3>
                }
              />
            </div>
            <div className="flex flex-col gap-2 absolute top-0 right-0">
              {EventURI.status == 'ended' ? (
                <></>
              ) : (
                <>
                  {isAuction() && (
                    <Button iconLeft={<GenericLoyalty />} onClick={openDonateNFTModal}>
                      Donate NFT
                    </Button>
                  )}
                  {isLivestream() && (
                    <Button iconLeft={<ShopWallet />} onClick={openBuyTicketModal}>
                      Buy ticket
                    </Button>
                  )}
                  <Button iconLeft={<ShopWallet />} variant="secondary" onClick={openDonateCoinModal}>
                    Donate Coin
                  </Button>
                </>
              )}
            </div>
          </div>
          {isAuction() && (
            <div className="container">
              <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
                <Tabs.List>
                  <Tabs.Tab>Description</Tabs.Tab>
                  <Tabs.Tab>NFT's on auction ({nfts.length})</Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </div>
          )}
        </div>
        <p className="container">{EventURI.Description}</p>
        {isAuction() && tabIndex === 0 && (
          <div className="container mt-[-2rem] w-full flex gap-6">
            <div className="w-full max-w-[476px] h-[476px] overflow-hidden relative">
              <Image unoptimized={true} objectFit="cover" layout="fill" className="rounded-xl object-cover" src={EventURI.logo} alt="" />
            </div>
            <div className="flex flex-col gap-5 bg-gohan rounded-xl w-full max-w-[300px] items-center p-6 pt-10 shadow-moon-lg">
              <GenericLoyalty className="text-hit text-moon-48" />
              <div className="font-bold text-moon-20">
                Raised DOT {EventURI.reached} of {EventURI.Budget}
              </div>
              {EventURI.status == 'ended' ? (
                <>
                  <div className="text-chichi text-center">Auction Ended</div>
                </>
              ) : (
                <>
                  {EventURI.isOwner ? (
                    <>
                      <div className="text-trunks text-center">NFT donations are put up for bidding at the event</div>
                      <Button animation={isDistributing ? 'progress' : false} disabled={isDistributing} className="font-bold" onClick={distributeNFTs}>
                        Distribute NFTs to highest bidder
                      </Button>
                      <div className="flex flex-1 flex-col justify-end text-center text-trunks text-moon-12">
                        99.9% of the proceeds go to the charity. <br /> Just 0.1% goes to DAOnation.
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {isAuction() && tabIndex === 1 && (
          <div className="container mt-[-2rem] w-full flex flex-wrap gap-6">
            {nfts.map((item, i) => (
              <NFTCard className="w-2/4" item={item} key={i} onShowBidHistory={() => setShowBidHistoryModal(item)} eventStatus={EventURI.status} onShowPlaceHigherBid={() => setShowPlaceHigherBidModal(item)} />
            ))}
          </div>
        )}
      </div>

      <DonateNFTModal open={showDonateNftModal} onClose={closeDonateNFTModal} eventid={eventIdTxt} eventName={EventURI.Title} />
      <DonateCoinToEventModal open={showDonateCoinModal} onClose={closeDonateCoinModal} eventName={EventURI.Title} eventid={EventID} recieveWallet={EventURI.wallet} />
      <PlaceHigherBidModal open={!!showPlaceHigherBidModal} onClose={() => setShowPlaceHigherBidModal(null)} item={showPlaceHigherBidModal} />
      <BidHistoryModal open={!!showBidHistoryModal} onClose={() => setShowBidHistoryModal(null)} item={showBidHistoryModal} />
      <BuyTicketModal open={!!showBuyTicketModal} onClose={() => setShowBuyTicketModal(null)} eventName={EventURI.Title} ticketPrice={EventURI.ticketPrice} />
    </>
  );
}
