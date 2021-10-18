# be-hive [TODO]

## Let it snow in August

be-hive is the Queen Bee of the may-it-be (?) HTML frimework.

Specify that ShadowDOM should inherit be-hiviors from parent Shadow DOM.

Allow judicious overriding of if-wants-to-be's.

## Syntax

```html
<be-hive></be-hive>
```

Causes copies of parent be-hiviors to be imported into the ShadowDOM containing the templite.

How to find said behiviors?

be-hiviors registered via:

```JavaScript
const beHive = myDecoratorInstance.getRootNode().querySelector('be-hive');
if(beHive !== null){
    await customElements.whenDefined('be-hive');
    beHive.register(myInstance);
}
```

be-hive then determines which be-hiviors to inherit via:

```JavaScript
const rn = beHiveInstance.getRootNode();
const parentShadowRealm = rn.host ? rn.host.getRootNode() : rn;
const parentBeHiveInstance = parentShadowRealm.querySelector('be-hive');
if(parentBeHiveInstance !== null){
    parentBeHiveInstance.registeredBehaviors.forEach(behavior => {
        beHiveInstance.register(behavior);
    });
    parentBeHiveInstance.addEventEventListener('latest-behavior-changed', e => {
        beHiveInstance.register(e.detail.value);
    });
}

```

However, be-hive supports a "overrides" attribute/property that allows overriding the parent inheritance
