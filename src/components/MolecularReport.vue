<template>
  <div>
    <div :class="['column-hide-options', { right: columnHideOptionsRight }]" v-if="showColumnHideOptions">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showId" />
        <label class="form-check-label">Id</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showGene" />
        <label class="form-check-label">Gen</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showLocation" />
        <label class="form-check-label">Lokation</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showRegion" />
        <label class="form-check-label">Chromosomale Region</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showReference" />
        <label class="form-check-label">Referenz</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showType" />
        <label class="form-check-label">Typ</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showSource" />
        <label class="form-check-label">Source</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showFunctionalClass" />
        <label class="form-check-label">Funkt. Klasse</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showVariant" />
        <label class="form-check-label">Variante</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showTranscript" />
        <label class="form-check-label">Transkript</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showNaf" />
        <label class="form-check-label">NAF</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showReadDepth" />
        <label class="form-check-label">Read Depth</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showCnvSize" />
        <label class="form-check-label">Variante</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showCopyNumber" />
        <label class="form-check-label">Kopienzahl</label>
      </div>
    </div>
    <table class="table snv-table">
      <thead>
        <tr>
          <th v-if="showId">Id</th>
          <th v-if="showGene && variantType === 'SNV'">Gen</th>
          <th v-if="showLocation && variantType === 'CNV'">Lokation</th>
          <th v-if="showRegion && variantType === 'CNV'">Chromosomale Region</th>
          <th v-if="showReference">Referenz</th>
          <th v-if="showType && variantType === 'SNV'">Typ</th>
          <th v-if="showSource">Source</th>
          <th v-if="showFunctionalClass">Funkt. Klasse</th>
          <th v-if="showVariant && variantType === 'SNV'">Variante</th>
          <th v-if="showTranscript && variantType === 'SNV'">Transkript</th>
          <th v-if="showNaf && variantType === 'SNV'">NAF</th>
          <th v-if="showReadDepth && variantType === 'SNV'">Read Depth</th>
          <th v-if="showCnvSize && variantType === 'CNV'">Variante</th>
          <th v-if="showCopyNumber && variantType === 'CNV'">Kopienzahl</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td v-if="showId">{{ resource.id }}</td>
          <td v-if="showGene && variantType === 'SNV'">
            <a v-if="showOncoKBLinks" :href="`https://oncokb.org/gene/${getValueByLoincCode(resource.component, '48018-6')}`" target="_blank">{{
              getValueByLoincCode(resource.component, "48018-6")
            }}</a>
            <span v-else>{{ getValueByLoincCode(resource.component, "48018-6") }}</span>
          </td>
          <td v-if="showLocation && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "48001-2") }}</td>
          <td v-if="showRegion && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "81254-5") }}</td>
          <td v-if="showReference">{{ getValueByLoincCode(resource.component, "62374-4") }}</td>
          <td v-if="showType && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "48019-4") }}</td>
          <td v-if="showSource">{{ getValueByLoincCode(resource.component, "48002-0") }}</td>
          <td v-if="showFunctionalClass">{{ getValueByLoincCode(resource.component, "functional-annotation") }}</td>
          <td v-if="showVariant && variantType === 'SNV'">
            {{ getValueByLoincCode(resource.component, "48004-6") }}<span v-if="getValueByLoincCode(resource.component, '48004-6')">;</span> {{ getValueByLoincCode(resource.component, "48005-3") }}
          </td>
          <td v-if="showTranscript && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "51958-7") }}</td>
          <td v-if="showNaf && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "81258-6") }}</td>
          <td v-if="showReadDepth && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "82121-5") }}</td>
          <td v-if="showCnvSize && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "cnv-size") }}</td>
          <td v-if="showCopyNumber && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "82155-3") }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import fhirpath from "fhirpath";
import { getValueByLoincCode } from "@molit/fhir-util";

export default {
  props: {
    resources: {
      type: Array,
      default() {
        return [];
      }
    },

    variantType: {
      type: String,
      default: "SNV"
    },

    showColumnHideOptions: {
      type: Boolean,
      default: true
    },

    columnHideOptionsRight: {
      type: Boolean,
      default: true
    },

    hideId: {
      type: Boolean,
      default: false
    },

    hideGene: {
      type: Boolean,
      default: false
    },

    hideLocation: {
      type: Boolean,
      default: false
    },

    hideRegion: {
      type: Boolean,
      default: false
    },

    hideReference: {
      type: Boolean,
      default: false
    },

    hideType: {
      type: Boolean,
      default: false
    },

    hideSource: {
      type: Boolean,
      default: false
    },

    hideFunctionalClass: {
      type: Boolean,
      default: false
    },

    hideVariant: {
      type: Boolean,
      default: false
    },

    hideTranscript: {
      type: Boolean,
      default: false
    },

    hideNaf: {
      type: Boolean,
      default: false
    },

    hideReadDepth: {
      type: Boolean,
      default: false
    },

    hideCnvSize: {
      type: Boolean,
      default: false
    },

    hideCopyNumber: {
      type: Boolean,
      default: false
    },

    showOncoKBLinks: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      columns: [],
      showId: true,
      showGene: true,
      showLocation: true,
      showRegion: true,
      showReference: true,
      showType: true,
      showSource: true,
      showFunctionalClass: true,
      showVariant: true,
      showTranscript: true,
      showNaf: true,
      showReadDepth: true,
      showCnvSize: true,
      showCopyNumber: true
    };
  },

  methods: {
    getValueByLoincCode(components, loincCode) {
      return getValueByLoincCode(components, loincCode);
    }
  },

  mounted() {
    // const a = fhirpath.evaluate({ resourceType: "Patient" }, "Patient.name.given");
    // console.log(a);
    this.showGene = !this.hideGene;
    this.showLocation = !this.hideLocation;
    this.showRegion = !this.hideRegion;
    this.showReference = !this.hideReference;
    this.showType = !this.hideType;
    this.showSource = !this.hideSource;
    this.showFunctionalClass = !this.hideFunctionalClass;
    this.showVariant = !this.hideVariant;
    this.showTranscript = !this.hideTranscript;
    this.showNaf = !this.hideNaf;
    this.showReadDepth = !this.hideReadDepth;
    this.showCnvSize = !this.hideCnvSize;
    this.showCopyNumber = !this.hideCopyNumber;
  }
};
</script>

<style lang="scss" scoped>
.snv-table {
  width: 100%;
}

.column-hide-options {
  display: flex;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}

.right {
  justify-content: flex-end;
}
</style>
