export const flattenObject = (obj) => {
    const result = {};
    const flatten = (current, property) => {
        if (typeof current === "object") {
            for (const key in current) {
                flatten(current[key], property ? `${key}` : key);
            }
        } else {
            result[property] = current;
        }
    };
    flatten(obj, "");
    return result;
}

export const sortObjectKeys = (obj, fixedKeys) => {
    const keys = Object.keys(obj);
    const remainingKeys = keys.filter((key) => !fixedKeys.includes(key));

    // 将指定的几项移动到固定位置
    let sortedKeys = fixedKeys.concat(remainingKeys);

    // 根据排序后的键构建新对象
    const sortedObject = {};
    sortedKeys.forEach((key) => {
        sortedObject[key] = obj[key];
    });
    return sortedObject;
}

export const splitObject = (
    obj: Record<string, any>,
    keys: string[]
): [Record<string, any>, Record<string, any>] => {
    const obj1: Record<string, any> = {};
    const obj2: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (keys.includes(key)) {
            obj1[key] = value;
        } else {
            obj2[key] = value;
        }
    });

    return [obj1, obj2];
}
