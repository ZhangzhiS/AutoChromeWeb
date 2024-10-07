import request from "@/utils/request";
import { AxiosPromise, AxiosResponse } from "axios";

const DEVICES_BASE_URL = "/api/v1/sys";

class DevicesAPI {
  /**
   * 获取分页列表
   *
   * @param queryParams 查询参数
   */
  static getPage(queryParams: DevicesPageQuery) {
    return request<any, PageResult<DevicesPageVO[]>>({
      url: `${DEVICES_BASE_URL}/devices/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 获取用户表单详情
   *
   * @param userId 用户ID
   * @returns 用户表单详情
   */
  static getFormData(userId: number) {
    return request<any, DevicesForm>({
      url: `${DEVICES_BASE_URL}/devices/${userId}/detail`,
      method: "get",
    });
  }

  /**
   * 添加用户
   *
   * @param data 用户表单数据
   */
  static add(data: DevicesForm) {
    return request({
      url: `${DEVICES_BASE_URL}`,
      method: "post",
      data: data,
    });
  }

  /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  static update(id: number, data: DevicesForm) {
    return request({
      url: `${DEVICES_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  }

  /**
   * 修改用户密码
   *
   * @param id 用户ID
   * @param password 新密码
   */
  static resetPassword(id: number, password: string) {
    return request({
      url: `${DEVICES_BASE_URL}/${id}/password/reset`,
      method: "put",
      params: { password: password },
    });
  }

  /**
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  static deleteByIds(ids: string) {
    return request({
      url: `${DEVICES_BASE_URL}/${ids}`,
      method: "delete",
    });
  }

  /** 下载用户导入模板 */
  static downloadTemplate() {
    return request({
      url: `${DEVICES_BASE_URL}/template`,
      method: "get",
      responseType: "arraybuffer",
    });
  }

  /**
   * 导出用户
   *
   * @param queryParams 查询参数
   */
  static export(queryParams: UserPageQuery) {
    return request({
      url: `${DEVICES_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "arraybuffer",
    });
  }

  /**
   * 导入用户
   *
   * @param deptId 部门ID
   * @param file 导入文件
   */
  static import(deptId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: `${DEVICES_BASE_URL}/import`,
      method: "post",
      params: { deptId: deptId },
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /** 获取个人中心用户信息 */
  static getProfile() {
    return request<any, UserProfileVO>({
      url: `${DEVICES_BASE_URL}/profile`,
      method: "get",
    });
  }

  /** 修改个人中心用户信息 */
  static updateProfile(data: UserProfileForm) {
    return request({
      url: `${DEVICES_BASE_URL}/profile`,
      method: "put",
      data: data,
    });
  }

  /** 修改个人中心用户密码 */
  static changePassword(data: PasswordChangeForm) {
    return request({
      url: `${DEVICES_BASE_URL}/password`,
      method: "put",
      data: data,
    });
  }

  /**
   *   发送手机/邮箱验证码
   *
   * @param contact 联系方式  手机号/邮箱
   * @param contactType 联系方式类型 MOBILE:手机;EMAIL:邮箱
   */
  static sendVerificationCode(contact: string, contactType: string) {
    return request({
      url: `${DEVICES_BASE_URL}/send-verification-code`,
      method: "get",
      params: { contact: contact, contactType: contactType },
    });
  }

  /** 绑定个人中心用户手机 */
  static bindMobile(data: MobileBindingForm) {
    return request({
      url: `${DEVICES_BASE_URL}/mobile`,
      method: "put",
      data: data,
    });
  }

  /** 绑定个人中心用户邮箱 */
  static bindEmail(data: EmailBindingForm) {
    return request({
      url: `${DEVICES_BASE_URL}/email`,
      method: "put",
      data: data,
    });
  }

  /**
   *  获取用户下拉列表
   */
  static getOptions() {
    return request<any, OptionType[]>({
      url: `${DEVICES_BASE_URL}/options`,
      method: "get",
    });
  }
}

export default DevicesAPI;

/**
 * 分页查询对象
 */
export interface DevicesPageQuery extends PageQuery {
  device_code?: string;
  user_id?: string;
  device_id?: string;
  status?: number;
}

/** 分页对象 */
export interface DevicesPageVO {
  id?: number;
  user_id?: string;
  device_id?: string;
  device_code?: string;
  status?: number;
  create_time?: Date;
  vip_expire?: Date;
}

export interface DevicesOrder {
  order_no?: string;
  gods_code?: string;
  gods_name?: string;
  hash_type?: string;
  create_time?: Date;
}

/** 表单类型 */
export interface DevicesForm {
  id?: number;
  user_id?: string;
  device_id?: string;
  device_code?: string;
  status?: number;
  vip_expire?: Date;
  create_time?: Date;
  orders?: any[];
}
