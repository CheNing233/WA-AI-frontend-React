/**
 * 根据前缀筛选数组中的字符串
 *
 * @param prefix 字符串前缀，用于筛选
 * @param list 待筛选的字符串数组
 * @param without 是否排除带有前缀的字符串，默认为false
 * @returns 返回筛选后的字符串数组
 */
export const getListUsePrefix = (prefix: string, list: string[], without = false) => {
    // 使用filter方法对数组进行筛选
    return list.filter(tag => {
        // 判断当前字符串是否以指定前缀开头
        let isMatch = tag.startsWith(prefix)
        // 根据without参数的值决定是否返回带有前缀的字符串
        if (!without) {
            // 如果without为false，返回所有以指定前缀开头的字符串
            return isMatch
        } else {
            // 如果without为true，返回所有不以指定前缀开头的字符串
            return !isMatch
        }
    })
}

