"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalStorage = void 0;
const useBrowserStorage_1 = require("./useBrowserStorage");
/**
 * Use a local storage item. Use this in a similar fashion to `React.useState()`.
 * @param key The key for the stored item.
 * @param defaultWhenUndefined The default value for the item when it is undefined in localStorage.
 * @param options Options for the stored item, such as: `prefix` prefix (default `''`), `prefixDivider` (separates prefix from key name, default `.`, ignored when prefix is `''`), the `encode` function, and the `decode` function. All are optional.
 * @returns An array of values in the shape: `[state: T | null | undefined, setState: (val: T | null) => void, initialized: boolean, clear: () => void, prefixedStorageKey: boolean]`. The `initialized` value indicates whether the value has been read from localStorage. Will be false when `prefix` option is undefined.
 */
function useLocalStorage(key, defaultWhenUndefined = undefined, options = useBrowserStorage_1.DEFAULT_BROWSER_STORAGE_OPTIONS) {
    return (0, useBrowserStorage_1.useBrowserStorage)(key, defaultWhenUndefined, localStorage, options);
}
exports.useLocalStorage = useLocalStorage;
