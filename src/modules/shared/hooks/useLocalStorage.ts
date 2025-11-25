"use client"
import {useState} from "react";

export const useLocalStorage = (key: string, initialValue: string) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value: string) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            throw error;
        }
    };
    return [storedValue, setValue];
};

