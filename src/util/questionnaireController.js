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

export default {
  getChoiceOptions
};
