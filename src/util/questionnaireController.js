import questionnaireResponseController from "@/util/questionnaireResponseController";

/**
 * Takes the given question and returns an Array of options for the Gui to iterate through. Handling reference and ValueSets
 *
 * @param {Object} questionnaire the Questionnaire needed for the referenced Valuesets
 * @param {Object} question
 */
export function getChoiceOptions(questionnaire, question, valueSets, FHIR_URL) {
  //check if reference or ValueSet
  if (questionnaire && question && question.answerValueSet) {
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
  } else {
    throw new Error("Getting Choice Options failed, because the given parameters were null, undefined or empty");
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
 * @param {Array} itemList
 * @param {Array} logicList
 *
 * @returns itemList
 */
function handleEnableWhen(currentQuestionnaireResponse, itemList) {
  let newItemList = [];
  console.log("cQR: ", currentQuestionnaireResponse);
  console.log(itemList);
  let answersList = questionnaireResponseController.createItemList(currentQuestionnaireResponse);
  //logicListe durchgehen und mit questionnaireResponse vergleichen
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i].enableWhen) {
      console.log("question:", itemList[i]);
      // Für jede Logik Frage
      // hole für jedes Enable-when die Answer
      for (let x = 0; x < itemList[i].enableWhen.length; x++) {
        console.log(x);
        console.log(itemList[i].enableWhen[x]);
        let item = answersList.find(function(element) {
          return element.linkId === itemList[i].enableWhen[x].question;
        });
        // schau ob Answer da
        if (item.answer && item.answer.length !== 0) {
          // bei Antwort Logik laufen lassen
          if (handleEnableWhenLogic(item, itemList[i].enableWhen[x])) {
            newItemList.push(itemList[i]);
          } else {
            // wenn false oder null question aus itemList removen falls in itemList vorhanden
            // newItemList = removeLogicQuestion(itemList[i], newItemList);
          }
        } else {
          // question aus itemList entfernen falls drin
          // newItemList = removeLogicQuestion(itemList[i], newItemList);
          // newItemList.push(itemList[i]);
        }
      }
    } else {
      newItemList.push(itemList[i]);
    }
  }
  return newItemList;
}

/**
 * Removes a LogicQuestion from the given ItemList
 * @param {Object} logicQuestion Question to be removed
 * @param {Array} itemList List of Questions
 */
function removeLogicQuestion(logicQuestion, itemList) {
  let index = itemList.findIndex(element => element.linkId === logicQuestion.linkId);
  itemList.splice(index, 1);
  return itemList;
}

/**
 * Compares the given answers with the given enableWhen-value using the operator
 * @param {Object} item Contains the answer to question that is referenced in the logicQuestion
 * @param {Object} enableWhen Contains the Reference, operator and expected result needed for the logic operation
 * @returns {Boolean} Returns true if at least one answer is true with the given operator, else returns false by default
 */
function handleEnableWhenLogic(item, enableWhen) {
  let result = false;
  //check all the answers
  console.log(item, item.answer, item.answer.length);
  for (let i = 0; i < item.answer.length; i++) {
    //check operator
    switch (enableWhen.operator) {
      case "exists":
        result = true;
        break;
      case "=":
        if (handleEnableWhenValueType(item.answer[i]) === handleEnableWhenValueType(enableWhen)) {
          result = true;
        }
        break;
      case "!=":
        if (handleEnableWhenValueType(item.answer[i]) !== handleEnableWhenValueType(enableWhen)) {
          result = true;
        }
        break;
      case ">":
        if (handleEnableWhenValueType(item.answer[i]) > handleEnableWhenValueType(enableWhen)) {
          result = true;
        }
        break;
      case "<":
        if (handleEnableWhenValueType(item.answer[i]) < handleEnableWhenValueType(enableWhen)) {
          result = true;
        }
        break;
      case ">=":
        if (handleEnableWhenValueType(item.answer[i]) >= handleEnableWhenValueType(enableWhen)) {
          result = true;
        }
        break;
      case "<=":
        if (handleEnableWhenValueType(item.answer[i]) <= handleEnableWhenValueType(enableWhen)) {
          result = true;
        }
        break;

      default:
    }
  }
  //
  return result;
}

/**
 * Returns the value of the answer, by checking for every available type if the value is true or not.
 * @param {*} value
 */
function handleEnableWhenValueType(value) {
  if (value.valueBoolean || value.valueBoolean === false) {
    return value.valueBoolean.toString();
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
export default {
  handleEnableWhen,
  getChoiceOptions
};
