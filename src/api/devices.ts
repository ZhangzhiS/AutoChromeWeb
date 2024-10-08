import request from "@/utils/request";

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

  static getFormData(userId: number) {
    return request<any, DevicesForm>({
      url: `${DEVICES_BASE_URL}/devices/${userId}/detail`,
      method: "get",
    });
  }

  static add(data: DevicesForm) {
    return request({
      url: `${DEVICES_BASE_URL}`,
      method: "post",
      data: data,
    });
  }

  static deleteByIds(ids: string) {
    return request({
      url: `${DEVICES_BASE_URL}/${ids}`,
      method: "delete",
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
