# be-hive [WIP]

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/be-hive)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-hive?style=for-the-badge)](https://bundlephobia.com/result?p=be-hive)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-hive?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-hive.png)](http://badge.fury.io/js/be-hive)

## Inheriting behiviors

[be-hive](https://www.youtube.com/watch?v=SQoOwosJWns) lets it [snow in August](https://www.youtube.com/watch?v=m3dmnOtqrV0).

be-hive allows us to manage and coordinate the [family, or HTML frimework](https://github.com/bahrus/may-it-be) of [be-enhanced](https://github.com/bahrus/be-enhanced) custom enhancements.  

Without be-hive, the developer is burdened with plopping an instance of each enhancement inside each shadow DOM realm.

With the help of the be-hive component, the developer only has to plop a single instance of be-hive inside the Shadow DOM realm, like so:

```html
<be-hive></be-hive>
```

This signals that the Shadow DOM realm is opting-in, and allowing element behiviors, and will inherit all the behiviors from the parent Shadow DOM realm, by default.

But the child Shadow DOM realm can develop a personality of its own by:

1.  Adding additional behiviors by adding specific be-decorated elements inside the be-hive instance tag.
2.  Avoiding naming conflicts by overriding the attribute associated with the inherited behivior.
3.  Preventing inheriting unwanted behiviors from affecting the child Shadow DOM realm.
4.  Start over.  Only decorator elements manually added inside the Shadow DOM (preferably inside the be-hive tag, for inheritance to work within)

## Syntax for customizations of inherited behiviors [TODO]

```html
<be-hive overrides='{
    "be-sharing":{
        "becomes": "be-familial"
    },
    "be-gracious": {
        "becomes": "be-respectful"
    },
    "be-disobedient-without-facing-the-consequences": {
        "block": "true"
    }
}'></be-hive>
```



## Be like Sirius Black

If the inherited behiviors are all just too odious to inherit, there's an option to start again:

```html
<be-hive be-severed>
</be-hive>
```

## Adding back a personality trait [Untested]

If one Shadow DOM blocks an inherited behivior, child Shadow DOMs can bring it back within their (and descendent) shadow DOM realms thusly:

```html
<be-hive overrides='{
    "be-disobedient-without-facing-the-consequences": {
        "unblock": "true"
    }
}'></be-hive>
```


## The "Emcee" script files

To make the ceremony of establishing DOM enhancements go as smoothly as possible, *be-hive* rests on a key object structure that should accompany each enhancement -- the  "EMC" object.  

EMC stands for "Enhancement Mount Configuration".

These objects are small, and most of it can be turned into a JSON import:

For example:

```TypeScript
export const emc: EMC = {
    base: 'be-based',
    map: {
        '0.0': 'base'
    },
    enhPropKey: 'beBased',
    importEnh: async () => {
        const {BeBased} = await import('./behance.js');
        return BeBased;
    }
};
```

This provides a kind of "entrance ticket" that can then be used to enhance an element programmatically:

```TypeScript
const beBasedEnhancement = await oDivElement.beEnhanced.whenResolved(emc);
```

It also contains all the needed information for how to parse the the behavior/enhancement attributes, into an object that can be passed in to the behavior/enhancement during template instantiation.

To see a more complex example along those lines, see [be-switched](https://github.com/bahrus/be-switched/blob/baseline/behivior.ts).



Potentially, an alternative EMC definition can be used inside different Shadow DOM roots in order to avoid clashes between two libraries that use the same names.

So we can synchronously load these small files (or a bundle of such small files), which would block being able to do template instantiation on a first load. but at least the files are as small (and as parsable) as possible.

The thinking is we can take a template filled with lots of inline behavior/enhancement attributes, where that template is going to be cloned repeatedly.  In order to avoid excessive string parsing, we can analyze the template:

If the EMC's "cache" setting is set to true, then it will look at the initial attribute settings, and see if it matches something that is already in the cache, and if so, do a (structural clone?) of the object without reparsing.  Maybe this should only be done if the root fragment isn't connected?

## Behivior aspects [WIP]

There may be some cases, especially for enhancements with many equally important parameters where a developer may prefer to break up the settings into separate attributes. [Here's an example](https://github.com/bahrus/be-intl) where I can definitely see the appeal.  So instead of:

```html
<time lang="ar-EG" datetime=2011-11-18T14:54:39.929Z be-intl='{ "weekday": "long", "year": "numeric", "month": "long", "day": "numeric" }'></time>
```

we can write:

```html
<time lang="ar-EG" 
    datetime=2011-11-18T14:54:39.929Z 
    be-intl-weekday=long be-intl-year=numeric be-intl-month=long
    be-intl-day=numeric>
</time>
```

This is especially useful in environments where the consumer of the behivior prefers to use attributes, rather than properties, for updating a property of the behivior.

For this, we can add a fourth parameter to our register function:

```Typescript
register(ifWantsToBe: string, upgrade: string, extTagName: string, aspects: string[]);
```

So for the example above, this would look like:

```Typescript
register('intl', 'time', 'be-intl', ['weekday', 'year', 'month', 'day']);
```

  

