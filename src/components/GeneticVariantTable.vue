<template>
  <div>
    <div class="genetic-header">
      <h6>{{ title }}</h6>
      <div class="column-hide-options" v-if="showColumnHideOptions">
        <button type="button" class="btn btn-link" @click="toggleDropdown">Column selection &#9662;</button>
      </div>
    </div>
    <div class="dropdown-wrapper">
      <div class="dropdown" v-if="showDropdown">
        <div class="dropdown-top">
          <div><strong>Columns</strong></div>
          <div>
            <button type="button" class="btn btn-link" @click="toggleDropdown"><strong>&times;</strong></button>
          </div>
        </div>
        <div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" :id="id" v-model="showId" />
            <label class="form-check-label" :for="id">Id</label>
          </div>
        </div>
        <div v-for="component in filteredComponents" :key="id + '/' + component.system + '/' + component.code">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" :id="id + '/' + component.system + '/' + component.code" v-model="component.visible" />
            <label class="form-check-label" :for="id + '/' + component.system + '/' + component.code">{{ component.display }}</label>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-sm" :style="{ background: tableBackground }">
      <thead>
        <tr :style="{ background: tableHeaderBackground }">
          <th></th>
          <th v-if="showId">Id</th>
          <th v-for="component in visibleComponents" :key="component.system + '/' + component.code">{{ component.display }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in geneticObservations" :key="resource.id">
          <td>&star;</td>
          <td v-if="showId">{{ resource.id }}</td>
          <td v-for="component in visibleComponents" :key="component.system + '/' + component.code">
            <span v-for="value in getComponentValues(resource, component.expression)" :key="value">
              <span v-if="component.link && component.link.url && component.link.attribute">
                <a :href="createLink(component, value)" target="_blank">{{ value }}</a>
                &#32;
              </span>
              <span v-else>{{ value }}&#32;</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import fhirpath from "@/assets/js/fhirpath.min.js";
import { uniqueId } from "lodash";

const EXPRESSION_BASE = "Observation.component.where(code.coding.system='%system' and code.coding.code='%code')";
const EXPRESSION_CODEABLE_CONCEPT = EXPRESSION_BASE + ".valueCodeableConcept.coding.iif($this.display.exists(), $this.display, $this.code)";
const EXPRESSION_QUANTITY = EXPRESSION_BASE + ".valueQuantity.value";
const EXPRESSION_RANGE = EXPRESSION_BASE + ".valueRange.select(iif($this.low.value.exists(), $this.low.value.toString(), '') + '-' + iif($this.high.value.exists(), $this.high.value.toString(), ''))";
const EXPRESSION_INTEGER = EXPRESSION_BASE + ".valueInteger";
const EXPRESSION_STRING = EXPRESSION_BASE + ".valueString";

export default {
  props: {
    hideId: {
      type: Boolean,
      default: true
    },
    showColumnHideOptions: {
      type: Boolean,
      default: true
    },
    components: {
      type: Array
    },
    geneticObservations: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: "snv"
    },
    title: {
      type: String,
      default: "Variants"
    },
    tableHeaderBackground: {
      type: String,
      default: ""
    },
    tableBackground: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      showId: true,
      showDropdown: false,
      allComponents: [
        {
          system: "http://loinc.org",
          code: "48018-6",
          display: "Gene",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv", "sv"],
          link: {
            url: "https://oncokb.org/gene/%s",
            attribute: "display"
          }
        },
        {
          system: "http://loinc.org",
          code: "48001-2",
          display: "Chromosome",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["cnv", "snv"]
        },
        {
          system: "http://loinc.org",
          code: "82155-3",
          display: "Copy Number",
          expression: null,
          visible: true,
          valueType: "Quantity",
          variantTypes: ["cnv"]
        },
        {
          system: "http://loinc.org",
          code: "62374-4",
          display: "Reference",
          expression: null,
          visible: false,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv", "sv"]
        },
        {
          system: "http://loinc.org",
          code: "48002-0",
          display: "Genomic source class",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv", "sv"]
        },
        {
          system: "http://loinc.org",
          code: "48019-4",
          display: "DNA change type",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv", "sv"]
        },
        {
          system: "http://loinc.org",
          code: "48004-6",
          display: "c.HGVS",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv"]
        },
        {
          system: "http://loinc.org",
          code: "48005-3",
          display: "p.HGVS",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv"]
        },
        {
          system: "http://loinc.org",
          code: "51958-7",
          display: "Transcript ID",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv"],
          link: {
            url: "https://www.ncbi.nlm.nih.gov/nuccore/%s",
            attribute: "display"
          }
        },
        {
          system: "http://loinc.org",
          code: "81258-6",
          display: "Sample Allelic Frequency",
          expression: null,
          visible: true,
          valueType: "Quantity",
          variantTypes: ["snv"]
        },
        {
          system: "http://loinc.org",
          code: "82121-5",
          display: "Allelic read depth",
          expression: null,
          visible: false,
          valueType: "integer",
          variantTypes: ["snv", "cnv"]
        },
        {
          system: "http://loinc.org",
          code: "81259-4",
          display: "Associated phenotype",
          expression: null,
          visible: false,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv", "sv"]
        },
        {
          system: "http://loinc.org",
          code: "53037-8",
          display: "Clinical significance",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["snv", "cnv", "sv"]
        },
        {
          system: "http://hl7.org/fhir/uv/genomics-reporting/CodeSystem/tbd-codes",
          code: "exact-start-end",
          display: "Start & End",
          expression: null,
          visible: false,
          valueType: "Range",
          variantTypes: ["snv", "cnv"]
        },
        {
          system: "http://loinc.org",
          code: "69547-8",
          display: "Ref allele",
          expression: null,
          visible: false,
          valueType: "string",
          variantTypes: ["snv", "cnv"]
        },
        {
          system: "http://loinc.org",
          code: "69551-0",
          display: "Alt allele",
          expression: null,
          visible: false,
          valueType: "string",
          variantTypes: ["snv", "cnv"]
        },
        {
          system: "http://molit.eu/fhir/vitu-tbd-codes",
          code: "left-bp",
          display: "Left breakpoint position",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["sv"]
        },
        {
          system: "http://molit.eu/fhir/vitu-tbd-codes",
          code: "right-bp",
          display: "Right breakpoint position",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["sv"]
        },
        {
          system: "http://molit.eu/fhir/vitu-tbd-codes",
          code: "cnv-size",
          display: "CNV Size",
          expression: null,
          visible: true,
          valueType: "CodeableConcept",
          variantTypes: ["cnv"]
        },
        {
          system: "http://molit.eu/fhir/vitu-tbd-codes",
          code: "exons",
          display: "Exons",
          expression: null,
          visible: false,
          valueType: "Range",
          variantTypes: ["cnv"]
        }
      ],
      filteredComponents: []
    };
  },

  computed: {
    visibleComponents() {
      return this.filteredComponents ? this.filteredComponents.filter(c => c.visible !== false) : [];
    },

    id() {
      return uniqueId();
    }
  },

  methods: {
    getComponentValues(observation, expression) {
      if (!observation || !expression) {
        return [];
      }
      return fhirpath.evaluate(observation, expression).filter(s => s !== "SNV" && s !== "copy_number_variation" && s !== "structural_alteration");
    },

    createLink(component, value) {
      if (!component || !component.link || !component.link.url || !component.link.attribute) {
        return null;
      }
      return component.link.url.replace("%s", value);
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    addExpressionsToComponents(components) {
      if (!components) {
        return [];
      }
      return components.map(c => {
        switch (c.valueType) {
          case "Quantity":
            c.expression = EXPRESSION_QUANTITY;
            break;
          case "string":
            c.expression = EXPRESSION_STRING;
            break;
          case "integer":
            c.expression = EXPRESSION_INTEGER;
            break;
          case "Range":
            c.expression = EXPRESSION_RANGE;
            break;
          default:
            c.expression = EXPRESSION_CODEABLE_CONCEPT;
        }
        c.expression = c.expression.replace("%system", c.system).replace("%code", c.code);
        return c;
      });
    },

    initializeComponents() {
      if (this.components) {
        this.filteredComponents = this.addExpressionsToComponents(this.components);
      } else {
        this.allComponents = this.addExpressionsToComponents(this.allComponents);
        this.filteredComponents = this.allComponents.filter(c => c && c.variantTypes && c.variantTypes.includes(this.type));
      }
    }
  },

  created() {
    this.showId = !this.hideId;
    this.initializeComponents();
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
}

.column-hide-options {
  display: flex;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;

  .btn-link {
    padding: 0;
  }
}

.right {
  justify-content: flex-end;
}

.dropdown {
  position: absolute;
  background: white;
  padding: 15px;
  top: -0.5rem;
  right: 0;
  z-index: 999999;
  border: rgba(0, 0, 0, 0.15) 1px solid;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
  align-items: center;

  .btn-link {
    padding: 0;
  }
}

.genetic-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
</style>
