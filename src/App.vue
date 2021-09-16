<template>
  <div id="map"></div>
  <a id="sidebar_open" href="#" @click.prevent="open_sidebar">找口罩</a>
  <Sidebar ref="sidebar" :result="filter_result" @emit-search="filterData" @locate_pharmacy="locate_pharmacy"></Sidebar>
  <a id="locate_myself" href="#" @click.prevent="locate_myself">
    <img src="../static/btn_locate.svg" alt="">
  </a>
</template>

<script>

import L from 'leaflet';
import Sidebar from '@/components/Sidebar.vue';
import MaskFull from '../static/full.svg';
import MaskNormal from '../static/normal.svg';
import Maskless from '../static/less.svg';
import Maskout from '../static/out.svg';
import RedIcon from '../static/marker-icon-red.png';
import card from '@/api/api';

let mapObj = {};

export default {
  name: 'App',
  data() {
    return {
      data: [],
      county: '',
      town: '',
      filter_result: [],
      markers: [],
    };
  },
  methods: {
    initMap() {
      mapObj = L.map('map', {
        center: [25.042474, 121.513729],
        zoom: 18,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
        // eslint-disable-next-line max-len
        'MaskMap &copy; Code: <a href="https://creativecommons.org/licenses/by-sa/2.0/">Sean</a>, Design <a target="_blank" href="https://www.behance.net/gallery/93048833/UIUX-?tracking_source=for_you_feed_user_published">K.T</a>',
        maxZoom: 20,
      }).addTo(mapObj);
    },
    getData() {
      const vm = this;
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
      vm.$http.get(api).then((res) => {
        vm.data = res.data.features;
      });
    },
    filterData(searchData) {
      const vm = this;
      vm.county = searchData.city;
      vm.town = searchData.area;
      const result = [];
      const NowTown = vm.town;
      const NowCounty = vm.county;
      vm.data.forEach((item) => {
        const Town = item.properties.town;
        const County = item.properties.county;
        if (NowTown === '不指定區域') {
          if (County === NowCounty) {
            result.push(item);
          }
        } else if ((Town === NowTown) && (County === NowCounty)) {
          result.push(item);
        }
      });
      vm.filter_result = result;
      vm.markers = [];
      vm.print_mark(result);
    },
    print_mark(list) {
      mapObj.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapObj.removeLayer(layer);
        }
      });
      const FullIcon = new L.Icon({
        iconUrl: MaskFull,
        iconSize: [35, 35],
      });
      const NormalIcon = new L.Icon({
        iconUrl: MaskNormal,
        iconSize: [35, 35],
      });
      const LessIcon = new L.Icon({
        iconUrl: Maskless,
        iconSize: [35, 35],
      });
      const OutIcon = new L.Icon({
        iconUrl: Maskout,
        iconSize: [35, 35],
      });
      for (let i = 0; i < list.length; i += 1) {
        let maskStatus = '';
        if (list[i].properties.mask_adult > 200) {
          maskStatus = FullIcon;
        } else if ((list[i].properties.mask_adult) > 100 && (list[i].properties.mask_adult < 200)) {
          maskStatus = NormalIcon;
        } else if ((list[i].properties.mask_adult) < 100 && (list[i].properties.mask_adult > 0)) {
          maskStatus = LessIcon;
        } else {
          maskStatus = OutIcon;
        }
        const lng = list[i].geometry.coordinates[0];
        const lat = list[i].geometry.coordinates[1];
        const marker = L.marker([lat, lng], { icon: maskStatus });
        marker.addTo(mapObj).bindPopup(`${card(list[i])}`);
        this.markers.push(marker);
      }
    },
    locate_myself() {
      const Icon = new L.Icon({
        iconUrl: RedIcon,
        iconSize: [20, 30],
      });
      mapObj.locate({
        setView: true,
        watch: false,
        maxZoom: 20,
        enableHighAccuracy: true,
        timeout: 10000,
      });
      const marker = L.marker([0, 0], { icon: Icon }).addTo(mapObj);
      function foundHandler(e) {
        marker.setLatLng(e.latlng).bindPopup('<span>媽我在這</span>').openPopup();
        this.setView([e.latlng.lat, e.latlng.lng, 15]);
      }
      mapObj.on('locationfound', foundHandler);
    },
    locate_pharmacy(index) {
      this.markers[index].openPopup();
      const lng = this.filter_result[index].geometry.coordinates[0];
      const lat = this.filter_result[index].geometry.coordinates[1];
      mapObj.setView([lat, lng], 15);
    },
    open_sidebar() {
      this.$refs.sidebar.open();
    },
  },
  mounted() {
    this.initMap();
    this.getData();
  },
  components: {
    Sidebar,
  },
};
</script>

<style lang="scss">
:root {
  --color-main:#0BA29C;
  --color-yellow:#FBB03B;
  --color-red:#D4145A;
  --color-gary:#0000008b;
}
@import './assets/scss/all';
#map {
  height:100vh;
}
#sidebar_open {
  position: absolute;
  left:0;
  top:100px;
  color:#ffffff;
  padding: 10px;
  text-decoration: none;
  background-color: var(--color-main);
  z-index: 999;
  writing-mode: vertical-lr;
  letter-spacing: 1px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
#locate_myself {
  transition: all .3s;
  position: absolute;
  top:50px;
  right: 50px;
  z-index: 999;
  opacity: 0.7;
}
#locate_myself:hover {
  opacity: 1;
}
</style>
