# ListView

## Props

<!-- @vuese:ListView:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|fhirBaseUrl|-|`String`|`true`|-|
|pageCount|-|`Number`|`false`|20|
|searchParams|-|`Object`|`false`|{}|
|useQueryParams|-|`Boolean`|`false`|false|
|resourceName|-|`String`|`true`|-|
|titleAttributes|-|`Array`|`false`|[{"value":"id","type":""}]|
|subtitleAttributes|-|`Array`|`false`|[]|
|sortable|-|`Boolean`|`false`|false|
|sortAttributes|-|`Array`|`false`|[{"name":"ID","value":"_id"}]|
|searchable|-|`Boolean`|`false`|true|
|searchAttributes|-|`Array`|`false`|[{"name":"ID","value":"_id"}]|
|searchDebounceTime|-|`Number`|`false`|500|
|detailPageName|-|`String`|`false`|-|
|viewBehavior|-|`String`|`false`|href|

<!-- @vuese:ListView:props:end -->


## Events

<!-- @vuese:ListView:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|view|-|-|

<!-- @vuese:ListView:events:end -->


