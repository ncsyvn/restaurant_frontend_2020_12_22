<template>
  <v-dialog v-model="isShow" width="800" scrollable persistent>
    <v-card>
      <v-card-title class="primary white--text py-1 px-3">
        <span class="title">{{ isUpdate? 'Cập nhập phiếu' : 'Thêm mới phiếu' }}</span>
        <v-spacer></v-spacer>
        <v-btn class="white--text ma-0" small icon @click="hide">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" scope="frmAddEdit">
          <v-container class="py-0">
            <v-row>
              <v-col cols="6" class="py-0 px-1">
                <v-datetimepicker
                  v-model="bill.Datetime"
                  label="Ngày xuất phiếu"
                  :error-messages="errors.collect('Ngày xuất phiếu', 'frmAddEdit')"
                  v-validate="'required'"
                  data-vv-scope="frmAddEdit"
                  data-vv-name="Ngày xuất phiếu"
                  @input="changeDayOfWeek()"
                ></v-datetimepicker>
              </v-col>
              <v-col cols="3" class="py-0 px-1">
                <v-autocomplete
                  v-model="dayOfWeek"
                  :items="dsDayOfWeek"
                  item-text="text"
                  item-value="value"
                  label="Thứ" :readonly="true"
                ></v-autocomplete> 
              </v-col>
              <v-col cols="3" class="py-0 px-1">
                <v-text-field
                  v-model="bill.TotalMoney"
                  label="Tổng tiền"
                  :error-messages="errors.collect('Tổng tiền', 'frmAddEdit')"
                  v-validate="''"
                  :readonly="true"
                  data-vv-scope="frmAddEdit"
                  data-vv-name="Tổng tiền"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0 px-1">
                <v-text-field
                  v-model="bill.Description"
                  label="Ghi chú"
                  :error-messages="errors.collect('Ghi chú', 'frmAddEdit')"
                  v-validate="''"
                  data-vv-scope="frmAddEdit"
                  data-vv-name="Ghi chú"
                ></v-text-field>
              </v-col>
              <v-col cols="3" class="px-1 py-0">
                <v-autocomplete
                  v-model="bill.Weather"
                  :items="dsWeather"  hide-details
                  item-text="weatherName"
                  item-value="weatherID"
                  label="Thời tiết" 
                  @click="getNumberProduct()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3" class="px-1 py-0">
                <v-text-field
                  v-model.number="bill.Temperature"
                  label="Nhiệt độ"  hide-details
                  type="number"
                  :error-messages="errors.collect('Nhiệt độ', 'formBillDetail')"
                  v-validate="'required|numeric'"
                  data-vv-scope="formBillDetail"
                  data-vv-name="Nhiệt độ"
                  @input="getNumberProduct()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-show="hien">
              <v-col cols="6" class="py-0 px-1 pt-5 pb-3">
                              <h3>Danh sách sản phẩm</h3>
              </v-col>
            </v-row>
            <v-row v-show="hien">
              <v-col cols="4" class="py-0 px-1">
                <v-autocomplete
                  v-model="billDetail.ProductId"
                  :items="dsProduct"
                  item-text="ProductName"
                  item-value="ProductId"
                  label="Chọn sản phẩm"
                  :error-messages="errors.collect('Chọn sản phẩm', 'formBillBillDetail')"
                  v-validate="'required'"
                  data-vv-scope="formBillBillDetail"
                  data-vv-name="Chọn sản phẩm"
                  @click="getNumberProduct()"
                  @change="getNumberProduct()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="2" class="px-1 py-0">
                <v-text-field
                  v-model.number="billDetail.Amount"
                  label="Số lượng"
                  type="number"
                  :error-messages="errors.collect('Số lượng', 'formBillBillDetail')"
                  v-validate="'required|numeric'"
                  data-vv-scope="formBillBillDetail"
                  data-vv-name="Số lượng"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="px-1 py-0">
                <v-text-field
                  v-model.number="billDetail.Price"
                  label="Đơn giá"
                  type="number"
                  :error-messages="errors.collect('Đơn giá', 'formBillBillDetail')"
                  v-validate="'required|numeric'"
                  data-vv-scope="formBillBillDetail"
                  data-vv-name="Đơn giá"
                ></v-text-field>
              </v-col>
              <v-col cols="4" class="py-0 px-1 pt-5 pb-3">
                                <v-spacer></v-spacer>

                <v-btn
                  color="orange lighten-2"
                  style="float: right"
                  fab
                  dark
                  small
                  @click="reload()"
                >
                  <v-icon small class="px-0">autorenew</v-icon>
                </v-btn>
                <v-btn
                  color="orange lighten-2"
                  style="float: right; margin-right: 5px"
                  fab
                  dark
                  small
                  @click="saveBillBillDetail()"
                >
                  <v-icon small class="px-0">{{isUpdateChiTiet == false ? 'add' :'save'}}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" md="12" class="pt-2 py-0 px-1">
                <v-data-table
                  v-show="hien"
                  :loading="loading"
                  :items="dsBillDetail"
                  :headers="tableHeader"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:body>
                    <tbody>
                      <tr
                        v-for="item in dsBillDetail"
                        :key="item.id"
                        @click="selectedRow(item)"
                        style="cursor: pointer"
                      >
                        <td class="text-center">{{item.ProductName}}</td>
                        <td class="text-center">{{item.Amount}}</td>
                        <td class="text-center">{{item.Price}}</td>
                        <td class="text-center">{{item.Amount * item.Price}}</td>
                        <td class="text-center">
                          <v-btn icon small class="mx-0" @click="confirmDelete(item)">
                            <v-icon small color="red">delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="hide">Hủy</v-btn>
        <v-btn text @click.native="save" color="primary" :loading="loading" :disabled="loading">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import BillApi, { BillApiSearchParams } from '@/apiResources/BillApi';
import BillDetailApi from '@/apiResources/BillDetailsApi';
import { Bill } from "@/models/Bill";
import { BillDetail } from "@/models/BillDetail";
import APIS from "@/apisServer";
import ProductApi, { ProductApiSearchParams } from "../../apiResources/ProductApi";
import { Product } from "../../models/Product";

export default Vue.extend({
  $_veeValidate: {
    validator: "new"
  },
  components: {},
  data() {
    return {
      dayOfWeek: null as any,
      valid: false,
      isShow: false,
      isUpdate: false,
      bill: {
      } as Bill,
      loading: false,
      loadingSave: false,
      active: [] as any[],
      billID: 0,
      isUpdateChiTiet: false,
      dialogConfirmDelete: false,
      hien: false,
      billDetail: {
      } as BillDetail,
      dsBillDetail: [] as BillDetail[],
      loadingbtn: false,
      tableHeader: [
        { text: "Tên sản phẩm", value: "mon", align: "center", sortable: true },
        { text: "Số lượng", value: "soThuTu", align: "center", sortable: true },
        { text: "Đơn giá", value: "thaotac", align: "center", sortable: true },
        {
          text: "Thành tiền",
          value: "thaotac",
          align: "center",
          sortable: true
        },
        { text: "Thao tác", value: "thaotac", align: "center", sortable: true }
      ],
      dsProduct: [] as Product[],
      dsWeather: [
        { weatherID: 2, weatherName: 'Thunderstorm' },
        { weatherID: 3, weatherName: 'Drizzle' },
        { weatherID: 5, weatherName: 'Rain' },
        { weatherID: 6, weatherName: 'Snow' },
        { weatherID: 7, weatherName: 'Mist' },
        { weatherID: 8, weatherName: 'Clouds' },
      ], 
      dsDayOfWeek: [
        {value: 1, text: "Thứ 2"},
        {value: 2, text: "Thứ 3"},
        {value: 3, text: "Thứ 4"},
        {value: 4, text: "Thứ 5"},
        {value: 5, text: "Thứ 6"},
        {value: 6, text: "Thứ 7"},
        {value: 7, text: "Chủ nhật"}
      ]
    };
  },
  watch: {},
  created() {
  },
  methods: {
    changeDayOfWeek(){
      this.dayOfWeek = this.$moment(this.bill.Datetime).isoWeekday();
    },
    hide() {
      this.isShow = false;
    },
    show(isUpdate: boolean, item: any,type : any) {
      this.bill = {
        Weather: this.$store.state.dayWeather.weatherID,
        Temperature: parseInt(this.$store.state.dayWeather.temp)
    } as Bill
      this.isUpdateChiTiet= false;
      this.$validator.errors.clear();
      this.$validator.reset();
      this.loadingSave = false;
      this.isShow = true;
      this.dsBillDetail = [] as BillDetail[];
      this.billDetail = {} as BillDetail;
      this.getDSProduct()
      this.isUpdate = isUpdate;
      if (isUpdate) {
        this.hien = true;
        this.billID = item.BillId;
        this.getDataFromApi(this.billID);
      } else {
        this.hien = false;
        this.bill = { 
          Weather: this.$store.state.dayWeather.weatherID,
          Temperature: parseInt(this.$store.state.dayWeather.temp),
          TotalMoney: 0, Type : type, Datetime: this.$moment()
        } as Bill;
        this.changeDayOfWeek();
      } 
    },
    getDSProduct() {
      ProductApi.search().then(res => {
          this.dsProduct = (res as any).data
      })
    },
    getDSBillDetail(id: number): void {
      BillDetailApi.search(id).then(res => {
          this.dsBillDetail = (res as any).data;
                this.caculatorTotalMoney();

      }).catch(res => {
          this.loading = false;
          this.$snotify.error('Lấy dữ liệu chi tiết phiếu thất bại!');
      });
    },

    reload() {
      this.isUpdateChiTiet = false;
      this.$validator.reset();
      this.billDetail = {} as BillDetail;
    },
    selectedRow(value: BillDetail) {
      this.billDetail = value;  
      this.isUpdateChiTiet = true;
    },
    saveBillBillDetail(): void {
      this.billDetail.BillId = this.bill.BillId;
      this.$validator.validateAll("formBillBillDetail").then(res => {
        if (res) {
          if (this.isUpdateChiTiet) {
            this.loading = true;
            BillDetailApi.update(this.billDetail.BillDetailId, this.billDetail).then(res => {
                this.loading = false;
                this.isUpdateChiTiet = false;
                this.$emit("save");
                this.billDetail = {} as BillDetail;
                this.getDSBillDetail(this.bill.BillId);
                this.$snotify.success('Cập nhật thành công!');
            }).catch(res => {
                this.loading = false;
                this.$snotify.error('Cập nhật thất bại!');
            });
          } else {
              this.loading = true;
              this.billDetail.TotalMoney = this.billDetail.Amount * this.billDetail.Price;
              BillDetailApi.insert(this.billDetail).then(res => {
                  this.isUpdateChiTiet = false; 
                  this.loading = false;
                  this.hien = true;
                  this.bill.TotalMoney += this.billDetail.TotalMoney;
                  this.$emit("save");
                  this.billDetail = {} as BillDetail;
                  this.getDSBillDetail(this.bill.BillId);
                  this.$snotify.success('Thêm mới thành công!');
              }).catch(res => {
                  this.loading = false;
                  this.$snotify.error('Thêm mới thất bại!');
              });
          }
        }
        else
          this.$snotify.error('Vui lòng nhập đủ thông tin');
      });
    },
    getDataFromApi(id: number): void {
      BillApi.get(id).then(res => {
          this.bill = (res as any).data;
          this.bill.Datetime = this.$moment(this.bill.Datetime);
          this.getDSBillDetail(this.bill.BillId);
          this.changeDayOfWeek();
      });
    },
    save(): void {
      this.$validator.validateAll("frmAddEdit").then(res => {
        if (res) {
          if (this.isUpdate) {
            this.loading = true;
            BillApi.update(this.bill.BillId, this.bill).then(res => {
                this.loading = false;
                this.$emit("save");
                this.isShow = false;
                this.$snotify.success('Cập nhật thành công!');
            }).catch(res => {
                this.loading = false;
                this.$snotify.error('Cập nhật thất bại!');
            });
          } else {
              this.loading = true;
              BillApi.insert(this.bill).then(res => {
                  this.hien = true;
                  this.isUpdate = true;  
                  this.bill.BillId = (res as any).data.BillId;
                  this.$emit("save");
                  this.loading = false;
                  this.$snotify.success('Thêm mới thành công!');
              }).catch(res => {
                  this.loading = false;
                  this.$snotify.error('Thêm mới thất bại!');
              });
          }
        }
      });
    },
    confirmDelete(item: BillDetail): void {
      BillDetailApi.delete(item.BillDetailId).then(res => {
        this.getDSBillDetail(this.bill.BillId)
      })
    },
    getNumberProduct(){
      BillDetailApi.getNumberProduct(this.bill.Weather, this.bill.Temperature, this.billDetail.ProductId, this.bill.Datetime).then(res => {
        this.billDetail.Amount = (res as any).data;
      });
    },
    caculatorTotalMoney() {
      this.bill.TotalMoney = 0;
      for (let i=0; i< this.dsBillDetail.length; i++){
        this.bill.TotalMoney += this.dsBillDetail[i].Amount * this.dsBillDetail[i].Price;
      }
    }
  }
});
</script>
<style>
.v-input--selection-controls {
  margin-top: 0px !important;
}

.v-dialog > .v-card > .v-card__subtitle,
.v-dialog > .v-card > .v-card__text {
  padding: 5px 15px;
}

.v-dialog > .v-card > .v-card__title {
  padding: 16px 15px 10px;
}
</style>