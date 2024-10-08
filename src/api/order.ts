import request from "@/utils/request";

const DEVICES_BASE_URL = "/api/v1/sys/order";

class OrderAPI {
  /**
   * 获取分页列表
   *
   * @param queryParams 查询参数
   */
  static getPage(queryParams: OrderPageQuery) {
    return request<any, PageResult<OrderPageVO[]>>({
      url: `${DEVICES_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  static getFormData(userId: number) {
    return request<any, OrderForm>({
      url: `${DEVICES_BASE_URL}/${userId}/detail`,
      method: "get",
    });
  }

  static add(data: OrderForm) {
    return request({
      url: `${DEVICES_BASE_URL}/add`,
      method: "post",
      data: data,
    });
  }

  static update(id: number, data: OrderForm) {
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

export default OrderAPI;

/**
 * 分页查询对象
 */
export interface OrderPageQuery extends PageQuery {
  order_no?: string;
  user_id?: string;
  hash_type?: string;
  goods_code?: string;
  goods_name?: string;
}

/** 分页对象 */
export interface OrderPageVO {
  id?: number;
  order_no?: string;
  goods_id?: string;
  goods_name?: string;
  goods_code?: string;
  payment_price?: number;
  ori_price?: number;
  hash_type?: string;
  create_time?: Date;
}

/** 表单类型 */
export interface OrderForm {
  id?: number;
  order_no?: string;
  goods_id?: string;
  goods_name?: string;
  goods_code?: string;
  payment_price?: number;
  ori_price?: number;
  hash_type?: string;
  create_time?: Date;
}
