<template>
  <v-col cols="12" class="pa-0">
    <v-card>
      <v-card-text>
        <h2>Danh sách {{type == 0? 'nhập' : 'xuất'}} hàng</h2>
        <v-row>
          <v-col cols="3">
            <v-datepicker
              v-model="searchParamsBill.DatetimeStart"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              label="Từ ngày"
              placeholder="dd/mm/yyyy"
            ></v-datepicker>
          </v-col>
          <v-col cols="3">
            <v-datepicker
              v-model="searchParamsBill.DatetimeEnd"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              label="Đến ngày"
              placeholder="dd/mm/yyyy"
            ></v-datepicker>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="searchParamsBill.TotalMoneyStart"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              type="number"
              label="Tổng tiền từ"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="searchParamsBill.TotalMoneyEnd"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              type="number"
              label="Tổng tiền đến"
            ></v-text-field>
          </v-col>
          <v-col cols="12" style="padding-top:0">
            <v-spacer></v-spacer>
            <v-btn @click="showModalThemSua(false, {})" color="primary" style="float: right" small>
              <v-icon small>add</v-icon>Thêm Mới
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- @update:options="getDataFromApi"
                    :options.sync="searchParamsBill"
          :server-items-length="searchParamsBill.totalItems"-->
          <v-col cols="12" class="pt-0">
            <v-data-table
              :headers="tableHeader"
              :items="lstBill"
              :loading="loadingTable"
              class="elevation-1"
              :search="search"
              :items-per-page="5"
            >
              <v-progress-linear height="2" slot="progress" color="blue" indeterminate></v-progress-linear>
              <template v-slot:item.no="{ item }">
                {{ lstBill.indexOf(item) + 1 }}
              </template>
              <template v-slot:item.Datetime="{ item }">
                {{ item.Datetime | moment('DD/MM/YYYY hh:mm:ss A') }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-layout nowrap style="place-content: center">
                  <v-btn text icon small @click="showModalThemSua(true, item)" class="ma-0">
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-btn
                    text
                    icon
                    small
                    color="red"
                    class="ma-0"
                    @click="confirmDelete(item)"
                  >
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </v-layout>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogConfirmDelete" max-width="290">
      <v-card>
        <v-card-title class="headline">Xác nhận xóa</v-card-title>
        <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="dialogConfirmDelete=false" text>Hủy</v-btn>
          <v-btn color="red darken-1" @click.native="deleteBill" text>Xác Nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <them-sua-phieu ref="themSuaPhieu" @save="getDataFromApi(searchParamsBill)"></them-sua-phieu>
  </v-col>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
import BillApi, {BillApiSearchParams} from '@/apiResources/BillApi';
import { Bill } from "@/models/Bill";
import ThemSuaPhieu from "./ThemSuaPhieu.vue";
import { type } from "os";

export default Vue.extend({
  components: {
    ThemSuaPhieu
  },
  data() {
    return {
      search: '',
      tableHeader: [
        { text: "#", value: "no", sortable: false, align: "center" },
        {
          text: "Ngày tháng",
          value: "Datetime",
          sortable: false,
          align: "center"
        },
        {
          text: "Tổng tiền",
          sortable: false,
          value: "TotalMoney",
          align: "center"
        },
        { text: "Ghi chú", sortable: false, value: "Description", align: "center" },
        { text: "Thao tác", value: "actions", sortable: false, align: "center" }
      ],
      searchParamsBill: {} as BillApiSearchParams,
      loadingTable: false,
      selectedBill: {} as Bill,
      dialogConfirmDelete: false,
      lstBill: [] as Bill[],
      type: null as any
    };
  },
  watch: {
    '$route': function (to, from) {
        if (to.params.type == "import") {
          this.type = 0;
          this.searchParamsBill.Type = 0;
        }
        else {
          this.type = 1;
          this.searchParamsBill.Type = 1;
        }
        this.getDataFromApi(this.searchParamsBill)
      }
  },
  // beforeRouteUpdate(to, from, next) {
  //   if (to.params.type == "import") {
  //     this.type = 0;
  //     this.searchParamsBill.Type = 0;
  //   }
  //   else {
  //     this.type = 1;
  //     this.searchParamsBill.Type = 1;
  //   }
  //   next();
  // },
  created() {
    if (this.$route.params.type == "import") {
      this.type = 0;
      this.searchParamsBill.Type = 0;
    }
    else {
      this.type = 1;
      this.searchParamsBill.Type = 1;
    }
    this.getDataFromApi(this.searchParamsBill)
  },
  methods: {
    getDataFromApi(searchParamsBill: BillApiSearchParams): void {
      this.loadingTable = true;
      BillApi.search(searchParamsBill).then(res => {
        this.lstBill = (res as any).data;
        //this.searchParamsBill.totalItems = res.Pagination.totalItems;
        this.loadingTable = false;
      });
    },
    showModalThemSua(isUpdate: boolean, item: any) {
      (this.$refs.themSuaPhieu as any).show(isUpdate, item, this.type);
    },
    confirmDelete(chuyenMuc: Bill): void {
      this.selectedBill = chuyenMuc;
      this.dialogConfirmDelete = true;
    },
    deleteBill(): void {
      BillApi.delete(this.selectedBill.BillId).then(res => {
          this.$snotify.success('Xóa thành công!');
          this.getDataFromApi(this.searchParamsBill);
          this.dialogConfirmDelete = false;
      }).catch(res => {
          this.$snotify.error('Xóa thất bại!');
      });
    }
  }
});
</script>

