<template>
  <div id="map"></div>
  <a id="sidebar_open" href="#" @click.prevent="open_sidebar">側邊欄</a>
  <Sidebar ref="sidebar" :result="filter_result" @emit-search="filterData"></Sidebar>
</template>

<script>

import L from 'leaflet';
import Sidebar from '@/components/Sidebar.vue';
import MaskFull from '../static/full.svg';
import MaskNormal from '../static/normal.svg';
import Maskless from '../static/less.svg';
import Maskout from '../static/out.svg';

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
        if ((Town === NowTown) && (County === NowCounty)) {
          result.push(item);
        }
      });
      vm.filter_result = result;
      vm.print_mark(result);
    },
    print_mark(list) {
      const FullIcon = new L.Icon({
        iconUrl: MaskFull,
        iconSize: [30, 30],
      });
      const NormalIcon = new L.Icon({
        iconUrl: MaskNormal,
        iconSize: [30, 30],
      });
      const LessIcon = new L.Icon({
        iconUrl: Maskless,
        iconSize: [30, 30],
      });
      const OutIcon = new L.Icon({
        iconUrl: Maskout,
        iconSize: [30, 30],
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
</style>
