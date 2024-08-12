import dayjs from 'dayjs';

/**
 * 将特定格式的字符串转换为日期
 * @param inputString 待转换的字符串，格式应为 "YYYY-周数周"，例如 "2024-33周"
 * @returns 如果字符串格式正确，返回对应的日期对象；否则返回 null
 */
export const convertStringToDate = (inputString: string): dayjs.Dayjs | null => {
    // 定义正则表达式模式，用于匹配输入字符串
    const pattern = /^(\d{4})-(\d{1,2})周$/; // 匹配形如 "2024-33周" 的字符串格式

    if (!inputString) return null;

    // 使用正则表达式匹配输入字符串
    const match = inputString.match(pattern);
    // 如果不匹配，返回 null
    if (!match) {
        // console.error("输入字符串格式不正确");
        return null;
    }

    // 从匹配结果中提取年份和周数
    const year = parseInt(match[1]);
    const week = parseInt(match[2]);

    // 获取当年的第一天
    const firstDayOfYear = dayjs().year(year).startOf('year'); // 获取当年第一天

    // 如果年份不合法，返回 null
    if (!firstDayOfYear.isValid()) {
        // console.error("年份不正确");
        return null;
    }

    // 计算目标日期
    const resultDate = firstDayOfYear.add(week - 1, 'week'); // 加上周数-1得到目标日期

    // 如果周数不合法，返回 null
    if (!resultDate.isValid()) {
        // console.error("周数不正确");
        return null;
    }

    // 返回计算得到的日期
    return resultDate;
};

