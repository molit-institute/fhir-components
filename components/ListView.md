# ListView

## Props

<!-- @vuese:ListView:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|fhirBaseUrl|-|`String`|`true`|-|
|pageCount|-|`Number`|`false`|20|
|searchParams|-|`Object`|`false`|default() {
  return {};
}|
|useQueryParams|-|`Boolean`|`false`|false|
|resourceName|-|`String`|`true`|-|
|titleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "id",
    type: ""
  }];
}|
|subtitleAttributes|-|`Array`|`false`|default() {
  return [];
}|
|sortable|-|`Boolean`|`false`|false|
|sortAttributes|-|`Array`|`false`|default() {
  return [{
    name: "ID",
    value: "_id"
  }];
}|
|searchable|-|`Boolean`|`false`|true|
|searchAttributes|-|`Array`|`false`|default() {
  return [{
    name: "ID",
    value: "_id"
  }];
}|
|searchDebounceTime|-|`Number`|`false`|500|
|detailPageName|-|`String`|`false`|-|
|viewBehavior|-|`String`|`false`|"href"|

<!-- @vuese:ListView:props:end -->


