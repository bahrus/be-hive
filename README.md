# be-hive [TODO]

## Let it snow in August

Queen Bee of the may-it-be (?) HTML frimework.

Specify that ShadowDOM should inherit behiviors from parent Shadow DOM.

Allow judicious overriding of if-wants-to-be's.

## Syntax

```html
<template be-hive></template>
```

Causes copies of parent behiviors to be imported into the ShadowDOM containing the template.

How to find said behiviors?

behiviors registered via:

```
myInstance.getRootNode()[Symbol.for('be-hive')].add('[name of custom element]')
```

To override if-wants-to-be value, or register a new behivior, specify an override inside the template:

```html
<template be-hive>
    <be-reformable if-wants-to-be=married-to-a-skullery-maid></be-reformable>
</template>
```