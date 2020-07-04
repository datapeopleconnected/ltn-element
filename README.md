<p align="center">
  <img width="200" src="https://www.wearelighten.co.uk/wp-content/uploads/2016/06/L-Logo-GREY-1.png"></img>
</p>

## ltn-element
[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

## Objective
To build a lightweight loosely coupled, highly cohesive Typescript application framework.

It will provide a minimal set of services to allow developers to easily assemble `lit-element`-based applications.

## Repo
The main files of interest are:
- src/LtnElement.ts
- src/LtnTrader.ts
- src/LtnLogger.ts
- src/LtnTestTs.ts

Others are included (and will be extended) by way of example.

## Philosophy
Javascript applications are complex, and managing that complexity is increasingly burdensome. We aim to ease that burden by making it easier for applications to compose functional structures, providing scoped services via a naturally intuitive, but thoughtful way.

## Approach
The DOM is a hierarchical data structure, we exploit that structure to provide a mechanism for ltn-elements to access composed sets of services scoped against the DOM hierarchy. `_queryService` and `_getService` are the cornerstones of the approach.

## In Practice

### Scope
There are two primary Compositional scopes `AGGREGATE` and `COMPOSITE`. `ROOT` is a special case for identifying the root node of the application. Scope is applied exclusivey in `_queryService`. 


### Query Service

LtnElement provides a very few methods to inherited classes, however `_queryService(Type, scope)` is major one. 

`_queryService(Type)` is scoped to child nodes and is supported by `_getService(Type)` which similarly provides access to services through parent nodes via Traders (see next section).

Take this simplified DOM structure by way of example:

```html
<ltn-app scope="ROOT">
  <!-- SERVICES -->
  <ltn-trader scope="AGGREGATE"></ltn-trader>
  <ltn-auth></ltn-auth>
  <ltn-db></ltn-db>
  <ltn-time></ltn-time>
  <!-- USER INTERFACE -->
  <page-manager>
    <page-1 scope="COMPOSITE">
      <page-el></page-el>
    </page-1>
    <page-2 scope="COMPOSITE">
      <page-el></page-el>
    </page-2>
  </page-manager>
</ltn-app>
```

Web components often take this form, with a combination of service and visual elements.

In the above example `ltn-app` is scoped as the `ROOT` element. `ltn-trader` is `AGGREGATE`d onto `ltn-app`. The other elements all have scope `CHILD`.

The `AGGREGATE` scope is important because when using `_queryService` this is the default scope. If no scope is provided in the tag declaration, the scope is set to `CHILD`. 

`_queryService(Type, scope=AGGREGATE)` is key because any LtnElement can be queried to determine if a particular service has been published. The application programmer has an easy to grok way of both publishing (composing) and consuming services.

```js
// LtnApp
function connectedCallback() {
  ...
  const trader: LtnTrader = this._queryService(LtnTrader);
  trader?.registerService(LtnDb, 'db');
  trader?.registerService(LtnTime, 'time');
  ...
}

// Page1
function connectedCallback() {
  ...
  this._db = this._getService
}
```

In this example as the App is connected into the DOM it 'queries' for the Trader and uses it to register some services that it wants to make available globally. More on Traders later.

This query uses a deep child search to find 'LtnTrader' with scope `AGGREGATE`. The first match is returned. So regardless of where the ltn-trader was included in the component's structure, as long as it has the correct scope, it will be found.

Crucially 'queries' can return `null` if no matching service can be found.

### Get Service
Where `_queryService` searches child nodes of a LtnElement, `_getService` searches toward the root node using Traders.

In fact `_getService(Type)` is simply a helper function that finds the nearest trader and calls its `_getService`.

Using the previous simplified DOM structure:
```html
<ltn-app scope="ROOT">
  <!-- SERVICES -->
  <ltn-trader scope="AGGREGATE"></ltn-trader>
  <ltn-auth></ltn-auth>
  <ltn-db></ltn-db>
  <ltn-time></ltn-time>
  <!-- USER INTERFACE -->
  <page-manager>
    <page-1 scope="COMPOSITE">
      <page-el></page-el>
    </page-1>
    <page-2 scope="COMPOSITE">
      <page-el></page-el>
    </page-2>
  </page-manager>
</ltn-app>
```

```js
// Page1
function connectedCallback() {
  ...
  this._db = this._getService(LtnDb);
}
```


Traders provide a little more fine control for publishing services through child nodes, allowing the application programmers to create Nodes that bring together services that aren't necessarily part of the same local DOM hierarchy. 

Traders can also be placed arbitrarily in the DOM hierarchy and behave as would be expected; the first trader found through the parent chain is queried successively until the requested service is found or no further traders exist.
