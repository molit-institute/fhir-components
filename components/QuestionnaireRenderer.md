# QuestionnaireRenderer

## Props

<!-- @vuese:QuestionnaireRenderer:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|questionnaireResponse|FHIR-Resource QuestionnaireResponse|`Object`|`false`|null|
|questionnaire|FHIR-Resource Questionnaire|`Object`|`false`|null|
|subject|FHIR-Resource Patient|`Object`|`false`|null|
|baseUrl|FHIR-Base Url|`String`|`false`|-|
|valueSets|List of ValueSets that are needed to display the given questionnaire|`Array`|`false`|null|
|mode|Current type of Questionnaire-Style to display Available: StepperQuestionnaire, GroupedQuestionnaire, FullQuestionnaire|`String`|`false`|StepperQuestionnaire|
|questionnaireUrl|The Url to fetch the Questionnaire from|`String`|`false`|null|
|startQuestion|ID of the question in the ItemList where in the list of questions the renderer should start|`Object`|`false`|null|
|editMode|If true the render will show the button to exit the renderer|`Boolean`|`false`|false|
|enableReturn|Enable the return-button to exit the render-view|`Boolean`|`false`|true|
|lastQuestion|If true, the Renderer will show the last question|`Boolean`|`false`|false|
|primary|Primary color|`String`|`false`|-|
|secondary|Secondary color|`String`|`false`|-|
|danger|Color used to symbolise danger|`String`|`false`|red|
|locale|Current locale|`String`|`false`|de|

<!-- @vuese:QuestionnaireRenderer:props:end -->


## Events

<!-- @vuese:QuestionnaireRenderer:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|updated|-|-|
|finished|-|-|
|exit|-|-|

<!-- @vuese:QuestionnaireRenderer:events:end -->


