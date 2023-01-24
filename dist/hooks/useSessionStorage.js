"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSessionStorage = void 0;
const useBrowserStorage_1 = require("./useBrowserStorage");
/**
 * Use a session storage item. Use this in a similar fashion to `React.useState()`.
 * @param key The key for the stored item.
 * @param defaultWhenNull The default value for the item when it is null in sessionStorage.
 * @param options Options for the stored item, such as: `scope` prefix (default `''`), `scopeKeyDivider` (separates scope from key name, default `.`, ignored when scope is `''`), the `encode` function, and the `decode` function. All are optional.
 * @returns An array of values in the shape: `[state: T | null, setState: (val: T | null) => void, initialized: boolean, clear: () => void]`. The `initialized` value indicates whether the value has been read from localStorage. Will be false when `scope` option is undefined.
 */
function useSessionStorage(key, defaultWhenNull, options = useBrowserStorage_1.DEFAULT_BROWSER_STORAGE_OPTIONS) {
    return (0, useBrowserStorage_1.useBrowserStorage)(key, defaultWhenNull, sessionStorage, options);
}
exports.useSessionStorage = useSessionStorage;
