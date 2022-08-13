# be-hive

[![Playwright Tests](https://github.com/bahrus/be-hive/actions/workflows/CI.yml/badge.svg)](https://github.com/bahrus/be-hive/actions/workflows/CI.yml)

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-hive?style=for-the-badge)](https://bundlephobia.com/result?p=be-hive)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-hive?compression=gzip">

## Inheriting behiviors

[be-hive](https://www.youtube.com/watch?v=SQoOwosJWns) let's it [snow in August](https://www.youtube.com/watch?v=m3dmnOtqrV0).

be-hive allows us to manage and coordinate the [family, or HTML frimework](https://github.com/bahrus/may-it-be) of [be-decorated](https://github.com/bahrus/be-decorated) element behiviors / decorators.  

Without be-hive, the developer is burdened with plopping an instance of each decorator inside each shadow DOM realm.

With the help of the be-hive component, the developer only has to plop a single instance of be-hive inside the Shadow DOM realm, like so:

```html
<be-hive></be-hive>
```

This signals that the Shadow DOM realm is opting-in, and allowing element behiviors, and will inherit all the behiviors from the parent Shadow DOM realm, by default.

But the child Shadow DOM realm can develop a personality of its own by:

1.  Adding additional behiviors by adding specific be-decorated elements inside the be-hive instance tag.
2.  Avoiding naming conflicts by overriding the attribute associated with the inherited behivior.
3.  Preventing inheriting unwanted behaviors from affecting the child Shadow DOM realm [TODO].
4.  Start over.  [TODO].  Only decorator elements manually added inside the Shadow DOM (preferably inside the be-hive tag, for inheritance to work within)

## Syntax for customizations of inherited behiviors:

```html
<be-hive overrides='{
    "be-sharing":{
        "ifWantsToBe": "familial"
    },
    "be-gracious": {
        "ifWantsToBe": "respectful"
    },
    "be-disobedient-without-facing-the-consequences": {
        "notAllowed": "true" //TODO
    }
}'></be-hive>
```

## Starting over [TODO]

```html
<be-hive be-sirius-black>
</be-hive>
```


## API


be-hiviors are registered via function:

```Typescript
register(ifWantsToBe: string, upgrade: string, extTagName: string);
```

in be-hive/register.js


be-hive then determines which be-hiviors to inherit.


