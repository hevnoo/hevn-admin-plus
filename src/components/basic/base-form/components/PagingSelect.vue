<template>
  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    <template #footer>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        layout="prev, pager, next"
        size="small"
        @current-change="handleCurrentChange"
      />
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, useAttrs } from "vue";
// import { getUserListApi } from "@/api/core/users";

import type { CheckboxValueType } from "element-plus";

const attrs = useAttrs();

const value = ref<CheckboxValueType[]>([]);
const options = ref<any>([]);

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handleCurrentChange = (val: number) => {
  console.log(val);
  handelOptions();
};

const getOptionsApi = (payload = { page: 1, pageSize: 10 }): any => {
  return new Promise((resolve, reject) => {
    const { page = 1, pageSize = 10 } = payload;
    let options: any[] = [];
    try {
      if (page < 1) {
        throw new Error("Page number must be greater than or equal to 1");
      }
      for (let i = 0; i < 20; i++) {
        options.push({
          label: `${i}`,
          value: `${i}`,
        });
      }
      setTimeout(() => {
        resolve({
          data: {
            code: 200,
            data: options.slice(page * pageSize - pageSize, page * pageSize),
            total: options.length,
          },
        });
      }, 500);
    } catch (err) {
      reject(err);
    }
  });
};

// const getUserList = () => {
//   getUserListApi({ page: currentPage.value, pageSize: pageSize.value }).then((res) => {
//     options.value = res.data.data?.map((item) => {
//       return { label: item.email, value: item.id };
//     });
//     total.value = res.data.total;
//   });
// };
const handelOptions = () => {
  getOptionsApi({ page: currentPage.value, pageSize: pageSize.value }).then((res) => {
    options.value = res.data.data;
    total.value = res.data.total;
  });
};

async function main() {
  handelOptions();
}
main();

onMounted(() => {
  console.log("$attrs:", attrs);
});
</script>

<style lang="scss" scoped></style>
