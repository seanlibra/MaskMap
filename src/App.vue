<template>
  <div id="map"></div>
  <a id="sidebar_open" href="#" @click.prevent="open_sidebar">側邊欄</a>
  <Sidebar ref="sidebar" :result="filter_result" @emit-search="filterData"></Sidebar>
  <a id="locate_myself" href="#" @click.prevent="locate_myself()">
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

export default {
  name: 'App',
  data() {
    return {
      mapObject: '',
      data: [],
      county: '',
      town: '',
      filter_result: [],
    };
  },
  methods: {
    initMap() {
      this.mapObject = L.map('map', {
        center: [25.042474, 121.513729],
        zoom: 18,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
        // eslint-disable-next-line max-len
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
      }).addTo(this.mapObject);
    },
    getData() {
      const vm = this;
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
      vm.$http.get(api).then((res) => {
        vm.data = res.data.features;
      });
    },
    filterData(searchData) {
      this.county = searchData.city;
      this.town = searchData.area;
      const vm = this;
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
      vm.print_mark(result);
    },
    print_mark(list) {
      this.mapObject.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.mapObject.removeLayer(layer);
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
      list.forEach((item) => {
        let maskStatus = '';
        if (item.properties.mask_adult > 200) {
          maskStatus = FullIcon;
        } else if ((item.properties.mask_adult) > 100 && (item.properties.mask_adult < 200)) {
          maskStatus = NormalIcon;
        } else if ((item.properties.mask_adult) < 100 && (item.properties.mask_adult > 0)) {
          maskStatus = LessIcon;
        } else {
          maskStatus = OutIcon;
        }
        const lng = item.geometry.coordinates[0];
        const lat = item.geometry.coordinates[1];
        L.marker([lat, lng], { icon: maskStatus }).addTo(this.mapObject)
          .bindPopup(`<h3>${item.properties.name}</h3>`);
      });
    },
    locate_myself() {
      const FullIcon = new L.Icon({
        iconUrl: RedIcon,
        iconSize: [20, 30],
      });
      this.mapObject.locate({
        setView: true,
        watch: false,
        maxZoom: 20,
        enableHighAccuracy: true,
        timeout: 10000,
      });
      const marker = L.marker([0, 0], { icon: FullIcon }).addTo(this.mapObject);
      function foundHandler(e) {
        marker.setLatLng(e.latlng).bindPopup('<span>媽我在這</span>').openPopup();
      }
      this.mapObject.on('locationfound', foundHandler);
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
  background: #0BA29c;
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
