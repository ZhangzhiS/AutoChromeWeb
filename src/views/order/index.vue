<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="邮箱" prop="order_no">
          <el-input
            v-model="queryParams.order_no"
            placeholder="订单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="UID" prop="user_id">
          <el-input
            v-model="queryParams.user_id"
            placeholder="UID"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交易类型" prop="hash_type">
          <el-input
            v-model="queryParams.hash_type"
            placeholder="交易类型"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input
            v-model="queryParams.goods_name"
            placeholder="商品名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商品Code" prop="goods_code">
          <el-input
            v-model="queryParams.goods_code"
            placeholder="UID"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <i-ep-refresh />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <el-table v-loading="loading" :data="pageData">
        <el-table-column
          key="order_no"
          label="订单号"
          align="center"
          prop="order_no"
          width="80"
        />
        <el-table-column
          key="goods_name"
          label="商品名称"
          align="center"
          prop="goods_name"
        />

        <el-table-column label="付款金额" align="center" prop="payment_price" />
        <el-table-column label="交易类型" align="center" prop="hash_type" />

        <el-table-column
          label="创建时间"
          align="center"
          prop="create_time"
          width="180"
          :formatter="formatDateTime"
        />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(scope.row.id)"
            >
              <i-ep-view />
              查看
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(scope.row.id)"
            >
              <i-ep-delete />
              禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="handleQuery"
      />
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      append-to-body
      @close="handleCloseDialog"
    >
      <el-form
        ref="orderFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="订单号" prop="order_no">
          <el-input v-model="formData.order_no" maxwidth="30" disabled />
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="formData.goods_name" maxlength="30" disabled />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button type="primary" @click="handleSubmit">确 定</el-button> -->
          <el-button @click="handleCloseDialog">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Order",
  inheritAttrs: false,
});

import UserAPI, { OrderForm, OrderPageQuery, OrderPageVO } from "@/api/order";

const queryFormRef = ref(ElForm);
const orderFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<OrderPageVO[]>();
const queryParams = reactive<OrderPageQuery>({
  page: 1,
  size: 10,
});

const dialog = reactive({
  visible: false,
  title: "",
});

const formData = reactive<OrderForm>({});

const rules = reactive({
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  UserAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.size = 10;
  handleQuery();
}

async function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "用户信息";
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
    });
  } else {
    dialog.title = "新增用户";
  }
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  orderFormRef.value.resetFields();
  orderFormRef.value.clearValidate();

  formData.id = undefined;
}

function handleDelete(id?: number) {
  const orderIds = [id || removeIds.value].join(",");
  if (!orderIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      UserAPI.deleteByIds(orderIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}

function formatDateTime(_r: any, _c: any, cellValue: string) {
  if (!cellValue) return "";
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(() => {
  handleQuery();
});
</script>
