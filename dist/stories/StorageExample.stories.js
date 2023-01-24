"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorage = exports.LocalStorage = void 0;
/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
const react_1 = __importDefault(require("react"));
const StorageExample_1 = require("../components/StorageExample");
const useLocalStorage_1 = require("../hooks/useLocalStorage");
const useSessionStorage_1 = require("../hooks/useSessionStorage");
exports.default = {
    title: 'Stories/Web Storage',
    component: StorageExample_1.LocalStorageExample,
};
const Template = (args) => react_1.default.createElement(StorageExample_1.LocalStorageExample, Object.assign({}, args));
exports.LocalStorage = Template.bind({});
exports.LocalStorage.args = {
    useStorage: useLocalStorage_1.useLocalStorage,
};
exports.SessionStorage = Template.bind({});
exports.SessionStorage.args = {
    useStorage: useSessionStorage_1.useSessionStorage,
};
