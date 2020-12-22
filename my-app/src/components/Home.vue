<template>
  <div style="width: 100%">
    <v-layout row wrap class="ma-3 ml-4 mr-5">
        <h3 style="padding: 20px 10px 0px 0px">Thống kê số liệu trong ngày:</h3>
      <v-flex xs3 style="margin-top: -16px">
        <v-datepicker v-model="searchParamsStatisticNgay.Datetime" @input="StatisticNgay()" hide-details></v-datepicker>
      </v-flex>
      
      </v-layout>
    <v-layout row wrap class="ma-3">
      
      <v-flex xs4>
        <v-card style="width: 100%; background-color: #4db6ac" class="pa-3">
          <h2 style="text-align: center; color: white">Số mua vào</h2>
          <h2 style="text-align: center; color: white">{{thongTinStatisticTrongNgay.soMua}}</h2>
          <h3 style="text-align: center; color: white">
            <i>({{thongTinStatisticTrongNgay.soMuaTang >= 0 ? 'Tăng ' + thongTinStatisticTrongNgay.soMuaTang : 'Giảm ' + Math.abs(thongTinStatisticTrongNgay.soMuaTang)}} sản phẩm so với hôm qua)</i>
          </h3>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card style="width: 100%; background-color: #4db6ac" class="pa-3">
          <h2 style="text-align: center; color: white">Số bán ra</h2>
          <h2 style="text-align: center; color: white">{{thongTinStatisticTrongNgay.soBan}}</h2>
          <h3 style="text-align: center; color: white">
            <i>({{thongTinStatisticTrongNgay.soBanTang >= 0 ? 'Tăng ' + thongTinStatisticTrongNgay.soBanTang : 'Giảm ' + Math.abs(thongTinStatisticTrongNgay.soBanTang)}} sản phẩm so với hôm qua)</i>
          </h3>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card style="width: 100%; background-color: #4db6ac" class="pa-3">
          <h2 style="text-align: center; color: white">Doanh thu</h2>
          <h2 style="text-align: center; color: white">{{thongTinStatisticTrongNgay.doanhThu}}</h2>
          <h3 style="text-align: center; color: white">
            <i>({{thongTinStatisticTrongNgay.doanhThuTang >= 0? 'Tăng ' + thongTinStatisticTrongNgay.doanhThuTang : 'Giảm ' + thongTinStatisticTrongNgay.doanhThuTang}}% so với hôm qua)</i>
          </h3>
        </v-card>
      </v-flex>   
    </v-layout>
    <v-layout row wrap class="ma-3 mt-5">
      <h3 style="padding: 20px 10px 0px 0px;">Thống kê số liệu trong tháng:</h3>
      <v-flex xs3 style="margin-top: -16px">
        <v-autocomplete
          v-model="searchParamsStatisticTuan.month"
          :items="dsThang"
          @change="StatisticTuan()"
          hide-details
          label="Chọn tháng"
          class="mr-1 ml-1"
        >
          <template v-slot:selection="data">Tháng {{ data.item }}</template>
          <template v-slot:item="data">Tháng {{ data.item }}</template>
        </v-autocomplete>
      </v-flex>
      <v-flex xs3 style="margin-top: -16px">
        <v-autocomplete
          v-model="searchParamsStatisticTuan.year"
          :items="dsNam"
          @change="StatisticTuan()"
          label="Chọn năm"
          class="mr-1 ml-1"
        >
          <template v-slot:selection="data">Năm {{ data.item }}</template>
          <template v-slot:item="data">Năm {{ data.item }}</template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
    <GChart
      type="ColumnChart"
      :data="chartData"
      :options="chartOptions"
      style="margin-left: -50px!important; margin-top: -30px!important; background: none"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StatisticApi, { StatisticByDayApiSearchParams, StatisticByMonthApiSearchParams } from '@/apiResources/StatisticApi';
import { debug } from "util";
export default Vue.extend({
  data() {
    return {
      chartData: [
        ["Year", "Revenues"],
        ["1", 1000],
        ["2", 300],
        ["3", 900],
        ["4", 690],
        ["5", 744],
        ["6", 865],
        ["7", 976],
        ["8", 678],
        ["9", 555],
        ["10", 454],
        ["11", 567],
        ["12", 778],
        ["13", 875],
        ["14", 667],
        ["15", 354],
        ["16", 1230],
        ["17", 567],
        ["18", 1100],
        ["19", 980],
        ["20", 1240],
        ["21", 1130],
        ["22", 1054],
        ["23", 657],
        ["24", 955],
        ["25", 564],
        ["26", 676],
        ["27", 897],
        ["28", 1460],
        ["29", 1500],
        ["30", 1355],
        ["31", 900]
      ],
      chartOptions: {
        width: 1200,
        height: 450,
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017"
        }
      },
      dsThang: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dsNam: [] as any,
      searchParamsStatisticTuan: {
        month: this.$moment().month()+1,
        year: this.$moment().year()
      } as StatisticByMonthApiSearchParams,
      searchParamsStatisticNgay: {
        Datetime: this.$moment().format('YYYY-MM-DD')
      } as StatisticByDayApiSearchParams,
      thongTinStatisticTrongNgay: {
        soMua: 0,
        soBan: 0,
        doanhThu: 0,
        soMuaTang: 0,
        soBanTang: 0,
        doanhThuTang: 0
      },
      coSoID: this.$store.state.user.Profile.CoSoID,
      isAdmin: this.$store.state.user.Profile.LoaiTaiKhoanID == 4
    };
  },
  watch: {},
  created() {
    this.dsNam = [] as number[];
    var currentYear = this.$moment().year();
    for (let i = -10; i <= 10; i++) {
      this.dsNam.push(parseInt(currentYear) + i);
    } 
    this.StatisticTuan();
    this.StatisticNgay();
  },
  methods: { 
    StatisticTuan() {
      this.chartData = [
          ['Month', 'Revenue'],
      ];
      StatisticApi.getbymonth(this.searchParamsStatisticTuan).then(res => {
          this.chartData.push(...(res as any).data)
      });
    },
    StatisticNgay() {
      StatisticApi.getbyday(this.searchParamsStatisticNgay).then(res => {
          this.thongTinStatisticTrongNgay = (res as any).data
      })
    }
  }
});
</script>
