# PatientList

## Props

<!-- @vuese:PatientList:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|detailPageName|-|`String`|`false`|"patient"|
|titleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "name",
    type: "HumanName"
  }];
}|
|subtitleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "birthDate",
    type: ""
  }, {
    value: "gender",
    type: ""
  }];
}|

<!-- @vuese:PatientList:props:end -->


