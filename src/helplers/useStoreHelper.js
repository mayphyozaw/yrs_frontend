import { useStationStore } from "@/stores/userPortal/stationStore";
import { useRouteStore } from "@/stores/userPortal/routeStore";

const stores = {
  stationStore: useStationStore(),
  routeStore: useRouteStore(),

};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
