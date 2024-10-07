<!-- 用户管理 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="邮箱" prop="keywords">
          <el-input
            v-model="queryParams.email"
            placeholder="邮箱"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="UID" prop="keywords">
          <el-input
            v-model="queryParams.user_id"
            placeholder="UID"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            class="!w-[100px]"
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
          key="id"
          label="ID"
          align="center"
          prop="id"
          width="80"
        />
        <el-table-column key="email" label="邮箱" align="center" prop="email" />

        <el-table-column
          label="邀请码"
          width="150"
          align="center"
          prop="invite_code"
        />

        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
              {{ scope.row.status == 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

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
              v-hasPerm="['sys:user:edit']"
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(scope.row.id)"
            >
              <i-ep-view />
              查看
            </el-button>
            <el-button
              v-hasPerm="['sys:user:delete']"
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
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" maxwidth="30" disabled />
        </el-form-item>
        <el-form-item label="UID" prop="user_id">
          <el-input v-model="formData.user_id" maxlength="30" disabled />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
            disabled
          />
        </el-form-item>
      </el-form>
      <el-card shadow="never" class="table-container">
        <el-table v-loading="loading" :data="formData.devices">
          <el-table-column
            key="devices_code"
            label="设备码"
            align="center"
            prop="devices_code"
          />

          <el-table-column
            label="状态"
            align="center"
            prop="status"
            width="100"
          >
            <template #default="scope">
              <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
                {{ scope.row.status == 1 ? "正常" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="过期时间"
            align="center"
            prop="vip_expire"
            width="180"
            :formatter="formatDateTime"
          />
          <el-table-column label="操作" fixed="right" width="220">
            <template #default="scope">
              <el-button
                v-hasPerm="['sys:user:edit']"
                type="primary"
                link
                size="small"
                @click="handleOpenDialog(scope.row.id)"
              >
                <i-ep-view />
                查看
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
  name: "User",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/user";

const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<UserPageVO[]>();
/** 用户查询参数  */
const queryParams = reactive<UserPageQuery>({
  page: 1,
  size: 10,
});

/**  用户弹窗对象  */
const dialog = reactive({
  visible: false,
  title: "",
});

// 用户表单数据
const formData = reactive<UserForm>({
  status: 1,
});

/** 用户表单校验规则  */
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
  queryParams.user_id = "";
  queryParams.email = "";
  handleQuery();
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
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
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(",");
  if (!userIds) {
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
      UserAPI.deleteByIds(userIds)
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
