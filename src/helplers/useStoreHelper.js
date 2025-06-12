import { useRouteStore } from "@/stores/routeStore";
import { useStationStore } from "@/stores/stationStore";
import { useWalletTransactionStore } from "@/stores/walletTransactionStore";
import { useTopUpHistorystore } from "@/stores/topUpHistoryStore";
import { useTicketstore } from "@/stores/ticketStore";

const stores = {
  routeStore: useRouteStore(),
  stationStore: useStationStore(),
  walletTransactionStore: useWalletTransactionStore(),
  topUpHistoryStore: useTopUpHistorystore(),
  ticketStore: useTicketstore(),

};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
