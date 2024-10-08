<template>
  <div class="app-container">
    <el-card shadow="never" class="table-container">
      <template #header>
        <div class="flex-x-between">
          <div>
            <el-button type="success" @click="handleOpenDialog()">
              <i-ep-plus />
              新增
            </el-button>
          </div>
        </div>
      </template>
      <el-table v-loading="loading" :data="pageData">
        <el-table-column
          label="名称"
          width="150"
          align="center"
          prop="goods_name"
        />

        <el-table-column
          key="goods_price"
          label="原价($)"
          align="center"
          prop="goods_price"
        />
        <el-table-column
          key="discount"
          label="折扣(%)"
          align="center"
          prop="discount"
        />
        <el-table-column
          key="discount_price"
          label="折后价格($)"
          align="center"
          prop="discount_price"
        />

        <el-table-column
          label="状态"
          align="center"
          prop="goods_status"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="scope.row.goods_status == 1 ? 'success' : 'info'">
              {{ scope.row.goods_status == 1 ? "正常" : "下线" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="VIP时长(天)"
          align="center"
          prop="vip_duration"
          width="180"
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
      <el-form ref="goodsFormRef" :model="formData" label-width="180px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="formData.goods_name" maxwidth="30" />
        </el-form-item>
        <el-form-item label="商品编码" prop="goods_code">
          <el-input v-model="formData.goods_code" maxlength="30" />
        </el-form-item>
        <el-form-item label="原价($)" prop="goods_price">
          <el-input-number v-model="formData.goods_price" maxlength="30" />
        </el-form-item>
        <el-form-item label="VIP 时长(天)" prop="vip_duration">
          <el-input-number v-model="formData.vip_duration" maxlength="30" />
        </el-form-item>
        <el-form-item label="折扣(1~100)%" prop="discount">
          <el-input-number
            v-model="formData.discount"
            maxlength="30"
            :min="70"
            :max="100"
          />
        </el-form-item>
        <el-form-item label="折后价格($)" prop="discount_price">
          <el-input-number v-model="formData.discount_price" maxlength="30" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="下线"
            :active-value="1"
            :inactive-value="0"
            disabled
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Goods",
  inheritAttrs: false,
});
import GoodsAPI, { GoodsForm, GoodsPageQuery, GoodsPageVO } from "@/api/goods";

const queryFormRef = ref(ElForm);
const goodsFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<GoodsPageVO[]>();
const queryParams = reactive<GoodsPageQuery>({
  page: 1,
  size: 10,
});

const dialog = reactive({
  visible: false,
  title: "",
});

const formData = reactive<GoodsForm>({
  status: 1,
  discount: 100,
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  GoodsAPI.getPage(queryParams)
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

/**
 * 打开弹窗
 *
 * @param id ID
 */
async function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "设备信息";
    GoodsAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
    });
  } else {
    dialog.title = "";
  }
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  goodsFormRef.value.resetFields();
  goodsFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

/** 删除 */
function handleDelete(id?: number) {
  const goodsIds = [id || removeIds.value].join(",");
  if (!goodsIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      GoodsAPI.deleteByIds(goodsIds)
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

const handleSubmit = useThrottleFn(() => {
  goodsFormRef.value.validate((valid: any) => {
    if (valid) {
      const goodsId = formData.id;
      loading.value = true;
      if (goodsId) {
        GoodsAPI.update(goodsId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        GoodsAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

onMounted(() => {
  handleQuery();
});
</script>
