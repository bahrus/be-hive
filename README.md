# be-hive

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/be-hive)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-hive?style=for-the-badge)](https://bundlephobia.com/result?p=be-hive)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-hive?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-hive.png)](http://badge.fury.io/js/be-hive)

## Overview

[be-hive](https://www.youtube.com/watch?v=SQoOwosJWns) lets it [snow in August](https://www.youtube.com/watch?v=m3dmnOtqrV0).

be-hive is the coordination layer for the [family of HTML enhancements](https://github.com/bahrus/may-it-be) that follow the "be-enhanced" pattern. It extends the [mount-observer](https://github.com/nicknisi/mount-observer) `Synthesizer` class, providing a declarative custom element (`<be-hive>`) for registering and managing element enhancements within Shadow DOM scopes.

In the modern architecture, `be-hive` serves as:

1. A **custom element** (`<be-hive>`) that acts as a registry point inside a Shadow DOM realm
2. A **host for EMC (Enhancement Mount Configuration) scripts** that declare which enhancements are active
3. A **parser host** for registering attribute parsers used by enhancements
4. A **utility provider** (e.g. `findAdjacentElement`) for enhancement implementations

## How It Works

The `BeHive` class extends `Synthesizer` from `mount-observer`:

```TypeScript
import {Synthesizer} from 'mount-observer/Synthesizer.js';

export class BeHive extends Synthesizer{}

customElements.define('be-hive', BeHive);
```

When placed inside a Shadow DOM realm, `<be-hive>` processes its child `<script>` elements to configure which enhancements are active in that scope.

## Registering Enhancements

Enhancements are registered declaratively using `<script type=emc>` tags inside `<be-hive>`:

```html
<be-hive>
    <script type=emc src="be-clonable/emc.json"></script>
    <script type=emc src="be-committed/emc.json"></script>
</be-hive>
<script type=module>
    import 'be-hive/be-hive.js';
</script>
```

Each `<script type=emc>` points to a JSON configuration file (generated from an `emc.mjs` build script) that tells `be-hive` how to observe, parse, and spawn the enhancement.

## The EMC (Enhancement Mount Configuration)

Each enhancement project provides an EMC that defines:

- **enhKey**: The unique identifier / attribute name for the enhancement
- **spawn**: The module path to lazily import the enhancement class
- **withAttrs**: How to map HTML attributes to enhancement properties

Example `emc.mjs`:

```javascript
export const emc = {
    enhConfig: {
        enhKey: 'BeClonable',
        spawn: 'be-clonable/be-clonable.js',
        withAttrs: {
            base: 'be-clonable',
            triggerInsertPosition: '${base}-trigger-insert-position',
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        actions: {
            addCloneBtn: { ifAllOf: ['triggerInsertPosition', 'enhancedElement'] }
        },
        defaultPropVals: {
            triggerInsertPosition: 'beforebegin'
        }
    }
};

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());
```

Running `node emc.mjs > emc.json` generates the static JSON configuration that `<be-hive>` loads at runtime.

## Custom Parsers

For enhancements with complex attribute syntax, be-hive provides built-in parser wrappers that integrate with the [nested-regex-groups](https://github.com/bahrus/nested-regex-groups) library:

- `be-hive/parsers/parse-pattern-statements.js` — for nested object structures using dot notation in capture groups
- `be-hive/parsers/parse-grouped-capture-statements.js` — for flat objects parsed from multiple statements

Register parsers in HTML before loading EMC scripts that depend on them:

```html
<be-hive>
    <script type=emc-parser 
            src="be-hive/parsers/parse-pattern-statements.js" 
            parser-name=parse-pattern-statements></script>
    <script type=emc 
            src="do-invoke/emc.json" 
            wait-for-parsers=parse-pattern-statements></script>
</be-hive>
<script type=module>
    import 'be-hive/be-hive.js';
</script>
```

## Emoji Shorthand

Many enhancements support both a full name and an emoji shorthand (e.g. `be-clonable` / `⿻`). A separate `.mjs` file generates a variant JSON that overrides the `enhKey` and `base` attribute:

```html
<!-- Full name -->
<div be-clonable>...</div>

<!-- Emoji shorthand -->
<div ⿻>...</div>
```

Both resolve to the same enhancement class; only the observed attribute name differs.

## Utilities

be-hive also provides utilities used by enhancement implementations:

### findAdjacentElement

Finds an element adjacent to a given element based on an `InsertPosition` and CSS selector:

```javascript
import {findAdjacentElement} from 'be-hive/findAdjacentElement.js';

const trigger = findAdjacentElement('beforebegin', element, '.my-trigger');
```

## Exports

| Path | Description |
|------|-------------|
| `be-hive/be-hive.js` | The `BeHive` custom element (extends Synthesizer) |
| `be-hive/findAdjacentElement.js` | Adjacent element lookup utility |
| `be-hive/parsers/parse-pattern-statements.js` | Parser for nested object structures |
| `be-hive/parsers/parse-grouped-capture-statements.js` | Parser for flat object structures |

## Dependencies

- [mount-observer](https://github.com/nicknisi/mount-observer) — Provides the `Synthesizer` base class and the `MountObserver` infrastructure for watching DOM mutations and spawning enhancements
- [nested-regex-groups](https://github.com/bahrus/nested-regex-groups) — Regex-based attribute parsing library used by the built-in parsers

## Related Projects

Key packages in the enhancement ecosystem:

- [mount-observer](https://github.com/nicknisi/mount-observer) — Core observation engine
- [roundabout-lib](https://github.com/bahrus/roundabout-lib) — Reactive property management for enhancements
- [assign-gingerly](https://github.com/bahrus/assign-gingerly) — Safe property assignment and enhancement gateway
- [inferencer](https://github.com/bahrus/inferencer) — Element property/event inference
- [nested-regex-groups](https://github.com/bahrus/nested-regex-groups) — Attribute value parsing

Example enhancements built on this architecture:

- [be-clonable](https://github.com/bahrus/be-clonable) — Reference implementation
- [do-invoke](https://github.com/bahrus/do-invoke) — Custom parser reference
- [be-committed](https://github.com/bahrus/be-committed)
- [be-bound](https://github.com/bahrus/be-bound) — Two-way data binding

## Viewing Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. `> git submodule update --init --recursive`
6. `> npm install`
7. `> npm run serve` (requires a static file server with SSI support)
8. Open http://localhost:8000/demo/ in a modern browser (Chrome 146+ recommended for JSON import assertions)
