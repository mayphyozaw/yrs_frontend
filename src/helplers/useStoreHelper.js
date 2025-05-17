import { useStationStore } from "@/stores/userPortal/stationStore";

const stores = {
  stationStore: useStationStore(),
};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
