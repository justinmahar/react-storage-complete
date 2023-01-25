<h2 align="center">
  🗄️ React Storage Complete
</h2>
<h3 align="center">
  React hooks for accessing localStorage and sessionStorage, with syncing and prefix support. The complete package.
</h3>
<p align="center">
  <a href="https://badge.fury.io/js/react-storage-complete" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/react-storage-complete.svg" alt="npm Version" /></a>&nbsp;
  <a href="https://github.com/justinmahar/react-storage-complete/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" /></a>&nbsp;
  <a href="https://github.com/justinmahar/react-storage-complete/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer"><img src="https://github.com/justinmahar/react-storage-complete/workflows/Deploy/badge.svg" alt="Deploy Status" /></a>&nbsp;
  <a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>
</p>

## Documentation

Read the **[official documentation](https://justinmahar.github.io/react-storage-complete/)**.

[**👁️ Live Demo**](https://justinmahar.github.io/react-storage-complete/?path=/story/stories-web-storage--local-storage)

## Overview

Hooks for easily accessing `localStorage` and `sessionStorage`, with a similar interface to `React.useState()`.

### Features include:

- **🔄 Automatic state synchronization**
  - Changes are synchronized across hooks, and even different browser tabs, automatically.
- **👨‍👩‍👧‍👦 Namespacing using prefixes**
  - Easily scope your stored data with namespaces. Great for managing data for multiple users.
- **🔢 Support for primitives and objects**
  - Store and retrieve strings, booleans, numbers, and objects effortlessly.
- **👾 Customizable**
  - Want to store something unusual? Just provide your own encoder and decoder.
- **💁 Default values**
  - Optional support for defaults is baked right in.

[lock:donate]::🚫---------------------------------------

## Donate 

I hope this project makes your life a little easier! If it does and you'd like to show your appreciation, consider supporting the project with a coffee or sponsorship. 

Your support helps keep the project going and will earn you some serious virtual high fives. Maybe even a virtual fist bump if you're feeling extra cool.

<a href="https://github.com/sponsors/justinmahar">
  <img src="https://justinmahar.github.io/react-kindling/support/sponsor.png" alt="Sponsor via GitHub" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/5">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-1.png" alt="Buy me a coffee" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/15">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-3.png" alt="Buy me 3 coffees" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/25">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-5.png" alt="Buy me 5 coffees" height="35" />
</a>

[/lock:donate]::---------------------------------------🚫

## Table of Contents 

- [Documentation](#documentation)
- [Overview](#overview)
  - [Features include:](#features-include)
- [Donate](#donate)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Quick Start](#quick-start)
    - [Basic Usage](#basic-usage)
    - [Providing A Default Value](#providing-a-default-value)
    - [Namespacing Using Prefix](#namespacing-using-prefix)
      - [Namespacing Using User IDs](#namespacing-using-user-ids)
    - [Clearing The Value](#clearing-the-value)
    - [Accessing The Prefixed Key](#accessing-the-prefixed-key)
    - [Additional Options \& Uses](#additional-options--uses)
- [TypeScript](#typescript)
- [Icon Attribution](#icon-attribution)
- [Contributing](#contributing)
- [⭐ Found It Helpful? Star It!](#-found-it-helpful-star-it)
- [License](#license)

## Installation

```
npm i react-storage-complete
```

## Quick Start

| Use this hook...                                                                                                     | For this Storage API...                                                                    | Storage Description                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [useLocalStorage](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--page)     | [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)     | The `localStorage` object stores data with no expiration date. The data is not deleted when the browser is closed, and is available for future sessions. |
| [useSessionStorage](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-usesessionstorage--page) | [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) | The `sessionStorage` object stores data for only one session. The data is deleted when the browser is closed.                                            |

#### Basic Usage

```jsx
import { useLocalStorage } from 'react-storage-complete';
import { useSessionStorage } from 'react-storage-complete';
```

> Both `useLocalStorage` and `useSessionStorage` share the same interface and are interchangeable.

In your component or hook:

```jsx
const [name, setName] = useLocalStorage('name');
```

This will store and retrieve the value using the `name` key in `localStorage`. 

> Note: If using TypeScript, you can provide a value type like so: `useLocalStorage<string>('name')`.

#### Providing A Default Value

You can also provide a default value for when the stored value is `undefined` (not currently set in `localStorage`):

```jsx
const [name, setName] = useLocalStorage('name', 'Guest');
```

In this example, when the stored item with the key `name` is `undefined`, the `name` value will be `Guest`. 

> Note: When a value is `null` in storage, `null` is returned, not the provided default.

#### Namespacing Using Prefix

You can namespace stored items using a prefix:

```jsx
const [name, setName] = useLocalStorage('name', 'Guest', {
  prefix: 'my-namespace',
});
```

For example, by using a user ID as the prefix, you can scope the stored data to the user and avoid mixing settings.

Above, the key for the value would be `my-namespace.name`.

##### Namespacing Using User IDs

With `react-storage-complete`, managing stored data for multiple user accounts in the same browser is easy.

```jsx
const [name, setName, initialized] = useLocalStorage('name', 'Guest', {
  prefix: user?.id, // Undefined until user ID is available as a namespace
  shouldInitialize: !!user?.id, // Only initialize when user ID is available
});
```

As shown above, you can delay initialization of the stored value until your prefix is available and ready to use as the namespace. 

For example, a user ID may not be ready until logged in, but you may still be calling the hook in your app before that happens.

In this example:
- `initialized` will be `false` until the `user.id` is loaded and ready to use as the prefix.
- When `shouldInitialize` is `true`, the prefix is used with the key to retrieve the stored value from `localStorage`. 
- Then, `initialized` will return as `true`, and your value will be ready to use!

#### Clearing The Value

```jsx
const [name, setName, initialized, clear] = useLocalStorage('name', 'Guest', {
  prefix: 'my-namespace',
});
```

You can clear any stored value and completely remove it from storage using the returned clear function. 

In this example, calling `clear()` will delete the item from storage. You can also call `setName(undefined)` to achieve the same result.

#### Accessing The Prefixed Key

```jsx
const [food, setFood, initialized, clear, prefixedKey] = useLocalStorage('food', 'Hamburger', {
  prefix: 'my-namespace',
});
```

The hook also returns the prefixed key, in case you want direct access to it. 

In the example above, the prefixed key would be `my-namespace.food`. 

> You can customize the separator by providing the `prefixSeparator` option.

#### Additional Options & Uses

See the documentation for additional options and uses:

- [useLocalStorage documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--page)
- [useSessionStorage documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-usesessionstorage--page)

[lock:typescript]::🚫---------------------------------------

## TypeScript

Type definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.

[/lock:typescript]::---------------------------------------🚫

[lock:icon]::🚫---------------------------------------

## Icon Attribution

Favicon by [Twemoji](https://github.com/twitter/twemoji).

[/lock:icon]::---------------------------------------🚫

[lock:contributing]::🚫---------------------------------------

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

[/lock:contributing]::---------------------------------------🚫

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/react-storage-complete/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/react-storage-complete/stargazers): [👉⭐](https://github.com/justinmahar/react-storage-complete/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/react-storage-complete/?path=/story/license--page).