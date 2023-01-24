"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageExample = void 0;
require("bootstrap/dist/css/bootstrap.css");
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const useLocalStorage_1 = require("../hooks/useLocalStorage");
/**
 * This is the description for the LocalStorageExample component
 */
const LocalStorageExample = (_a) => {
    var _b, _c;
    var { useStorage } = _a, props = __rest(_a, ["useStorage"]);
    const [prefix, setPrefix] = react_1.default.useState('');
    const [prefixEnabled, setPrefixEnabled] = react_1.default.useState(false);
    const [prefixSeparator, setPrefixSeparator] = react_1.default.useState('.');
    const [shouldInitialize, setShouldInitialize] = react_1.default.useState(true);
    const [s, setS] = (0, useLocalStorage_1.useLocalStorage)('h');
    const storageOptions = react_1.default.useMemo(() => {
        const options = {};
        if (prefixEnabled) {
            options.prefix = prefix;
        }
        options.prefixSeparator = prefixSeparator;
        // options.storageEventListenerDisabled = true;
        // options.emitterListenerDisabled = true;
        options.shouldInitialize = shouldInitialize;
        return options;
    }, [prefix, prefixEnabled, prefixSeparator, shouldInitialize]);
    const [storedString, setStoredString, storedStringInitialized, clearStoredString, storedStringPrefixdStorageKey] = useStorage('stored-string', null, storageOptions);
    const [storedString2] = useStorage('stored-string', null, storageOptions);
    const [storedNumber, setStoredNumber, storedNumberInitialized, clearStoredNumber, storedNumberPrefixdStorageKey] = useStorage('stored-number', null, storageOptions);
    const [storedBoolean, setStoredBoolean, storedBooleanInitialized, clearStoredBoolean, storedBooleanPrefixdStorageKey,] = useStorage('stored-boolean', false, storageOptions);
    const [storedObject, setStoredObject, storedObjectInitialized, clearStoredObject, storedObjectPrefixdStorageKey] = useStorage('stored-object', {
        str: 'hi',
        num: 123,
        bool: true,
    }, storageOptions);
    const [storedAny, setStoredAny, storedAnyInitialized, clearStoredAny, storedAnyPrefixdStorageKey] = useStorage('stored-any', null, storageOptions);
    return (react_1.default.createElement("div", { className: "d-flex flex-column gap-1" },
        react_1.default.createElement(react_bootstrap_1.Card, null,
            react_1.default.createElement(react_bootstrap_1.Card.Header, null,
                react_1.default.createElement(react_bootstrap_1.Form.Check, { inline: true, label: "Use Prefix", id: "prefix-checkbox", checked: prefixEnabled, onChange: (e) => setPrefixEnabled(e.target.checked) })),
            react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "d-flex flex-column gap-1" },
                react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "prefix-group" },
                    react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Enter a prefix", value: prefix, onChange: (e) => setPrefix(e.target.value) })),
                react_1.default.createElement("div", { className: "d-flex flex-wrap gap-1" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => {
                            setPrefix('abc-123-hank');
                            setPrefixEnabled(true);
                        } }, "Hank's Account"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => {
                            setPrefix('def-456-frank');
                            setPrefixEnabled(true);
                        } }, "Frank's Account"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => {
                            setPrefix('xyz-987-tony');
                            setPrefixEnabled(true);
                        } }, "Tony's Account"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => {
                            setPrefix('');
                            setPrefixEnabled(true);
                        } }, "Empty Prefix")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(react_bootstrap_1.Form.Label, null, "Prefix Separator"),
                    react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Prefix key separator", value: prefixSeparator, onChange: (e) => setPrefixSeparator(e.target.value) }),
                    react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                        "This separates the prefix from the key. For example, if the separator is ",
                        react_1.default.createElement("code", null, "."),
                        ", the prefixd key is ",
                        react_1.default.createElement("code", null, "user-id.keyname"),
                        ".")))),
        react_1.default.createElement(react_bootstrap_1.ListGroup, null,
            react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { className: "bg-light" },
                react_1.default.createElement("div", { className: "d-flex flex-column" },
                    react_1.default.createElement(react_bootstrap_1.Form.Check, { inline: true, label: "Should Initialize", id: "should-init-checkbox", checked: shouldInitialize, onChange: (e) => setShouldInitialize(e.target.checked) }),
                    react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "This is useful when your prefix string must be loaded after rendering. For example, you can postpone initializing local storage values until a user is logged in and their ID is available to use as the prefix.")))),
        react_1.default.createElement("div", null,
            !storedStringInitialized && (react_1.default.createElement("div", null,
                react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", role: "status", size: "sm" }),
                " Waiting to be initialized")),
            storedStringInitialized && (react_1.default.createElement(react_bootstrap_1.Card, null,
                react_1.default.createElement(react_bootstrap_1.Card.Header, null, "Stored Values"),
                react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "d-flex flex-column gap-2" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement("h6", { className: "mb-0" }, "Stored String"),
                            ' ',
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: "primary font-monospace" },
                                "Key: ",
                                storedStringPrefixdStorageKey)),
                        react_1.default.createElement("div", { className: "d-flex gap-1" },
                            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Stored string type", value: storedString !== null && storedString !== void 0 ? storedString : '', onChange: (e) => setStoredString(e.target.value) }),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => clearStoredString() }, "Clear/Reset")),
                        react_1.default.createElement("div", { className: "d-flex flex-column gap-1" },
                            react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                                "Value: ",
                                storedString),
                            react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                                "Second hook value (shows syncing): ",
                                storedString2))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement("h6", { className: "mb-0" }, "Stored Number"),
                            ' ',
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: "primary font-monospace" },
                                "Key: ",
                                storedNumberPrefixdStorageKey)),
                        react_1.default.createElement("div", { className: "d-flex gap-1" },
                            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", placeholder: "Stored number type", value: storedNumber !== null && storedNumber !== void 0 ? storedNumber : '', onChange: (e) => setStoredNumber(Number.parseInt(e.target.value)) }),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => clearStoredNumber() }, "Clear/Reset")),
                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                            "Value: ",
                            storedNumber)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement("h6", { className: "mb-0" }, "Stored Boolean"),
                            ' ',
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: "primary font-monospace" },
                                "Key: ",
                                storedBooleanPrefixdStorageKey)),
                        react_1.default.createElement("div", { className: "d-flex gap-1" },
                            react_1.default.createElement(react_bootstrap_1.Form.Check, { label: "Stored boolean type", id: "stored-bool-id", checked: !!storedBoolean, onChange: (e) => setStoredBoolean(e.target.checked) }),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => clearStoredBoolean() }, "Clear/Reset")),
                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                            "Value: ",
                            `${storedBoolean}`)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement("h6", { className: "mb-0" }, "Stored Object"),
                            ' ',
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: "primary font-monospace" },
                                "Key: ",
                                storedObjectPrefixdStorageKey)),
                        react_1.default.createElement("div", { className: "d-flex gap-1" },
                            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "object.str string value", value: (_b = storedObject === null || storedObject === void 0 ? void 0 : storedObject.str) !== null && _b !== void 0 ? _b : '', onChange: (e) => setStoredObject(Object.assign(Object.assign({}, storedObject), { str: e.target.value })) }),
                            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "number", placeholder: "object.num number value", value: (_c = storedObject === null || storedObject === void 0 ? void 0 : storedObject.num) !== null && _c !== void 0 ? _c : '', onChange: (e) => setStoredObject(Object.assign(Object.assign({}, storedObject), { num: Number.parseInt(e.target.value) })) }),
                            react_1.default.createElement(react_bootstrap_1.Form.Check, { label: "object.bool value", id: "stored-object-bool-id", checked: !!(storedObject === null || storedObject === void 0 ? void 0 : storedObject.bool), onChange: (e) => setStoredObject(Object.assign(Object.assign({}, storedObject), { bool: e.target.checked })) }),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => clearStoredBoolean() }, "Clear/Reset")),
                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                            "Value: ",
                            JSON.stringify(storedObject))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "d-flex align-items-center gap-2" },
                            react_1.default.createElement("h6", { className: "mb-0" }, "Stored Any"),
                            ' ',
                            react_1.default.createElement(react_bootstrap_1.Badge, { bg: "primary font-monospace" },
                                "Key: ",
                                storedAnyPrefixdStorageKey)),
                        react_1.default.createElement("div", { className: "d-flex gap-1" },
                            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Stored any type", value: storedAny !== null && storedAny !== void 0 ? storedAny : '', onChange: (e) => setStoredAny(e.target.value) }),
                            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => clearStoredAny() }, "Clear/Reset")),
                        react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" },
                            "Value: ",
                            storedAny))))))));
};
exports.LocalStorageExample = LocalStorageExample;
