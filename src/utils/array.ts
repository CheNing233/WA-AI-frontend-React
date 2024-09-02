export const removeDuplicateById = (array: any[]): any[] => {
    const map = new Map<number, any>(); // 使用 Map 存储对象，键为 id
    for (const obj of array) {
        map.set(obj.id, obj);
    }

    return Array.from(map.values()); // 返回去重后的对象数组
};

export const removeObjectById = (idToRemove: string | number, array: any[]): any[] => {
    return array.filter(obj => obj.id !== idToRemove);
};

export const updateObjectInArray = (objects: any[], id: number | string, key: string, value: any): any[] => {
    return objects.map(obj => {
        if (obj.id === id) {
            return {...obj, [key]: value};
        }
        return obj;
    });
};