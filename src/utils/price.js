/**
 * 价格、钱数保留两位小数
 * @param {*} price
 */
export function scaleTwoPrice(price) {
  return toFixedFloat(price, 2);
}

export function toFixedFloat(float, digits) {
  return Math.round(float * Math.pow(10, digits)) / Math.pow(10, digits);
}
