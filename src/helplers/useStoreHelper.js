import { useRouteStore } from "@/stores/routeStore";
import { useStationStore } from "@/stores/stationStore";
import { useWalletTransactionStore } from "@/stores/walletTransactionStore";
import { useTopUpHistorystore } from "@/stores/topUpHistoryStore";

const stores = {
  routeStore: useRouteStore(),
  stationStore: useStationStore(),
  walletTransactionStore: useWalletTransactionStore(),
  topUpHistoryStore: useTopUpHistorystore(),

};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
