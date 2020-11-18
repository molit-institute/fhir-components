# QuestionnaireResponseList

## Props

<!-- @vuese:QuestionnaireResponseList:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|detailPageName|-|`String`|`false`|"questionnaire-response"|
|titleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "id"
  }];
}|
|subtitleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "description",
    type: ""
  }, {
    value: "publisher",
    type: ""
  }];
}|
|searchAttributes|-|`Array`|`false`|default() {
  return [{
    name: "Title",
    value: "title"
  }];
}|

<!-- @vuese:QuestionnaireResponseList:props:end -->


