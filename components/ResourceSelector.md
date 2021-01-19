# ResourceSelector

## Props

<!-- @vuese:ResourceSelector:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|resourceName|-|`String`|`true`|-|
|fhirBaseUrl|-|`String`|`true`|-|
|modalDialog|-|`Boolean`|`false`|true|
|queryParams|-|`Object`|`false`|{}|
|searchAttributes|-|`Array`|`false`|[{"name":"ID","value":"_id"}]|
|titleAttribute|-|`Object`|`false`|{"value":"id"}|
|subtitleAttributes|-|`Array`|`false`|[]|
|token|-|`String`|`false`|null|
|title|-|`String`|`false`|Choose...|
|cancelText|-|`String`|`false`|Cancel|
|okText|-|`String`|`false`|OK|
|searchInputPlaceholder|-|`String`|`false`|Search..|

<!-- @vuese:ResourceSelector:props:end -->


## Events

<!-- @vuese:ResourceSelector:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|cancel|-|-|
|update|-|-|
|error|-|-|

<!-- @vuese:ResourceSelector:events:end -->

