'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import polkadotConfig from './json/polkadot-config.json';
import { toast } from 'react-toastify';

import { useConnectWallet, useNotifications, useSetChain } from "@subwallet-connect/react";
import Cookies from 'js-cookie';

const AppContext = createContext({
  api: null,
  deriveAcc: null,
  showToast: (status, id, FinalizedText, doAfter, callToastSuccess = true, events, toast) => { },
  userInfo: {},
  userWalletPolkadot: '',
  userSigner: null,
  PolkadotLoggedIn: false,
  EasyToast: (message, type, UpdateType = false, ToastId = '', isLoading = false) => { },
  GetAllDaos: async () => [],
  GetAllJoined: async () => [],
  GetAllGoals: async (cache = false) => [],

  GetAllEvents: async (cache = false) => [],
  GetAllNfts: async (cache = false) => [],
  GetAllBids: async (cache = false) => [],
  GetAllFeeds: async () => [],
  GetAllIdeas: async (cache = false) => [],
  GetAllVotes: async () => [],
  GetAllDonations: async () => [],
  GetAllUserDonations: async () => [],
  getUserInfoById: async (userid) => ({}),
  updateCurrentUser: () => { }
});

export function PolkadotProvider({ children }) {
  const [api, setApi] = useState();
  const [deriveAcc, setDeriveAcc] = useState(null);
  const [PolkadotLoggedIn, setPolkadotLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userWalletPolkadot, setUserWalletPolkadot] = useState('');
  const [userSigner, setUserSigner] = useState('');
  const [{ wallet },] = useConnectWallet();


  async function showToast(status, IdOrShowAlert, FinalizedText, doAfter, callToastSuccess = true, events, ShowToast = false) {
    if (status.isInBlock) {
      if (ShowToast == false) {
        toast.update(IdOrShowAlert, { render: 'Transaction In block...', isLoading: true });
      } else {
        IdOrShowAlert('pending', 'Transaction In block...');
      }

    } else if (status.isFinalized) {
      if (callToastSuccess)
        if (ShowToast == false) {
          toast.update(IdOrShowAlert, {
            render: FinalizedText,
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
            draggable: true
          });
        } else {
          IdOrShowAlert('success', FinalizedText);
        }

      if (events != null) {
        doAfter(events);
      } else {
        doAfter();
      }
    }
  }

  async function getUserInfoById(userid) {
    if (api) {
      return await api.query.users.userById(userid);
    } else {
      return {};
    }
  }
  async function EasyToast(message, type, UpdateType = false, ToastId = '', isLoading = false) {
    if (UpdateType) {
      toast.update(ToastId, {
        render: message,
        type: type,
        isLoading: isLoading,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });
    }
  }

  async function updateCurrentUser() {

    if (wallet?.accounts) {

      setUserWalletPolkadot(wallet.accounts[0].address);
      window.signerAddress = wallet.accounts[0].address;
      setPolkadotLoggedIn(true);

      setUserSigner(wallet.signer);
    }

  }

  useEffect(() => {
    updateCurrentUser();
  }, [wallet])
  useEffect(() => {
    (async function () {
      try {
        const wsProvider = new WsProvider(polkadotConfig.chain_rpc);
        const _api = await ApiPromise.create({ provider: wsProvider });
        await _api.isReady;

        setApi(_api);

        const keyring = new Keyring({ type: 'sr25519' });
        const newPair = keyring.addFromUri(polkadotConfig.derive_acc);
        setDeriveAcc(newPair);

        if (Cookies.get('loggedin') == 'true') {
          let userid = Cookies.get('user_id');
          window.userid = userid;
          const userInformation = await _api.query.users.userById(userid);
          setUserInfo(userInformation);


        }
        console.log('Done');
      } catch (e) { }
    })();
  }, []);

  //One Time Counter

  let allVotes = [];
  let allDonations = [];
  let allEventDonations = [];
  let allIdeas = [];
  let allGoals = [];
  let allEvents = [];
  let allDaos = [];
  let allBids = [];

  async function InsertData(totalDAOCount, allDAOs) {
    const arr = [];
    for (let i = 0; i < totalDAOCount; i++) {
      let object = '';
      let originalwallet = '';

      if (allDAOs[i]?.daoUri) {
        object = JSON.parse(allDAOs[i].daoUri?.toString());
        originalwallet = allDAOs[i].daoWallet?.toString();
      }
      if (object) {
        let user_info = await getUserInfoById(object.properties?.user_id?.description);
        arr.push({
          //Pushing all data into array
          id: i,
          daoId: Number(i),
          Title: object.properties.Title.description,
          Start_Date: object.properties.Start_Date.description,
          user_info: user_info,
          user_id: object.properties?.user_id?.description,
          logo: object.properties.logo.description?.url,
          wallet: originalwallet,
          recievewallet: object.properties.wallet.description,
          recievetype: 'Polkadot',
          SubsPrice: object.properties?.SubsPrice?.description,
          Created_Date: object.properties?.Created_Date?.description,
          brandingColor: object.properties?.brandingColor?.description,
          customUrl: object.properties?.customUrl?.description
        });
      }
    }
    return arr;
  }

  async function fetchPolkadotDAOData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalDAOCount = Number(await api._query.daos.daoIds());
        let totalDao = async () => {
          let arr = [];
          for (let i = 0; i < totalDAOCount; i++) {
            const element = await api._query.daos.daoById(i);
            let daoURI = element['__internal__raw'];

            arr.push(daoURI);
          }
          return arr;
        };

        let arr = InsertData(totalDAOCount, await totalDao());
        return arr;
      }
    } catch (error) { }
    return [];
  }

  async function GetAllDaos() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotDAOData());
    return arr;
  }

  async function fetchPolkadotJoinedData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalJoinedCount = Number(await api._query.daos.joinedIds());
        let arr = [];
        for (let i = 0; i < totalJoinedCount; i++) {
          const element = await api._query.daos.joinedById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            daoId: element['__internal__raw'].daoid.toString(),
            user_id: element['__internal__raw'].userId.toString(),
            joined_date: element['__internal__raw'].joinedDate.toString()
          };
          arr.push(newElm);
        }
        //All DAOs Users
        let allDaos = await GetAllDaos();
        for (let i = 0; i < allDaos.length; i++) {
          const element = allDaos[i];
          let newElm = {
            id: element.daoId,
            daoId: element.daoId,
            user_id: element.user_id,
            joined_date: element.Created_Date
          };
          arr.push(newElm);
        }


        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllJoined() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotJoinedData());
    return arr;
  }


  async function InsertGoalData(totalGoalCount, allGoals) {
    const arr = [];
    for (let i = 0; i < totalGoalCount; i++) {
      let object = '';
      let daoId = -1;
      if (allGoals[i]?.goalUri) {
        object = JSON.parse(allGoals[i].goalUri?.toString());
        daoId = Number(allGoals[i].daoId);
      }
      let goalId = Number(i);

      let reached = 0;
      let currentGoalIdeas = allIdeas.filter((e) => e.goalId == goalId)
      for (let i = 0; i < currentGoalIdeas.length; i++) {
        const element = (currentGoalIdeas[i]);
        reached += element.donation;
      }


      if (object) {
        arr.push({
          //Pushing all data into array
          id: i,
          goalId: goalId,
          daoId: daoId,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          Budget: object.properties.Budget.description,
          End_Date: object.properties.End_Date.description,
          wallet: object.properties.wallet.description,
          UserId: object.properties?.user_id?.description,
          logo: object.properties.logo.description?.url,
          type: 'Polkadot',
          ideasCount: currentGoalIdeas.length,
          reached: reached,
        });
      }
    }
    return arr;
  }
  async function fetchPolkadotGoalData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalGoalCount = Number(await api._query.goals.goalIds());

        let totalGoal = async () => {
          let arr = [];
          for (let i = 0; i < totalGoalCount; i++) {
            const element = await api._query.goals.goalById(i);
            let goalURI = element['__internal__raw'];

            arr.push(goalURI);
          }
          return arr;
        };

        let arr = InsertGoalData(totalGoalCount, await totalGoal());
        return arr;
      }
    } catch (error) { }
    return [];
  }

  async function GetAllGoals(cache = false) {
    if (cache && allGoals.length > 0) return allGoals;
    allIdeas = await GetAllIdeas();
    let arr = [];
    allGoals = arr.concat(await fetchPolkadotGoalData());
    return allGoals;
  }
  async function fetchPolkadotFeedsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalFeedsCount = Number(await api._query.feeds.feedsIds());
        let arr = [];
        for (let i = 0; i < totalFeedsCount; i++) {
          const element = await api._query.feeds.feedById(i);
          let newElm = {
            id: element['__internal__raw'].feedId.toString(),
            date: new Date(Number(element['__internal__raw'].date)),
            type: element['__internal__raw'].feedType.toString(),
            data: JSON.parse(element['__internal__raw'].data.toString())
          };
          arr.push(newElm);
        }

        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllFeeds() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotFeedsData());
    return arr;
  }



  async function InsertIdeaData(totalIdeaCount, allIdeas) {
    const arr = [];
    for (let i = 0; i < totalIdeaCount; i++) {
      let object = '';
      let goalId = -1;
      if (allIdeas[i]?.ideasUri) {
        object = JSON.parse(allIdeas[i].ideasUri?.toString());
        goalId = Number(allIdeas[i].goalId);
      }

      let ideasId = Number(i);

      let isvoted = false;
      let currentIdeasVotes = allVotes.filter((e) => e.ideasId == ideasId)
      for (let i = 0; i < currentIdeasVotes.length; i++) {
        const element = (currentIdeasVotes[i]);
        if (Number(element.user_id) == Number(window.userid)) isvoted = true;
      }

      let votesAmount = currentIdeasVotes.length;

      let totalDonation = 0;
      let currentIdeasDonations = allDonations.filter((e) => e.ideasId == ideasId)
      for (let i = 0; i < currentIdeasDonations.length; i++) {
        const element = (currentIdeasDonations[i]);
        totalDonation += element.donation;
      }

      if (object) {
        arr.push({
          //Pushing all data into array
          id: i,
          ideasId: ideasId,
          goalId: goalId,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          wallet: object.properties.wallet.description,
          recievetype: 'Polkadot',
          logo: object.properties.logo.description?.url,
          user_id: Number(object.properties.user_id.description),
          allfiles: object.properties.allFiles,
          donation: totalDonation,
          votes: votesAmount,
          isVoted: isvoted,
          isOwner: object.properties.user_id.description == Number(window.userid) ? true : false,

          type: 'Polkadot',
        });
      }
    }
    return arr;
  }
  async function fetchPolkadotIdeaData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalIdeaCount = Number(await api._query.ideas.ideasIds());

        let totalIdea = async () => {
          let arr = [];
          for (let i = 0; i < totalIdeaCount; i++) {
            const element = await api._query.ideas.ideasById(i);
            let ideaURI = element['__internal__raw'];

            arr.push(ideaURI);
          }
          return arr;
        };

        let arr = InsertIdeaData(totalIdeaCount, await totalIdea());
        return arr;
      }
    } catch (error) { }
    return [];
  }

  async function GetAllIdeas(cache = false) {
    if (cache && allIdeas.length > 0) return allIdeas;
    allVotes = await GetAllVotes();
    allDonations = await GetAllDonations();

    allIdeas = (await fetchPolkadotIdeaData());
    return allIdeas;
  }



  async function fetchPolkadotVotesData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalVotesCount = Number(await api._query.ideas.votesIds());
        let arr = [];
        for (let i = 0; i < totalVotesCount; i++) {
          const element = await api._query.ideas.voteById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            goalId: element['__internal__raw'].goalId.toString(),
            ideasId: element['__internal__raw'].ideasId.toString(),
            user_id: element['__internal__raw'].userId.toString()
          };
          arr.push(newElm);
        }
        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllVotes() {

    let arr = [];
    arr = arr.concat(await fetchPolkadotVotesData());
    return arr;
  }


  async function fetchPolkadotDonationsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalDonationsCount = Number(await api._query.ideas.donationsIds());
        let arr = [];
        for (let i = 0; i < totalDonationsCount; i++) {
          const element = await api._query.ideas.donationsById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            ideasId: element['__internal__raw'].ideasId.toString(),
            userid: element['__internal__raw'].userid.toString(),
            donation: Number(element['__internal__raw'].donation.toString()) / 1e12,
          };
          arr.push(newElm);
        }
        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllDonations() {

    let arr = [];
    arr = arr.concat(await fetchPolkadotDonationsData());
    return arr;
  }

  async function GetAllUserDonations() {
    let allDonations = await GetAllDonations();
    let users = {};
    allDonations.forEach((elm) => {
      if (users[elm.userid] == undefined) users[elm.userid] = 0;
      users[elm.userid] = Number(users[elm.userid]) + elm.donation;
    })
    return users;
  }





  async function fetchPolkadotEventDonationsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalDonationsCount = Number(await api._query.events.donationsIds());
        let arr = [];
        for (let i = 0; i < totalDonationsCount; i++) {
          const element = await api._query.events.donationsById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            eventId: element['__internal__raw'].eventId.toString(),
            userid: element['__internal__raw'].userid.toString(),
            donation: Number(element['__internal__raw'].donation.toString()) / 1e12,
          };
          arr.push(newElm);
        }
        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllEventDonations() {

    let arr = [];
    arr = arr.concat(await fetchPolkadotEventDonationsData());
    return arr;
  }
  async function fetchPolkadotEventData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalEventCount = Number(await api._query.events.eventIds());
        let arr = [];
        for (let i = 0; i < totalEventCount; i++) {
          const element = await api._query.events.eventById(i);
          const object = JSON.parse(element['__internal__raw'].eventUri.toString())

          let totalDonation = 0;
          let currentEventDonations = allEventDonations.filter((e) => e.eventId == Number(element['__internal__raw'].id))
          for (let i = 0; i < currentEventDonations.length; i++) {
            const element = (currentEventDonations[i]);
            totalDonation += element.donation;
          }

          let newElm = {
            id: Number(element['__internal__raw'].id),
            eventId: Number(element['__internal__raw'].id),
            daoId: Number(element['__internal__raw'].daoId),
            Title: object.properties.Title.description,
            Description: object.properties.Description.description,
            Budget: object.properties.Budget.description,
            End_Date: object.properties.End_Date.description,
            wallet: object.properties.wallet.description,
            logo: object.properties.logo.description.url,
            eventType: object.properties.eventType.description,
            reached: totalDonation,
            amountOfNFTs: object.properties.amountOfNFTs?.description,
            status: "test",
            UserId: Number(element['__internal__raw'].userId)
          };
          arr.push(newElm);
        }



        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllEvents(cache = false) {
    if (cache && allEvents.length > 0) return allEvents;
    allEventDonations = await GetAllEventDonations();
    let arr = [];
    arr = arr.concat(await fetchPolkadotEventData());
    return arr;
  }



  async function fetchPolkadotNftsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalNftCount = Number(await api._query.events.tokenIds());
        let arr = [];
        for (let i = 0; i < totalNftCount; i++) {
          const element = await api._query.events.tokenById(i);
          const object = JSON.parse(element['__internal__raw'].tokenUri.toString())

          const nftid = Number(element['__internal__raw'].id);
          let bidHistory = [];
          for (let i = 0; i < allBids.length; i++) {
            const bidElement = allBids[i];
            if (bidElement.nftId ==  nftid) bidHistory.push(bidElement);
          }
          console.log(bidHistory)

          let newElm = {
            id: nftid,
            eventid: Number(element['__internal__raw'].eventId),
            daoid: Number(element['__internal__raw'].daoId),
            name: object.properties.Name.description,
            url: object.properties.Link.description,
            description: object.properties.Description.description,
            highest_amount: Number(element['__internal__raw'].highestAmount) / 1e12,
            highest_bidder: (element['__internal__raw'].highestBidder).toString(),
            highest_bidder_userid: Number(element['__internal__raw'].highestBidderUserid),
            highest_bidder_wallet: (element['__internal__raw'].highestBidderWallet).toString(),
            highestBid: {
              date: element['__internal__raw'].highestBidDate.toString(),
              walletAddress: (element['__internal__raw'].highestBidderWallet).toString(),
              bidder: (element['__internal__raw'].highestBidder).toString(),
              bidderUserId: Number(element['__internal__raw'].highestBidderUserid),
              bidAmount: Number(element['__internal__raw'].highestAmount) / 1e12
            },
            bidHistory: bidHistory
          };
          arr.push(newElm);
        }


        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllNfts(cache = false) {
    allBids= await GetAllBids();
    let arr = [];
    arr = arr.concat(await fetchPolkadotNftsData());
    return arr;
  }

  async function fetchPolkadotBidsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalBidCount = Number(await api._query.events.bidIds());
        let arr = [];
        for (let i = 0; i < totalBidCount; i++) {
          const element = await api._query.events.bidById(i);



          let newElm = {
            id: Number(element['__internal__raw'].id),
            nftId: Number(element['__internal__raw'].nftId),
            eventId: Number(element['__internal__raw'].eventId),
            daoId: Number(element['__internal__raw'].daoId),
            date: element['__internal__raw'].date.toString(),
            walletAddress: (element['__internal__raw'].walletAddress).toString(),
            bidder: (element['__internal__raw'].bidder).toString(),
            bidderUserId: Number(element['__internal__raw'].bidderUserid),
            bidAmount: Number(element['__internal__raw'].bidAmount) / 1e12,
          };
          arr.push(newElm);
        }


        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }

  async function GetAllBids(cache = false) {
    let arr = [];
    arr = arr.concat(await fetchPolkadotBidsData());
    return arr;
  }





  return <AppContext.Provider value={{ api: api, deriveAcc: deriveAcc, GetAllEvents: GetAllEvents, GetAllNfts: GetAllNfts,GetAllBids:GetAllBids, GetAllGoals: GetAllGoals, GetAllIdeas: GetAllIdeas, GetAllVotes: GetAllVotes, GetAllFeeds: GetAllFeeds, GetAllDonations: GetAllDonations, GetAllUserDonations: GetAllUserDonations, updateCurrentUser: updateCurrentUser, GetAllDaos: GetAllDaos, GetAllJoined: GetAllJoined, showToast: showToast, EasyToast: EasyToast, getUserInfoById: getUserInfoById, userWalletPolkadot: userWalletPolkadot, userSigner: userSigner, PolkadotLoggedIn: PolkadotLoggedIn, userInfo: userInfo }}>{children}</AppContext.Provider>;
}

export const usePolkadotContext = () => useContext(AppContext);
