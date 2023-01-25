"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalStorage = void 0;
const useBrowserStorage_1 = require("./useBrowserStorage");
/**
 * Access a `localStorage` item. Use this in a similar fashion to `React.useState()`.
 *
 * See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--page).
 *
 * Examples:
 *
 * ```jsx
 * const [value, setValue] = useLocalStorage('key');
 * const [value, setValue] = useLocalStorage('key', 'Default');
 * const [value, setValue, initialized, clear, prefixedKey] = useLocalStorage('key', 'Default', {
 *   prefix: 'my-namespace',
 * });
 * ```
 *
 * @param key The key for the stored item.
 * @param defaultWhenUndefined The default value for the item when it is undefined in `localStorage`.
 * @param options Options for the stored item. See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--page#props) for more.
 * @returns The storage state. See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--page#return) for details.
 */
function useLocalStorage(key, defaultWhenUndefined = undefined, options = useBrowserStorage_1.DEFAULT_BROWSER_STORAGE_OPTIONS) {
    return (0, useBrowserStorage_1.useBrowserStorage)(key, defaultWhenUndefined, localStorage, options);
}
exports.useLocalStorage = useLocalStorage;
