import questionnaireResponseController from "@/util/questionnaireResponseController";

/**
 * Takes the given question and returns an Array of options for the Gui to iterate through. Handling reference and ValueSets
 *
 * @param {Object} questionnaire the Questionnaire needed for the referenced Valuesets
 * @param {Object} question
 */
export function getChoiceOptions(questionnaire, question, valueSets, FHIR_URL) {
  //check if reference or ValueSet
  if (questionnaire && question) {
    if (question.answerValueSet) {
      let reference = question.answerValueSet;
      if (reference.startsWith("#")) {
        return getReferenceOptions(questionnaire, reference);
      } else {
        if (FHIR_URL && valueSets) {
          return getValueSetOptions(reference, valueSets, FHIR_URL);
        } else {
          throw new Error("The given FHIR_URL or ValueSets was null or undefined");
        }
      }
    } else if (question.answerOption) {
      let optionsList = [];
      for (let i = 0; i < question.answerOption.length; i++) {
        let count = i + 1;
        let option = {
          display: getAnswerOptionValue(question.answerOption[i]),
          code: "A" + count
        };
        optionsList.push(option);
      }
      return optionsList;
    }
  } else {
    throw new Error("Getting Choice Options failed, because the given parameters were null, undefined or empty");
  }
}

/**
 * Return the value of the given answerOption
 * @param {Array} answerOption
 */
function getAnswerOptionValue(answerOption) {
  if (answerOption.valueInteger) {
    return answerOption.valueInteger;
  }
  if (answerOption.valueDate) {
    return answerOption.valueDate;
  }
  if (answerOption.valueTime) {
    return answerOption.valueTime;
  }
  if (answerOption.valueString) {
    return answerOption.valueString;
  }
  if (answerOption.valueCoding) {
    return answerOption.valueCoding.display;
  }
}

/**
 * Gets all Options from a Reference in the questionnaire
 * @param {Object} questionnaire
 * @param {String} reference
 */
function getReferenceOptions(questionnaire, reference) {
  //getting reference id to compare to ValueSet-Id
  if (questionnaire && reference) {
    let referenceSplit = reference.split("#", 2);
    let referenceId = referenceSplit[1];
    for (let i = 0; i < questionnaire.contained.length; i++) {
      if (questionnaire.contained[i].id === referenceId) {
        if (questionnaire.contained[i].compose.include[0].concept) {
          return questionnaire.contained[i].compose.include[0].concept;
        }
      }
    }
  } else {
    return [];
  }
}

/**
 * Fetches the given ValueSet from the FHIR-Server
 * NEW: Gets the given ValueSet from the Store or tries to download it if not yet stored
 * @param {String} url The ValueSets url
 */
async function getValueSetOptions(reference, valueSets) {
  let valueSet = null;
  for (let i = 0; i < valueSets.length; i++) {
    let valueSetUrl = valueSets[i].url;
    if (reference === valueSetUrl) {
      valueSet = valueSets[i];
    }
  }
  if (valueSet && valueSet.expansion && valueSet.expansion.contains) {
    return await valueSet.expansion.contains;
  }
  if (valueSet && valueSet.compose && valueSet.compose.include) {
    //TODO how to handle multiple includes?
    return valueSet.compose.include[0].concept;
  }
}

/**
 * Handles enable-when in questions by taking the current QuestionnaireResponse and logicList and check if any Question that is referenced in the logic-list has been answered.
 * If the logic returns true, the logic-question will be added to the current Itemlist.
 * @param {Array} currentQuestionnaireResponse The current QuestionnaireResponse
 * @param {Array} itemList original unflattened items of the questionnaire
 *
 * @returns itemList
 */
export function handleEnableWhen(currentQuestionnaireResponse, itemList) {
  let newItemList = [];
  let answersList = questionnaireResponseController.createItemList(currentQuestionnaireResponse);
  addItemToList(answersList, itemList, newItemList);
  return newItemList;
}

/**
 * This Method adds Items to the given List by checking every question for an enable-when, then checking if there are answers for this question and if so, will run
 * the Logic-Method. If the Logic-Method returns true, the question will be added to the new List.
 * @param {*} answersList  List of all answers
 * @param {*} itemList  original unflattened items of the questionnaire
 * @param {*} newItemList new ItemList containing all questions and activated questions
 */
function addItemToList(answersList, itemList, newItemList) {
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i].enableWhen) {
      let results = [];
      for (let x = 0; x < itemList[i].enableWhen.length; x++) {
        let item = answersList.find(function (element) {
          return element.linkId === itemList[i].enableWhen[x].question;
        });
        if (item.answer && item.answer.length !== 0) {
          if (handleEnableWhenLogic(item, itemList[i].enableWhen[x])) {
            results.push(true);
          }
        }
      }
      if (itemList[i].enableBehavior) {
        switch (itemList[i].enableBehavior) {
          case "All":
            if (results.length === itemList[i].enableWhen.length) {
              newItemList.push(itemList[i]);
              if (itemList[i].type === "group") {
                addItemToList(answersList, itemList[i].item, newItemList);
              }
            }
            break;
          case "Any":
            if (results.length > 0) {
              newItemList.push(itemList[i]);
              if (itemList[i].type === "group") {
                addItemToList(answersList, itemList[i].item, newItemList);
              }
            }
            break;
          default:
            if (results.length > 0) {
              newItemList.push(itemList[i]);
              if (itemList[i].type === "group") {
                addItemToList(answersList, itemList[i].item, newItemList);
              }
            }
            break;
        }
      } else {
        if (results.length > 0) {
          newItemList.push(itemList[i]);
          if (itemList[i].type === "group") {
            addItemToList(answersList, itemList[i].item, newItemList);
          }
        }
      }
    } else {
      newItemList.push(itemList[i]);
      if (itemList[i].type === "group") {
        addItemToList(answersList, itemList[i].item, newItemList);
      }
    }
  }
}

/**
 * Compares the given answers with the given enableWhen-value using the operator
 * @param {Object} item Contains the answer to question that is referenced in the logicQuestion
 * @param {Object} enableWhen Contains the Reference, operator and expected result needed for the logic operation
 * @returns {Boolean} Returns true if at least one answer is true with the given operator, else returns false by default
 */
function handleEnableWhenLogic(item, enableWhen) {
  let result = false;
  //liste mit results
  for (let i = 0; i < item.answer.length; i++) {
    switch (enableWhen.operator) {
      case "exists":
        result = true;
        break;
      case "=":
        if (handleEnableWhenValueType(item.answer[i]) === handleEnableWhenAnswerType(enableWhen)) {
          result = true;
        }
        break;
      case "!=":
        if (handleEnableWhenValueType(item.answer[i]) !== handleEnableWhenAnswerType(enableWhen)) {
          result = true;
        }
        break;
      case ">":
        if (handleEnableWhenValueType(item.answer[i]) > handleEnableWhenAnswerType(enableWhen)) {
          result = true;
        }
        break;
      case "<":
        if (handleEnableWhenValueType(item.answer[i]) < handleEnableWhenAnswerType(enableWhen)) {
          result = true;
        }
        break;
      case ">=":
        if (handleEnableWhenValueType(item.answer[i]) >= handleEnableWhenAnswerType(enableWhen)) {
          result = true;
        }
        break;
      case "<=":
        if (handleEnableWhenValueType(item.answer[i]) <= handleEnableWhenAnswerType(enableWhen)) {
          result = true;
        }
        break;

      default:
    }
  }
  return result;
}

/**
 * Returns the value of the answer, by checking for every available type if the value is true or not.
 * @param {*} value
 */
function handleEnableWhenValueType(value) {
  if (value.valueBoolean || value.valueBoolean === false) {
    return value.valueBoolean;
  } else if (value.valueDecimal) {
    return value.valueDecimal;
  } else if (value.valueInteger) {
    return value.valueInteger;
  } else if (value.valueDate) {
    return value.valueDate;
  } else if (value.valueDateTime) {
    return value.valueDateTime;
  } else if (value.valueTime) {
    return value.valueTime;
  } else if (value.valueString) {
    return value.valueString;
  } else if (value.valueUri) {
    return value.valueUri;
  } else if (value.valueAttachment) {
    return value.valueAttachment;
  } else if (value.valueCoding) {
    return value.valueCoding.display;
  } else if (value.valueQuantity) {
    return value.valueQuantity;
  } else {
    return null;
  }
}

/**
 * Returns the value of the answer, by checking for every available type if the value is true or not.
 * @param {*} value
 */
function handleEnableWhenAnswerType(value) {
  if (value.answerBoolean || value.answerBoolean === false) {
    return value.answerBoolean;
  } else if (value.answerDecimal) {
    return value.answerDecimal;
  } else if (value.answerInteger) {
    return value.answerInteger;
  } else if (value.answerDate) {
    return value.answerDate;
  } else if (value.answerDateTime) {
    return value.answerDateTime;
  } else if (value.answerTime) {
    return value.answerTime;
  } else if (value.answerString) {
    return value.answerString;
  } else if (value.answerUri) {
    return value.answerUri;
  } else if (value.answerAttachment) {
    return value.answerAttachment;
  } else if (value.answerCoding) {
    return value.answerCoding.display;
  } else if (value.answerQuantity) {
    return value.answerQuantity;
  } else {
    return null;
  }
}

export default { handleEnableWhen, getChoiceOptions };
