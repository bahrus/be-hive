# be-hive

[![Playwright Tests](https://github.com/bahrus/be-hive/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-hive/actions/workflows/CI.yml)

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-hive?style=for-the-badge)](https://bundlephobia.com/result?p=be-hive)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-hive?compression=gzip">

## Let it snow in August

be-hive is the Queen Bee of the [may-it-be](https://github.com/bahrus/may-it-be) HTML frimework.

Specify that ShadowDOM should inherit [be-decorated-based](https://github.com/bahrus/be-decorated) be-hiviors from the parent Shadow DOM (or outside any Shadow DOM).

To activate all the be-decorated beviviors, plop an instance of be-hive inside the Shadow DOM:

```html
<be-hive></be-hive>
```

Allow judicious overriding of if-wants-to-be's.

## Syntax


be-hiviors are registered via function:

```Typescript
register(ifWantsToBe: string, upgrade: string, extTagName: string);
```

in be-hive/register.js


be-hive then determines which be-hiviors to inherit.


However, be-hive supports an optional "overrides" attribute/property that allows overriding the parent inheritance.

To uses be-hiviors in this way, we need to include one instance of be-hive in our ShadowDOM-based web component.

```html
<be-hive overrides='{
    "be-sharing":{
        "ifWantsToBe": "familial"
    }
}'></be-hive>
```

[TODO]  Expline this coherently.
