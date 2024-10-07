import request from "@/utils/request";
import { AxiosPromise, AxiosResponse } from "axios";

const DEVICES_BASE_URL = "/api/v1/sys/goods";

class GoodsAPI {
  /**
   * 获取分页列表
   *
   * @param queryParams 查询参数
   */
  static getPage(queryParams: GoodsPageQuery) {
    return request<any, PageResult<GoodsPageVO[]>>({
      url: `${DEVICES_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  static getFormData(userId: number) {
    return request<any, GoodsForm>({
      url: `${DEVICES_BASE_URL}/${userId}/detail`,
      method: "get",
    });
  }

  static add(data: GoodsForm) {
    return request({
      url: `${DEVICES_BASE_URL}/add`,
      method: "post",
      data: data,
    });
  }

  static update(id: number, data: GoodsForm) {
    return request({
      url: `${DEVICES_BASE_URL}/${id}/edit`,
      method: "put",
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

export default GoodsAPI;

/**
 * 分页查询对象
 */
export interface GoodsPageQuery extends PageQuery {}

/** 分页对象 */
export interface GoodsPageVO {
  id?: number;
  goods_name?: string;
  goods_code?: string;
  goods_price?: number;
  vip_duration?: number;
  discount?: number;
  status?: number;
  discount_price?: number;
  create_time?: Date;
}

/** 表单类型 */
export interface GoodsForm {
  id?: number;
  goods_name?: string;
  goods_code?: string;
  goods_price?: number;
  vip_duration?: number;
  discount?: number;
  status?: number;
  discount_price?: number;
  create_time?: Date;
}
