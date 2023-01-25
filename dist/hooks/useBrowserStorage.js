"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageEventEmitter = exports.EMITTER_CHANGE_EVENT_NAME = exports.defaultDecode = exports.defaultEncode = exports.useBrowserStorage = exports.DEFAULT_BROWSER_STORAGE_OPTIONS = void 0;
const react_1 = __importDefault(require("react"));
const events_1 = __importDefault(require("events"));
const react_sub_unsub_1 = require("react-sub-unsub");
exports.DEFAULT_BROWSER_STORAGE_OPTIONS = {
    prefix: undefined,
    prefixSeparator: '.',
    shouldInitialize: true,
    emitterListenerDisabled: false,
    storageEventListenerDisabled: false,
    encode: defaultEncode,
    decode: defaultDecode,
};
function useBrowserStorage(key, defaultWhenUndefined, storage, options = exports.DEFAULT_BROWSER_STORAGE_OPTIONS) {
    const opts = react_1.default.useMemo(() => {
        return Object.assign(Object.assign({}, exports.DEFAULT_BROWSER_STORAGE_OPTIONS), options);
    }, [
        options.prefix,
        options.prefixSeparator,
        options.shouldInitialize,
        options.emitterListenerDisabled,
        options.storageEventListenerDisabled,
    ]); // Don't include `options` or the encoders, they may change on every render
    const [initialized, setInitialized] = react_1.default.useState(!!opts.shouldInitialize);
    const scopedStorageKey = react_1.default.useMemo(() => `${opts.prefix ? `${opts.prefix}${opts.prefixSeparator}` : ''}${key}`, [key, opts.prefix, opts.prefixSeparator]);
    const defaultValue = react_1.default.useMemo(() => defaultWhenUndefined, []); // Don't include defaultWhenUndefined, it may change on every render
    const getDecodedValue = react_1.default.useCallback(() => {
        let val = defaultValue;
        if (opts.shouldInitialize && typeof storage !== 'undefined' && opts.decode) {
            try {
                const storedRawVal = storage[scopedStorageKey];
                val = typeof storedRawVal === 'undefined' ? defaultValue : opts.decode(storedRawVal);
            }
            catch (e) {
                console.error('Error while decoding stored value for key:', scopedStorageKey, 'Error:', e, 'Value was:', storage[scopedStorageKey], 'This value could not be decoded properly. Try 1) checking the value, 2) checking your decoder, or 3) if using the default decoder (which uses JSON.parse), try specifying your own.');
            }
        }
        return val;
    }, [defaultValue, opts, scopedStorageKey, storage]);
    const [state, setState] = react_1.default.useState(getDecodedValue());
    // If the scope, key, storage, or options, change, decode and set the value, and set it as initialized.
    react_1.default.useEffect(() => {
        if (opts.shouldInitialize) {
            setState(getDecodedValue());
            setInitialized(true);
        }
        else {
            // When there's no scope, set as not initialized
            setState(defaultValue);
            setInitialized(false);
        }
    }, [getDecodedValue, opts.shouldInitialize, defaultValue, scopedStorageKey]);
    // Sync with all hook instances through an emitter
    react_1.default.useEffect(() => {
        const subs = new react_sub_unsub_1.Subs();
        if (!opts.emitterListenerDisabled) {
            const changeEventListener = (changedKey) => {
                if (scopedStorageKey === changedKey) {
                    try {
                        setState(getDecodedValue());
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            };
            subs.subscribeEvent(exports.storageEventEmitter, exports.EMITTER_CHANGE_EVENT_NAME, changeEventListener);
        }
        return subs.createCleanup();
    }, [getDecodedValue, opts.emitterListenerDisabled, scopedStorageKey]);
    // Sync with other open browser tabs via Window Storage Events
    // See: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
    react_1.default.useEffect(() => {
        const subs = new react_sub_unsub_1.Subs();
        if (!opts.storageEventListenerDisabled) {
            const storageEventListener = (e) => {
                if (e.storageArea === storage) {
                    const changedKey = e.key;
                    if (scopedStorageKey === changedKey) {
                        try {
                            setState(getDecodedValue());
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
            };
            subs.subscribeDOMEvent(window, 'storage', storageEventListener);
        }
        return subs.createCleanup();
    }, [getDecodedValue, opts.storageEventListenerDisabled, scopedStorageKey, storage]);
    const setStateCombined = react_1.default.useCallback((value) => {
        if (opts.shouldInitialize) {
            try {
                if (opts.encode && opts.decode && typeof value !== 'undefined') {
                    const encoded = opts.encode(value);
                    try {
                        // Ensure we can decode it, too
                        opts.decode(encoded);
                        setState(value);
                        storage[scopedStorageKey] = encoded;
                        exports.storageEventEmitter.emit(exports.EMITTER_CHANGE_EVENT_NAME, scopedStorageKey);
                    }
                    catch (e) {
                        console.error('Error while testing decoding during set operation:', scopedStorageKey, 'Error:', e, 'Value was:', value, 'Could not decode after encoded as:', encoded, 'This value could not be decoded properly. Try 1) checking the value, 2) checking your decoder, or 3) if using the default decoder (which uses JSON.parse), try specifying your own.');
                    }
                }
                if (typeof value === 'undefined') {
                    setState(null);
                    delete storage[scopedStorageKey];
                    exports.storageEventEmitter.emit(exports.EMITTER_CHANGE_EVENT_NAME, scopedStorageKey);
                }
            }
            catch (e) {
                console.error('Error while encoding:', scopedStorageKey, 'Error:', e, 'Bad value was:', value, 'This value could not be encoded properly. Try 1) checking the value as you may have provided a value that the encoder could not convert to a string, 2) checking your encoder, or 3) if using the default encoder (which uses JSON.stringify), try specifying your own.');
            }
        }
    }, [opts, scopedStorageKey, storage]);
    const clear = react_1.default.useCallback(() => {
        setStateCombined(undefined);
    }, [setStateCombined]);
    return [state, setStateCombined, initialized, clear, scopedStorageKey];
}
exports.useBrowserStorage = useBrowserStorage;
function defaultEncode(value) {
    return value !== null && typeof value !== 'undefined' ? JSON.stringify(value) : null;
}
exports.defaultEncode = defaultEncode;
function defaultDecode(itemString) {
    return itemString !== null && typeof itemString !== 'undefined' ? JSON.parse(itemString) : null;
}
exports.defaultDecode = defaultDecode;
exports.EMITTER_CHANGE_EVENT_NAME = 'change';
exports.storageEventEmitter = new events_1.default();
exports.storageEventEmitter.setMaxListeners(100);
