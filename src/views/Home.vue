<template>
  <div>
    <div class="container-fluid">
      <!-- <molecular-report :resources="exampleReport" /> -->
      <!-- <molecular-report :resources="exampleReport" variantType="CNV" /> -->
      <questionnaire-renderer :questionnaire="questionnaire" :baseUrl="baseUrl" locale="de" mode="GroupedQuestionnaire"></questionnaire-renderer>
    </div>
  </div>
</template>

<script>
import QuestionnaireRenderer from "@/components/QuestionnaireRenderer";
import PatientList from "@/components/PatientList";
import Patient from "@/components/resources/Patient-de-basis";
import examplePatient from "@/assets/fhir/resources/patient-example.json";
import exampleReport from "@/assets/fhir/resources/genomics-observation-example.json";
import exampleReport2 from "@/assets/fhir/resources/genomics-observation-example-2.json";
import MolecularReport from "@/components/MolecularReport";
import QuestionnaireList from "@/components/QuestionnaireList";
import QuestionnaireResponseList from "@/components/QuestionnaireResponseList";

export default {
  computed: {
    examplePatient() {
      return examplePatient;
    },

    exampleReport() {
      return [exampleReport, exampleReport2];
    }
  },
  data() {
    return {
      baseUrl: "https://fhir.molit.eu/r4/",
      questionnaire: {
        resourceType: "Questionnaire",
        identifier: [
          {
            system: "eu.molit.questionic",
            value: "demo-questionnaire"
          }
        ],
        title: "Test Fragebogen",
        status: "active",
        subjectType: ["Patient"],
        date: "2019-04-26T00:00:00+02:00",
        publisher: "MOLIT Institut",
        description: "Dieser Fragebogen wurde zu Testzwecken erstellt und sollte nicht außerhalb der Testumgebung genutzt werden.",
        item: [
          {
            linkId: "8",
            text: "Früherkennung",
            type: "group",
            item: [
              {
                linkId: "8.1",
                prefix: "8.1",
                text: "Haben Sie schon mal an folgenden Untersuchungen zur Krebsfrüherkennung teilgenommen?",
                type: "group",
                item: [
                  {
                    linkId: "8.1.1",
                    prefix: "8.1.1",
                    text: "Darmspiegelung?",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers19"
                  },
                  {
                    linkId: "8.1.2",
                    prefix: "8.1.2",
                    text: "Hautkrebsvorsorge?",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers19"
                  },
                  {
                    linkId: "8.1.3",
                    prefix: "8.1.3",
                    text: "(nur für männliche Teilnehmer) Prostatakrebsvorsorge?",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers19"
                  },
                  {
                    linkId: "8.1.4",
                    prefix: "8.1.4",
                    text: "(nur für weibliche Teilnehmer) Brustkrebsvorsorge?",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers19"
                  },
                  {
                    linkId: "8.1.5",
                    prefix: "8.1.5",
                    text: "(nur für weibliche Teilnehmer) Gynäkologische Krebsvorsorge (Vorsorgeuntersuchung Unterleibskrebs)? ",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers19"
                  }
                ]
              }
            ]
          },

          {
            linkId: "9",
            text: "Fragen für weibliche Teilnehmer",
            type: "group",
            item: [
              {
                linkId: "9.1",
                prefix: "9.1",
                text: "Mit wie vielen Jahren hatten Sie Ihre erste Regelblutung? ",
                type: "integer"
              },
              {
                linkId: "9.2",
                prefix: "9.2",
                text: "Mit wie vielen Jahren trat Ihre letzte Regelblutung auf? ",
                type: "integer"
              },
              {
                linkId: "9.3",
                prefix: "9.3",
                text: "Mit wie vielen Jahren hatten Sie Ihre Wechseljahre? (falls noch nicht, bitte „00“ eintragen)",
                type: "integer"
              },
              {
                linkId: "9.4",
                prefix: "9.4",
                text: "Wie viele Schwangerschaften hatten Sie?",
                type: "integer"
              },
              {
                linkId: "9.5",
                prefix: "9.5",
                text: "Haben Sie die Antibabypille eingenommen?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers20"
              }
            ]
          }
        ]
      }
    };
  },

  components: {
    QuestionnaireRenderer,
    PatientList,
    Patient,
    MolecularReport,
    QuestionnaireList,
    QuestionnaireResponseList
  },

  methods: {
    test(resource) {
      console.log(resource);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  margin-bottom: 2rem;
}
</style>
