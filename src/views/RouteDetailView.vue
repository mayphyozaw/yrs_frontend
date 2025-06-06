<template>
  <van-nav-bar
    title="Route Detail"
    :fixed="true"
    left-text=""
    left-arrow
    @click-left="onClickLeft"
  />

  <van-pull-refresh
    v-model="refreshing"
    pulling-text="Pull to refresh"
    loosing-text="Pull to refresh"
    loading-text="Loading"
    success-text="Successfully loaded"
    @refresh="onRefresh"
  >
    <div v-if="routeDetail != null">
      <div class="bg-theme pt-14 pb-20">
        <h6 class="text-center text-white">{{ routeDetail.title }}</h6>
        <p class="text-center text-white text-xs mb-1">
          {{ routeDetail.description }}
        </p>
        <div class="text-center">
          <span
            class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
            >{{ routeDetail.direction.text }}</span
          >
        </div>
      </div>

      <div class="p-3 relative" style="top: -74px">
        <van-grid :border="false" :column-num="3" class="mb-5">
          <van-grid-item class="origin-grid-item">
            
            <p class="text-xs text-center text-theme mb-1">Origin</p>
            <p class="text-xs text-center text-gray-500 mb-1">
              {{ routeDetail.origin_station_title }}
            </p>
            <p class="text-xs text-center text-gray-700 mb-1">
              {{ routeDetail.origin_station_time }}
            </p>
          </van-grid-item>

          <van-grid-item>
            <van-icon name="arrow" size="16" />
          </van-grid-item>

          <van-grid-item class="destination-grid-item">
            <p class="text-xs text-center text-theme mb-1">Destination</p>
            <p class="text-xs text-center text-gray-500 mb-1">
              {{ routeDetail.destination_station_title }}
            </p>
            <p class="text-xs text-center text-gray-700 mb-1">
              {{ routeDetail.destination_station_time }}
            </p>
          </van-grid-item>
        </van-grid>

        <van-grid :border="false" :column-num="2" class="mb-5">
          <van-grid-item class="total-stations-grid-item">
            <van-icon name="shop-o" size="16" class="mb-1"/>
            <p class="text-xs text-center text-theme mb-1">Total Stations</p>
            <p class="text-xs text-center text-gray-500 mb-1">
              {{ routeDetail.total_stations }}
            </p>
          </van-grid-item>

          <van-grid-item class="traveling-times-grid-item">
            <van-icon name="underway-o" size="16" class="mb-1"/>

            <p class="text-xs text-center text-theme mb-1">Traveling Time</p>
            <p class="text-xs text-center text-gray-500 mb-1">
              {{ routeDetail.traveling_minutes }}
            </p>
          </van-grid-item>
        </van-grid>

        <van-tabs @change="onTabChange">
          <van-tab>
            <template #title>Schedule</template>
            <div class="py-2">
              <van-steps direction="vertical" class="rounded-lg mb-5">
                <van-step
                  v-for="station_schedules in routeDetail.station_schedules"
                  :key="station_schedules.slug"
                >
                  <template #active-icon>
                    <img
                      src="@/assets/image/station.png"
                      alt=""
                      class="w-6 h-6"
                    />
                  </template>
                  <template #inactive-icon>
                    <img
                      src="@/assets/image/station.png"
                      alt=""
                      class="w-6 h-6"
                    />
                  </template>
                  <template #finish-icon>
                    <img
                      src="@/assets/image/station.png"
                      alt=""
                      class="w-6 h-6"
                    />
                  </template>
                  <p class="text-sm text-gray-700">
                    {{ station_schedules.title }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ station_schedules.time }}
                  </p>
                </van-step>
              </van-steps>
            </div>
          </van-tab>
          <van-tab>
            <template #title>Map</template>
            <div class="py-2">
              <div id="map" class="h-96"></div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <div v-if="errorMessage != null" class="pt-14 px-3 pb-20">
      <div
        class="bg-white rounded-lg shadow-md flex justify-center items-center"
      >
        <div>
          <van-empty image="error" :description="errorMessage" />
        </div>
      </div>
    </div>
  </van-pull-refresh>

  <van-dialog
    v-model:show="showDialog"
    :show-confirm-button="false"
    :show-cancel-button="false"
    :close-on-click-overlay="true"
  >
    <div class="p-3">
      <img src="@/assets/image/station.png" class="w-14 h-14 mx-auto mb-4" />
      <p class="text-md text-gray-700 text-center mb-3">
        {{ dialogStationTitle }}
      </p>
      <p class="text-sm text-gray-500 text-center mb-3">
        {{ dialogStationTime }}
      </p>
      <div class="text-center">
        <van-button
          icon="info-o"
          type="primary"
          size="small"
          plain
          color="#1CBC9B"
          :to="`/station/${dialogStationSlug}`"
        >
          Station Information</van-button
        >
      </div>
    </div>
  </van-dialog>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRouteDetailStore } from "@/stores/routeDetailStore"

const route = useRoute();
const router = useRouter();
const routeDetailStore = useRouteDetailStore();
const routeDetail = ref(null);
const errorMessage = ref(null);
const refreshing = ref(false);
const showDialog = ref(false);
const dialogStationTitle = ref(null);
const dialogStationTime = ref(null);
const dialogStationSlug = ref(null);

var map = null;

const onClickLeft = () => history.back();

const fetchRouteDetail = async () => {
  await routeDetailStore.get(route.params.slug, route.query.origin_station_slug, route.query.destination_station_slug);
  routeDetail.value = routeDetailStore.getResponse?.data;
  errorMessage.value = routeDetailStore.getErrorMessage;
  refreshing.value = false;
};

const initMap = () => {
  if (map !== null) {
    map.remove();
  }
  map = L.map("map").setView(
    [
      routeDetail.value.station_schedules[0]["latitude"],
      routeDetail.value.station_schedules[0]["longitude"],
    ],
    15
  );
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=IwRNyovMKfErhzgK8z93').addTo(map);

  var sationMarker = L.icon({
    iconUrl: "/src/assets/image/station-marker.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  routeDetail.value.station_schedules.forEach(function (station) {
    const marker = L.marker([station["latitude"], station["longitude"]], {
      icon: sationMarker,
    }).addTo(map);

    marker.on("click", () => {
      showDialog.value = true;
      dialogStationTitle.value = station.title;
      dialogStationTime.value = station.time;
      dialogStationSlug.value = station.slug;
    });
  });
};

const onTabChange = (index) => {
  if (index == 1) {
    nextTick(() => {
      initMap();
    });
  }
};

const onRefresh = () => {
  fetchRouteDetail();
};

onMounted(() => {
  fetchRouteDetail();
});
</script>

<style scope>
.origin-grid-item .van-grid-item__content {
  border-radius: 8px 0 0 8px !important;
}

.destination-grid-item .van-grid-item__content {
  border-radius: 0 8px 8px 0 !important;
}

.van-step--vertical{
  padding: 10px 10px 10px 10px !important;
}

.van-step--vertical .van-step__circle-container {
  top: 28px !important;
}

.total-stations-grid-item .van-grid-item__content {
  border-radius: 8px 0 0 8px !important;
}

.traveling-times-grid-item .van-grid-item__content {
  border-radius: 0 8px 8px 0 !important;
}
</style>
