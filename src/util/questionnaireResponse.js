/**
 * Represents a Questionnaire Response
 * source: http://hl7.org/fhir/questionnaireresponse.html
 */

export class QuestionnaireResponse {
  static create() {
    return {
      resourceType: "QuestionnaireResponse",
      questionnaire: null,
      status: null,
      subject: null,
      authored: null,
      source: null,
      item: []
    };
  }
}

/**
 * A question as an item, containing linkId,definition,text, and no,one or more than one answers
 * source: http://hl7.org/fhir/questionnaireresponse.html
 */

export class Item {
  static create() {
    return {
      linkId: null,
      definition: null,
      text: null,
      answer: [],
      item: []
    };
  }
}

/**
 * Answer, which contains the value and items
 * source: http://hl7.org/fhir/questionnaireresponse.html
 */

export class Answer {
  static create() {
    return {
      item: []
    };
  }
}

export default { QuestionnaireResponse, Item, Answer };
