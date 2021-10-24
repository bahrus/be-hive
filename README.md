# be-hive

## Let it snow in August

be-hive is the Queen Bee of the [may-it-be](https://github.com/bahrus/may-it-be) HTML frimework.

Specify that ShadowDOM should inherit be-hiviors from parent Shadow DOM.

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
