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
        meta: {
          versionId: "1",
          lastUpdated: "2017-08-23T12:15:33.776+02:00"
        },
        identifier: [
          {
            system: "eu.molit.questionic",
            value: "epidemiologischerFragebogenSLK"
          }
        ],
        title: "Epidemiologischer Fragebogen",
        publisher: "SLK-Kliniken Heilbronn",
        status: "active",
        description: " ",
        date: "2017-08-23T00:00:00+02:00",
        subjectType: ["Patient"],
        item: [
          {
            linkId: "1",
            text: "Persönliche Angaben",
            type: "group",
            item: [
              {
                linkId: "1.1",
                prefix: "1.1",
                text: "Sind Sie männlich oder weiblich?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers1"
              },
              {
                linkId: "1.2",
                prefix: "1.2",
                text: "Wann sind Sie geboren?",
                type: "date"
              },
              {
                linkId: "1.3",
                prefix: "1.3",
                text: "Wie ist Ihr Gesundheitszustand im Allgemeinen?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers2"
              },
              {
                linkId: "1.4",
                prefix: "1.4",
                text: "Welche Hautfarbe haben Sie?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers3"
              },
              {
                linkId: "1.5",
                prefix: "1.5",
                text: "Welchen Familienstatus haben Sie derzeit?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers4"
              },
              {
                linkId: "1.6",
                prefix: "1.6",
                text: "Welchen höchsten Schulabschluss haben Sie?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers5"
              },
              {
                linkId: "1.7",
                prefix: "1.7",
                text: "Was ist Ihr aktueller Erwerbsstatus?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers6"
              }
            ]
          },

          {
            linkId: "2",
            text: "Größe und Gewicht",
            type: "group",
            item: [
              {
                linkId: "2.1",
                prefix: "2.1",
                text: "Wie groß sind Sie, wenn Sie keine Schuhe tragen? (in cm)",
                type: "decimal"
              },
              {
                linkId: "2.2",
                prefix: "2.2",
                text: "Wie viel wiegen Sie, wenn Sie keine Kleidung und Schuhe tragen? (in kg)",
                type: "decimal"
              }
            ]
          },

          {
            linkId: "3",
            text: "Rauchen",
            type: "group",
            item: [
              {
                linkId: "3.1",
                prefix: "3.1",
                text: "Rauchen Sie?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers7"
              },
              {
                linkId: "3.2",
                prefix: "3.2",
                text: "Welches Tabakprodukt/Ersatzprodukt rauchen Sie oder haben Sie geraucht?",
                type: "choice",
                repeats: true,
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers8"
              },
              {
                linkId: "3.3",
                prefix: "3.3",
                text: "Wenn Sie täglich Zigaretten rauchen, wie viele Zigaretten rauchen Sie durchschnittlich pro Tag?",
                type: "integer"
              },
              {
                linkId: "3.4",
                prefix: "3.4",
                text: "Wie alt waren Sie als Sie angefangen haben zu rauchen, wenn auch nur gelegentlich?",
                type: "integer"
              },
              {
                linkId: "3.5",
                prefix: "3.5",
                text: "Wenn Sie nicht mehr rauchen, wie alt waren Sie als Sie mit dem Rauchen aufgehört haben?",
                type: "integer"
              },
              {
                linkId: "3.6",
                prefix: "3.6",
                text: "Wenn Sie nicht mehr rauchen wie viele Zigaretten haben Sie früher durchschnittlich pro Tag geraucht?",
                type: "integer"
              }
            ]
          },

          {
            linkId: "4",
            text: "Alkohol",
            type: "group",
            item: [
              {
                linkId: "4.1",
                prefix: "4.1",
                text: "Wie oft haben Sie in den letzten 12 Monaten Alkohol getrunken?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers9"
              },
              {
                linkId: "4.2",
                prefix: "4.2",
                text: "Wie viel Bier (0,5 L) konsumieren Sie durchschnittlich?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers10"
              },
              {
                linkId: "4.3",
                prefix: "4.3",
                text: "Wie viel Wein (0,25 L) konsumieren Sie durchschnittlich?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers11"
              },
              {
                linkId: "4.4",
                prefix: "4.4",
                text: "Wie viel Spirituosen (2 cL) konsumieren Sie durchschnittlich?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers12"
              }
            ]
          },

          {
            linkId: "5",
            text: "Ernährung und Umwelt",
            type: "group",
            item: [
              {
                linkId: "5.1",
                text: "Vegane / Vegatarische Lebensweise",
                type: "group",
                item: [
                  {
                    linkId: "5.1.1",
                    prefix: "5.1.1",
                    text: "Sind Sie Vegetarier oder Veganer? (falls Nein, bitte weiter mit Frage 5.2)",
                    type: "boolean"
                  },
                  {
                    linkId: "5.1.2",
                    prefix: "5.1.2",
                    text: "Seit wie vielen Jahren sind Sie Vegetarier oder Veganer?",
                    type: "integer"
                  }
                ]
              },
              {
                linkId: "5.2",
                prefix: "5.2",
                text: "Wie häufig haben Sie im vergangenen Jahr durchschnittlich folgende Lebensmittel gegessen?",
                type: "group",
                item: [
                  {
                    linkId: "5.2.1",
                    prefix: "5.2.1",
                    text: "Brot",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.2",
                    prefix: "5.2.2",
                    text: "Getreideprodukte (Müsli, Cornflakes)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.3",
                    prefix: "5.2.3",
                    text: "Vollkornprodukte",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.4",
                    prefix: "5.2.4",
                    text: "Kartoffeln",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.5",
                    prefix: "5.2.5",
                    text: "Hülsenfrüchte",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.6",
                    prefix: "5.2.6",
                    text: "Eier",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.7",
                    prefix: "5.2.7",
                    text: "Teigwaren (Nudeln)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.8",
                    prefix: "5.2.8",
                    text: "Reis",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.9",
                    prefix: "5.2.9",
                    text: "Obst frisch",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.10",
                    prefix: "5.2.10",
                    text: "Fruchtsäfte",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.11",
                    prefix: "5.2.11",
                    text: "Gemüse frisch",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.12",
                    prefix: "5.2.12",
                    text: "Gemüse gekocht",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.13",
                    prefix: "5.2.13",
                    text: "Milch",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.14",
                    prefix: "5.2.14",
                    text: "Milchprodukte (Joghurt)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.15",
                    prefix: "5.2.15",
                    text: "Käse",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.16",
                    prefix: "5.2.16",
                    text: "Limonaden, Erfrischungsgetränke",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.17",
                    prefix: "5.2.17",
                    text: "Öle",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.18",
                    prefix: "5.2.18",
                    text: "Süßwaren (Schokolade, Eis)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.19",
                    prefix: "5.2.19",
                    text: "Salzige Snacks (Chips)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.20",
                    prefix: "5.2.20",
                    text: "Kuchen und Torten",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.21",
                    prefix: "5.2.21",
                    text: "Schweine- oder Rindfleisch",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.22",
                    prefix: "5.2.22",
                    text: "Wild",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.23",
                    prefix: "5.2.23",
                    text: "Geflügel",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.24",
                    prefix: "5.2.24",
                    text: "Wurstwaren",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.25",
                    prefix: "5.2.25",
                    text: "Kaffee",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.26",
                    prefix: "5.2.26",
                    text: "Tee",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.27",
                    prefix: "5.2.27",
                    text: "Fisch und Fischerzeugnisse",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.2.28",
                    prefix: "5.2.28",
                    text: "Soja und Sojaprodukte",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  }
                ]
              },
              {
                linkId: "5.3",
                text: "Wie häufig haben Sie im verganenen Jahr durchschnittlich folgende Vitamine/Nahrungsergänzungsstoffe eingenommen, die nicht Ihre Ärztin/Ihr Arzt verschrieben hat?",
                type: "group",
                item: [
                  {
                    linkId: "5.3.1",
                    prefix: "5.3.1",
                    text: "Vitamin A",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.2",
                    prefix: "5.3.2",
                    text: "Vitamin C",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.3",
                    prefix: "5.3.3",
                    text: "Vitamin D",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.4",
                    prefix: "5.3.4",
                    text: "Vitamin E",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.5",
                    prefix: "5.3.5",
                    text: "Eiweißpräparate",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.6",
                    prefix: "5.3.6",
                    text: "Hormone",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.7",
                    prefix: "5.3.7",
                    text: "Zubereitungen für den Muskelaufbau",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.8",
                    prefix: "5.3.8",
                    text: "Nahrungsmittel zum Abnehmen",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  },
                  {
                    linkId: "5.3.9",
                    prefix: "5.3.9",
                    text: "Andere",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers13"
                  }
                ]
              },
              {
                linkId: "5.4",
                text: "Sind Sie/waren Sie am Arbeitsplatz bestimmten Schadstoffen/schädlicher Strahlung ausgesetzt?",
                type: "group",
                item: [
                  {
                    linkId: "5.4.1",
                    prefix: "5.4.1",
                    text: "Chemikalien in der industriellen Produktion oder Verarbeitung (z.B. Lösemittel, Weichmacher, Schwermetalle, aromatische Kohlenwasserstoffe, etc.)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  },
                  {
                    linkId: "5.4.2",
                    prefix: "5.4.2",
                    text: "Chemikalien in der Landwirtschaft (Pestizide, Fungizide, etc.)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  },
                  {
                    linkId: "5.4.3",
                    prefix: "5.4.3",
                    text: "Chemikalien in der sonstigen beruflichen Anwendung (Farben, Reinigungsmittel, Waschmittel, Pflegemittel, etc.)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  },
                  {
                    linkId: "5.4.4",
                    prefix: "5.4.4",
                    text: "KfZ-bedingte Schadstoffe (Motorenabgase, Stäube, Benzoldämpfe, etc.)",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  },
                  {
                    linkId: "5.4.5",
                    prefix: "5.4.5",
                    text: "Röntgenstrahlung/ionisierende Strahlung",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  },
                  {
                    linkId: "5.4.6",
                    prefix: "5.4.6",
                    text: "UV-Strahlung",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  },
                  {
                    linkId: "5.4.7",
                    prefix: "5.4.7",
                    text: "Radioaktive Strahlung: ",
                    type: "choice",
                    answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers14"
                  }
                ]
              }
            ]
          },

          {
            linkId: "6",
            text: "Körperliche Aktivität",
            type: "group",
            item: [
              {
                linkId: "6.1",
                prefix: "6.1",
                text: "Wie würden Sie Ihre berufliche Tätigkeit/Ihre Lebensweise beschreiben?",
                type: "choice",
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers15"
              },
              {
                linkId: "6.2",
                prefix: "6.2",
                text: "Wie viele Stunden verbringen Sie durchschnittlich in der Woche in Ihrer Freizeit mit Sport oder körperlicher Aktivität?",
                type: "group",
                item: [
                  {
                    linkId: "6.2.1",
                    prefix: "6.1",
                    text: "Mit geriner Intensität (z.B. Aerobik, Gymnastik, Walken, Golf, Yoga, Dartwerfen)",
                    type: "decimal"
                  },
                  {
                    linkId: "6.2.2",
                    prefix: "6.2.2",
                    text: "Mit moderater Intensität (z.B. Laufen, Tennis, Volleyball, Tanzen)",
                    type: "decimal"
                  },
                  {
                    linkId: "6.2.3",
                    prefix: "6.2.3",
                    text: "Mit höherer Intensität (z.B. Joggen, Rudern, Kickboxen, Spinning)",
                    type: "decimal"
                  }
                ]
              }
            ]
          },

          {
            linkId: "7",
            text: "Anamnese",
            type: "group",
            item: [
              {
                linkId: "7.1",
                prefix: "7.1",
                text: "Hat oder hatte ein Mitglied Ihrer Familie 1. Grades eine Krebserkrankung?",
                type: "choice",
                repeats: true,
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers16"
              },
              {
                linkId: "7.2",
                prefix: "7.2",
                text: "Welche Krebserkrankung(en) trat(en) bei Ihren Familienmitgliedern 1. Grades auf?",
                type: "choice",
                repeats: true,
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers17"
              },
              {
                linkId: "7.3",
                prefix: "7.3",
                text:
                  "Sind Sie oder waren Sie an weiteren Krebserkrankungen erkrankt? (Außer der Krebserkrankung, weswegen Sie gerade in Behandlung sind) (Falls nein, bitte bis Frage 7.5 überspringen)",
                type: "boolean"
              },
              {
                linkId: "7.4",
                prefix: "7.4",
                text: "Welche Art von Krebs wurde bei Ihnen schon mal diagnostiziert (außer der Krebserkrankung, weswegen Sie gerade in Behandlung sind)?",
                type: "choice",
                repeats: true,
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers17"
              },
              {
                linkId: "7.5",
                prefix: "7.5",
                text: "Wurde bei Ihnen eine der folgenden Krankheiten oder Beschwerden jemals ärztlich diagnostiziert? ",
                type: "choice",
                repeats: true,
                answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_epidemiologischerFragebogen_answers18"
              }
            ]
          },

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
