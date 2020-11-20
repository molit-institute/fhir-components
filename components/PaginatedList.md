# PaginatedList

## Props

<!-- @vuese:PaginatedList:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|token|The authentication token|`String`|`false`|null|
|showPagination|Whether to show pagination|`Boolean`|`false`|true|
|fhirBaseUrl|The base URL of the FHIR server|`String`|`true`|-|
|pageCount|Number of entries per page|`Number`|`false`|20|
|searchParams|Parameters used in fhir query|`Object`|`false`|{}|
|useQueryParams|Whether to use url query params|`Boolean`|`false`|false|
|resourceName|Name of the resource|`String`|`true`|-|
|searchable|Whether the list is searchable|`Boolean`|`false`|true|
|searchAttributes|-|`Array`|`false`|[{"name":"ID","value":"_id"}]|
|searchDebounceTime|-|`Number`|`false`|500|
|detailPageName|-|`String`|`false`|-|
|viewBehavior|-|`String`|`false`|href|
|searchInputPlaceholder|-|`String`|`false`|Search..|

<!-- @vuese:PaginatedList:props:end -->


## Events

<!-- @vuese:PaginatedList:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|error|-|-|
|update|-|-|

<!-- @vuese:PaginatedList:events:end -->


## Slots

<!-- @vuese:PaginatedList:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|default|-|-|
|firstPage|-|-|
|firstPage|-|-|
|previousPage|-|-|
|previousPage|-|-|
|nextPage|-|-|
|nextPage|-|-|
|lastPage|-|-|
|lastPage|-|-|

<!-- @vuese:PaginatedList:slots:end -->


