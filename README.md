# be-hive [TODO]

## Let it snow in August

be-hive is the Queen Bee of the may-it-be (?) HTML frimework.

Specify that ShadowDOM should inherit behiviors from parent Shadow DOM.

Allow judicious overriding of if-wants-to-be's.

## Syntax

```html
<be-hive></be-hive>
```

Causes copies of parent behiviors to be imported into the ShadowDOM containing the templite.

How to find said behiviors?

behiviors registered via:

```
myInstance.getRootNode()[Symbol.for('be-hive')][name of custom element] = [if wants to be value]
```

To override if-wants-to-be value, or register a new behivior, specify an override inside the overrides attribe:

```html
<be-hive overrides='{"be-reformable": "married-to-a-skullery-maid"}'></be-hive>
```