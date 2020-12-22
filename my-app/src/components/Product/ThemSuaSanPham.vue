<template>
  <v-dialog v-model="isShow" width="600" scrollable persistent>
    <v-card>
      <v-card-title class="primary white--text py-1 px-3">
        <span class="title">{{ isUpdate? 'Cập nhập sản phẩm' : 'Thêm mới sản phẩm' }}</span>
        <v-spacer></v-spacer>
        <v-btn class="white--text ma-0" small icon @click="hide">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form scope="frmAddEdit">
          <v-row>
            <v-col cols="4">
              <v-img :src="product.Thumbnail" style="padding-top: 20px"></v-img>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="product.ProductName"
                label="Tên sản phẩm *"
                type="text"
                :error-messages="errors.collect('Tên sản phẩm', 'frmAddEdit')"
                v-validate="'required'"
                class="ml-1 mr-1"
                data-vv-scope="frmAddEdit"
                data-vv-name="Tên sản phẩm"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="product.ModelID"
                label="Loại sản phẩm"
                :items="lstModel"
                :error-messages="errors.collect('Loại sản phẩm', 'frmAddEdit')"
                v-validate="'required'"
                class="mr-1"
                data-vv-scope="frmAddEdit"
                data-vv-name="Loại sản phẩm"
                clearable
              ></v-select>
            </v-col>
          </v-row>
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
import ProductApi from "@/apiResources/ProductApi";
import { Product } from "@/models/Product";
export default Vue.extend({
  $_veeValidate: {
    validator: "new"
  },
  components: {},
  data() {
    return {
      isShow: false,
      isUpdate: false,
      product: {
        Thumbnail: "https://znews-photo.zadn.vn/w660/Uploaded/wyhktpu/2018_08_13/image003_20.jpg",
      } as Product,
      loading: false,
      loadingSave: false,
      active: [] as any[],
      open: [],
      productID: 0,
      lstModel: [1,2,3,4,5,6,7,8,9,10]
    };
  },
  watch: {},
  methods: {
    hide() {
      this.isShow = false;
    },
    show(isUpdate: boolean, item: any) {
      this.$validator.reset();
      this.loadingSave = false;
      this.isShow = true;
      this.isUpdate = isUpdate;
      if (isUpdate) {
        this.productID = item.ProductId;
        this.getDataFromApi(this.productID);
      } else {
        this.product = {
          Thumbnail: "https://znews-photo.zadn.vn/w660/Uploaded/wyhktpu/2018_08_13/image003_20.jpg",
        } as Product;
      }
    },
    getDataFromApi(id: number): void {
      ProductApi.get(id).then(res => {
        this.product = (res as any).data;
      });
    },
    save(): void {
      this.$validator.validateAll("frmAddEdit").then(res => {
        if (res) {
          if (this.isUpdate) {
            this.loading = true;
            ProductApi.update(this.productID, this.product)
              .then(res => {
                this.loading = false;
                this.$emit("save");
                this.isShow = false;
                this.$snotify.success("Cập nhật thành công!");
              })
              .catch(res => {
                this.loading = false;
                this.$snotify.error("Cập nhật thất bại!");
              });
          } else {
            this.loading = true;
            ProductApi.insert(this.product)
              .then(res => {
                this.product = res;
                this.isShow = false;
                this.$emit("save");
                this.loading = false;
                this.$snotify.success("Thêm mới thành công!");
              })
              .catch(res => {
                this.loading = false;
                this.$snotify.error("Thêm mới thất bại!");
              });
          }
        }
      });
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