<template>
  <div id="sidebar" :class="{ active :isShow }">
    <div class="header">
      <div class="profile">
        <img src="../assets/doctor.svg" alt="" />
      </div>
      <div class="doctor_msg">
        <span>貼心小提醒</span>
        <span>今天是身分證末一碼為</span>
        <span
          >[<span class="days">{{ whoCanBuyMasks }}</span
          >]</span
        >
        <span>的民眾才能購買口罩唷!</span>
      </div>
      <a href="#" class="close_sidebar" @click="isShow = false">
        <svg
          viewBox="0 0 16 16"
          width="1em"
          height="1em"
          focusable="false"
          role="img"
          alt="icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi-x b-icon bi"
        >
          <g>
            <path
              fill-rule="evenodd"
              d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
              clip-rule="evenodd"
            ></path>
            <path
              fill-rule="evenodd"
              d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
              clip-rule="evenodd"
            ></path>
          </g>
        </svg>
      </a>
    </div>
    <div class="content">
      <div class="select_group">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-info dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedCity }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="(city, index) in cityList" :key="index">
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="selectedCity = city.value"
                >{{ city.text }}</a
              >
            </li>
          </ul>
        </div>
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-info dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedArea }}
          </button>
          <ul class="dropdown-menu" v-show="areaList.length > 1">
            <li v-for="(area, index) in areaList" :key="index">
              <a
                @click="selectedArea = area.value"
                class="dropdown-item"
                href="#"
                >{{ area.text }}</a
              >
            </li>
          </ul>
        </div>
        <button @click="begin_search" type="button" class="btn btn-ifno search">
          <svg
            viewBox="0 0 16 16"
            width="1em"
            height="1em"
            focusable="false"
            role="img"
            alt="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi-search mr-1 b-icon bi"
          >
            <g>
              <path
                fill-rule="evenodd"
                d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z"
                clip-rule="evenodd"
              ></path>
              <path
                fill-rule="evenodd"
                d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                clip-rule="evenodd"
              ></path>
            </g>
          </svg>
        </button>
      </div>
      <ul class="pharmacy_list">
        <li v-for="(item, index) in result" :key="index">
          <div class="main">
            <div>
              <h3>{{ item.properties.name }}</h3>
              <div>
                <a
                  href="#"
                  style="background-image: url(./asstes/btn_phone.svg)"
                ></a>
              </div>
            </div>
            <span>
              <i class="fas fa-phone-alt"></i>
              {{ item.properties.phone }}
            </span>
            <span>
              <i class="fas fa-map-marker-alt"></i>
              {{ item.properties.address }}
              </span>
            <span>
              <i class="fas fa-quote-right"></i>
              {{ item.properties.note}}
            </span>
          </div>
          <div class="bottom">
            <span
              :style="`background-color:${checkMaskStatus(
                item.properties.mask_adult
              )}`"
              >成人 {{ item.properties.mask_adult }}</span
            >
            <span
              :style="`background-color:${checkMaskStatus(
                item.properties.mask_child
              )}`"
              >兒童 {{ item.properties.mask_child }}</span
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <h1>口罩地圖</h1>
      <span class="updtae_msg">最後更新時間</span>
    </div>
  </div>
</template>

<script>
import cityCountyData from '@/assets/cityCountyData.json';

export default {
  props: {
    result: Array,
  },
  data() {
    return {
      isShow: false,
      day: '',
      selectedCity: '請選擇城市',
      selectedArea: '不指定區域',
    };
  },
  methods: {
    begin_search() {
      const searchData = {
        city: this.selectedCity,
        area: this.selectedArea,
      };
      this.$emit('emit-search', searchData);
    },
    checkMaskStatus(mask) {
      let status = '';
      if (mask > 200) {
        status = '#0BA29C';
      } else if ((mask < 200) && (mask > 100)) {
        status = '#FBB03B';
      } else if ((mask < 100) && (mask > 0)) {
        status = '#D4145A';
      } else {
        status = '#00000080';
      }
      return status;
    },
    open() {
      this.isShow = true;
    },
  },
  computed: {
    cityList() {
      return cityCountyData.map((city) => ({
        text: city.CityName,
        value: city.CityName,
      }));
    },
    areaList() {
      const vm = this;
      try {
        return cityCountyData
          .find((city) => city.CityName === vm.selectedCity)
          .AreaList.map((area) => ({
            text: area.AreaName,
            value: area.AreaName,
          }));
      } catch (err) {
        return [];
      }
    },
    whoCanBuyMasks() {
      let string = '';
      if (this.day % 2 === 0) {
        string = '2、4、6、8、0';
      } else {
        string = '1、3、5、7、9';
      }
      return string;
    },
  },
  watch: {
    selectedCity() {
      this.selectedArea = '不指定區域';
    },
  },
  mounted() {
    this.day = new Date().getDay();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#sidebar {
  position: fixed !important;
  top: 0;
  bottom: 0;
  left:-400px;
  width: 400px;
  background: #f8f9fa;
  z-index: 1100;
  letter-spacing: 1px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: all .3s;
  &.active {
    left:0px;
  }
  .header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .profile {
      flex-grow: 1;
      text-align: center;
    }
    .doctor_msg {
      display: flex;
      flex-direction: column;
      span {
        color: #00000080;
        font-size: 1.1rem;
      }
      span:nth-child(1) {
        color: #0ba29c;
        font-size: 1.5rem;
        font-weight: bold;
      }
      span.days {
        color: #fbb03b;
        font-size: 1.2rem;
      }
    }
    .close_sidebar {
      color:#00000080;
      position: absolute;
      top:-5px;
      right:-5px;
      svg {
        width:25px;
        height:25px;
      }
    }
  }
  .select_group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .btn-group {
      width: 40%;
      .btn {
        color: #ffffff;
      }
    }
    .search {
      background-color: transparent;
      border:1px solid #0ba29c;
      color:#0ba29c;
    }
    .search:hover {
      background: #0ba29c;
      color:#ffffff;
    }
  }
  .pharmacy_list {
    height:800px;
    max-height:800px;
    overflow-y:auto;
    list-style: none;
    margin: 0;
    margin-right: -1em;
    padding: 10px;
    &::-webkit-scrollbar {
      width: 15px;
    }
    &::-webkit-scrollbar-thumb {
      background: #0ba29c;
      border-radius: 10px;
    }
    li {
      margin-bottom: 50px;
      box-shadow: 0px 3px 6px #0000004B;
      border-radius: 14px;
      .main {
        display: flex;
        flex-direction: column;
        padding: 1em;
        h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color:#0ba29c;
        }
      }
      .bottom {
       display: flex;
       span {
         width: 50%;
         padding: 1em;
         color:#ffffff;
         line-height: 1rem;
         font-size: 1rem;
         text-align: center;
       }
       span:first-child {
         border-bottom-left-radius: 14px;
         border-right: 1px solid #00000080;
       }
       span:last-child {
         border-bottom-right-radius: 14px;
       }
      }
    }
  }
  & > .bottom {
    background: #0ba29c;
    height: 100px;
    margin: 0 -1em -1em -1em;
    display: flex;
    align-items: center;
    padding: 0 10px;
    h1 {
      color:#ffffff;
      font-size: 1.5rem;
      margin: 0;
      margin-right: 20px;
      font-weight: bold;
    }
    .updtae_msg {
      font-size: 1rem;
      color:#ffffff;
    }
  }
}
</style>
