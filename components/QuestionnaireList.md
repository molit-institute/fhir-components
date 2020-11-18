# QuestionnaireList

## Props

<!-- @vuese:QuestionnaireList:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|detailPageName|-|`String`|`false`|"questionnaire"|
|titleAttributes|-|`Array`|`false`|default() {
  return [{
    value: "title",
    type: ""
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

<!-- @vuese:QuestionnaireList:props:end -->


