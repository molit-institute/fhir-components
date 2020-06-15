<template>
  <div>
    <div v-if="diagnosticReport">
      <h5>Report</h5>
      <div>Issued: {{ diagnosticReport.issued }}</div>
      <div>Status: {{ diagnosticReport.status }}</div>
      <div>
        Documents: <a v-for="(document, index) in presentedForms" :href="getDocumentUrl(document.url)" :key="document.url" target="_blank">{{ index + 1 }}</a>
      </div>
      <hr />
      <h5>Meta</h5>
      <div>Chromosomal Instability: {{ chromosomalInstability }}</div>
      <div>Germline Pathogenicity: {{ germlinePathogenicity }}</div>
      <div>Percentage Tumor Tissue: {{ percentTumorTissue }}</div>
      <div>Quality: {{ qualityFlags }}</div>
      <div>MSI: {{ msi }}</div>
      <div>TMB: {{ tmb }}</div>
      <hr />
      <!-- <div>
        <h4>Relevant Variants</h4>
        <div v-if="snvs && snvs.length">
          <genetic-variant-table :geneticObservations="snvs" type="snv" title="SNVs"/>
          <hr />
        </div>
        <div v-if="cnvs && cnvs.length">
          <genetic-variant-table :geneticObservations="cnvs" type="cnv" title="CNVs" />
          <hr />
        </div>
        <div v-if="svs && svs.length">
          <genetic-variant-table :geneticObservations="svs" type="sv" title="SVs" />
          <hr />
        </div>
      </div> -->
      <div>
        <h4>All Variants</h4>
        <genetic-variant-table v-if="snvs && snvs.length" :geneticObservations="snvs" type="snv" title="SNVs" :tableBackground="tableBackground" :tableHeaderBackground="tableHeaderBackground" />
        <genetic-variant-table v-if="cnvs && cnvs.length" :geneticObservations="cnvs" type="cnv" title="CNVs" :tableBackground="tableBackground" :tableHeaderBackground="tableHeaderBackground" />
        <genetic-variant-table v-if="svs && svs.length" :geneticObservations="svs" type="sv" title="SVs" :tableBackground="tableBackground" :tableHeaderBackground="tableHeaderBackground" />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchResources } from "@molit/fhir-api";
import GeneticVariantTable from "./GeneticVariantTable";
import fhirpath from "@/assets/js/fhirpath.min.js";

const FHIRPATH_CHROMOSOMAL_INSTABILITY = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://ncit.nci.nih.gov' and code.coding.code='C48195').valueBoolean`;
const FHIRPATH_CNVS = `Bundle.entry.resource.where(resourceType='Observation')
.where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')
.where(component.code.coding.exists(system='http://loinc.org' and code='48019-4') and component.valueCodeableConcept.coding.exists(system='http://sequenceontology.org' and code='SO:0001019'))`;
const FHIRPATH_DIAGNOSTIC_REPORT = "Bundle.entry.resource.where(resourceType='DiagnosticReport').single()";
const FHIRPATH_GERMLINE_PATHOGENICITY = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://ncit.nci.nih.gov' and code.coding.code='C168797')
  .valueCodeableConcept.coding.where(system='http://terminology.hl7.org/CodeSystem/v2-0136').display`;
const FHIRPATH_MSI = `Bundle.entry.resource.where(resourceType='Observation')
  .where(code.coding.system='http://loinc.org' and code.coding.code='81695-9')
  .valueCodeableConcept.coding.where(system='http://loinc.org').display`;
const FHIRPATH_PATIENT = `Bundle.entry.resource.where(resourceType='Patient').single()`;
const FHIRPATH_PERCENT_TUMOR_TISSUE = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://ncit.nci.nih.gov' and code.coding.code='C166246').valueQuantity.value`;
const FHIRPATH_QUALITY_FLAGS = `Bundle.entry.resource.where(resourceType='Observation')
  .where(code.coding.system='http://molit.eu/fhir/vitu-tbd-codes' and code.coding.code='quality_flags')
  .valueCodeableConcept.coding.where(system='http://molit.eu/fhir/vitu-tbd-codes').display`;
const FHIRPATH_RESULTS = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')`;
const FHIRPATH_SNVS = `Bundle.entry.resource.where(resourceType='Observation')
  .where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')
  .where(component.code.coding.exists(system='http://loinc.org' and code='48019-4') and component.valueCodeableConcept.coding.exists(system='http://sequenceontology.org' and code='SO:0001483'))`;
const FHIRPATH_SVS = `Bundle.entry.resource.where(resourceType='Observation')
  .where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')
  .where(component.code.coding.exists(system='http://loinc.org' and code='48019-4') and component.valueCodeableConcept.coding.exists(system='http://sequenceontology.org' and code='SO:0001785'))`;
const FHIRPATH_SPECIMEN = `Bundle.entry.resource.where(resourceType='Specimen').single()`;
const FHIRPATH_TMB = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://loinc.org' and code.coding.code='94076-7')
  .interpretation.coding.where(system='http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation').display`;

export default {
  props: {
    fhirBaseUrl: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    token: {
      type: String
    },
    tableBackground: {
      type: String,
      default: "#ecf0f1"
    },
    tableHeaderBackground: {
      type: String,
      default: "#ecf0f1"
    },
    tableRelevantBackground: {
      type: String,
      default: "#ecf0f1"
    },
    tableRelevantHeaderBackground: {
      type: String,
      default: "#ecf0f1"
    },
    enableRelevantVariants: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      bundle: null
    };
  },

  computed: {
    params() {
      const params = new URLSearchParams();
      params.append("_id", this.id);
      params.append("_include", "DiagnosticReport:result");
      params.append("_include", "DiagnosticReport:performer");
      params.append("_include", "DiagnosticReport:specimen");
      params.append("_include", "DiagnosticReport:subject");
      params.append("_count", 1);
      return params;
    },

    chromosomalInstability() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_CHROMOSOMAL_INSTABILITY)[0];
    },

    cnvs() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_CNVS);
    },

    diagnosticReport() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_DIAGNOSTIC_REPORT)[0];
    },

    germlinePathogenicity() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_GERMLINE_PATHOGENICITY).join(",");
    },

    msi() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_MSI).join(",");
    },

    patient() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_PATIENT)[0];
    },

    percentTumorTissue() {
      return fhirpath
        .evaluate(this.bundle, FHIRPATH_PERCENT_TUMOR_TISSUE)
        .map(p => p.toFixed(2))
        .join(",");
    },

    presentedForms() {
      if (!this.diagnosticReport || !this.diagnosticReport.presentedForm) {
        return [];
      } else {
        return this.diagnosticReport.presentedForm;
      }
    },

    qualityFlags() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_QUALITY_FLAGS).join(",");
    },

    results() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_RESULTS);
    },

    snvs() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_SNVS);
    },

    svs() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_SVS);
    },

    specimen() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_SPECIMEN)[0];
    },

    tmb() {
      return fhirpath.evaluate(this.bundle, FHIRPATH_TMB).join(",");
    }
  },

  methods: {
    async fetchResources() {
      try {
        const response = await fetchResources(this.fhirBaseUrl, "DiagnosticReport", this.params, this.token);
        this.bundle = response.data;
      } catch (e) {
        console.error(e);
        this.$emit("error", e);
      }
    },

    getDocumentUrl(url) {
      if (url.startsWith("http")) {
        return url;
      } else {
        return `${this.fhirBaseUrl}/${url}`;
      }
    }
  },

  created() {
    this.fetchResources();
  },

  components: {
    GeneticVariantTable
  }
};
</script>

<style lang="scss" scoped></style>
