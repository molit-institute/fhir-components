# BaseList

## Props

<!-- @vuese:BaseList:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|fhirBaseUrl|-|`String`|`true`|-|
|titleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "id",
    type: ""
  }];
}|
|useQueryParams|-|`Boolean`|`false`|false|
|subtitleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "id",
    type: ""
  }];
}|
|viewBehavior|-|`String`|`false`|"href"|

<!-- @vuese:BaseList:props:end -->


