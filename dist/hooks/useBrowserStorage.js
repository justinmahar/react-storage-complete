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
    emitterDisabled: false,
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
        options.emitterDisabled,
        options.storageEventListenerDisabled,
    ]); // Don't include `options` or the encoders, they may change on every render
    const [initialized, setInitialized] = react_1.default.useState(!!opts.shouldInitialize);
    const hookUuid = react_1.default.useRef(uuid());
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
    // If the scope, key, storage, or opts.shouldInitialize change, decode and set the value, and set it as initialized.
    react_1.default.useEffect(() => {
        const currentEncodedState = state && opts.encode ? opts.encode(state) : undefined;
        if (opts.shouldInitialize) {
            const newEncodedValue = storage[scopedStorageKey];
            if (currentEncodedState !== newEncodedValue) {
                setState(getDecodedValue());
            }
            setInitialized(true);
        }
        else {
            const newEncodedValue = defaultValue && opts.encode ? opts.encode(defaultValue) : undefined;
            if (currentEncodedState !== newEncodedValue) {
                setState(defaultValue);
            }
            // When there's no scope, set as not initialized
            setInitialized(false);
        }
    }, [getDecodedValue, opts.shouldInitialize, defaultValue, scopedStorageKey]);
    // Sync with all hook instances through an emitter
    react_1.default.useEffect(() => {
        const subs = new react_sub_unsub_1.Subs();
        if (!opts.emitterDisabled) {
            const changeEventListener = (changedKey, storageArea, sourceUuid) => {
                if (scopedStorageKey === changedKey && storage === storageArea && hookUuid.current !== sourceUuid) {
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
    }, [getDecodedValue, opts.emitterDisabled, storage, scopedStorageKey]);
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
                    const encodedState = state ? opts.encode(state) : undefined;
                    const encodedValue = opts.encode(value);
                    // Only set the state if the encoded value is different.
                    if (encodedState !== encodedValue) {
                        try {
                            // Ensure we can decode it, too
                            opts.decode(encodedValue);
                            setState(value);
                            storage[scopedStorageKey] = encodedValue;
                            if (!opts.emitterDisabled) {
                                exports.storageEventEmitter.emit(exports.EMITTER_CHANGE_EVENT_NAME, scopedStorageKey, storage, hookUuid.current);
                            }
                        }
                        catch (e) {
                            console.error('Error while testing decoding during set operation:', scopedStorageKey, 'Error:', e, 'Value was:', value, 'Could not decode after encoded as:', encodedValue, 'This value could not be decoded properly. Try 1) checking the value, 2) checking your decoder, or 3) if using the default decoder (which uses JSON.parse), try specifying your own.');
                        }
                    }
                }
                if (typeof value === 'undefined' && typeof state !== 'undefined') {
                    setState(defaultValue);
                    delete storage[scopedStorageKey];
                    if (!opts.emitterDisabled) {
                        exports.storageEventEmitter.emit(exports.EMITTER_CHANGE_EVENT_NAME, scopedStorageKey, storage, hookUuid.current);
                    }
                }
            }
            catch (e) {
                console.error('Error while encoding:', scopedStorageKey, 'Error:', e, 'Bad value was:', value, 'This value could not be encoded properly. Try 1) checking the value as you may have provided a value that the encoder could not convert to a string, 2) checking your encoder, or 3) if using the default encoder (which uses JSON.stringify), try specifying your own.');
            }
        }
    }, [opts, scopedStorageKey, state, storage]);
    const clear = react_1.default.useCallback(() => {
        setStateCombined(undefined);
    }, [setStateCombined]);
    return [state, setStateCombined, initialized, clear, scopedStorageKey];
}
exports.useBrowserStorage = useBrowserStorage;
function defaultEncode(value) {
    return value !== null ? JSON.stringify(value) : null;
}
exports.defaultEncode = defaultEncode;
function defaultDecode(itemString) {
    return itemString !== null ? JSON.parse(itemString) : null;
}
exports.defaultDecode = defaultDecode;
exports.EMITTER_CHANGE_EVENT_NAME = 'change';
exports.storageEventEmitter = new events_1.default();
exports.storageEventEmitter.setMaxListeners(100);
// Source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
const uuid = () => {
    let d = new Date().getTime(); //Timestamp
    let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};
