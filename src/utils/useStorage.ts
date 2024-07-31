// https://stackoverflow.com/questions/68424114/next-js-how-to-fetch-localstorage-data-before-client-side-rendering
// 解决 nextJS 无法获取初始localstorage问题

import {useEffect, useState} from 'react';

const getDefaultStorage = (key) => {
    return localStorage.getItem(key);
};

function useStorage(
    key: string,
    defaultValue?: string
): [string, (string) => void, () => void] {
    const [storedValue, setStoredValue] = useState(
        getDefaultStorage(key) || defaultValue
    );

    const setStorageValue = (value: string) => {

        localStorage.setItem(key, value);
        if (value !== storedValue) {
            setStoredValue(value);
        }

    };

    const removeStorage = () => {

        localStorage.removeItem(key);

    };

    useEffect(() => {
        const storageValue = localStorage.getItem(key);
        if (storageValue) {
            setStoredValue(storageValue);
        }
    }, []);

    return [storedValue, setStorageValue, removeStorage];
}

export default useStorage;
