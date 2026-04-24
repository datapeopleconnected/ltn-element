# \<ltn-element>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## What this library is for

`ltn-element` is a Lit-based utility library for building custom elements that can:

- organize component trees with explicit scopes (`ROOT`, `AGGREGATE`, `COMPOSITE`, `CHILD`),
- discover and share services across parent/child and shadow DOM boundaries,
- communicate through lightweight event subscription/dispatch patterns,
- and use consistent leveled logging for diagnostics.

The package exposes four main building blocks:

- `LtnElement`: base class that adds scope, root discovery, and service lookup helpers on top of `LitElement`.
- `LtnTrader`: hidden service registry/locator element used to register and resolve services by type (and optional name).
- `LtnService`: service-oriented base class with subscribe/unsubscribe and custom event dispatch helpers.
- `LtnLogger`: logger with `ERROR`, `WARN`, `INFO`, `DEBUG`, and `SYS` levels.

In short, this library provides infrastructure for larger Lit component systems where components need structured composition, shared services, and observable behavior.

## Installation

```bash
npm i ltn-element
```

## Usage

```html
<script type="module">
  import 'ltn-element/ltn-element.js';
</script>

<ltn-element></ltn-element>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
