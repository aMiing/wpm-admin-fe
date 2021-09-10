/**
 * 价格、钱数保留两位小数
 * @param {*} price 
 */
export function scaleTwoPrice(price) {
    return Math.round(price * 100) / 100
}