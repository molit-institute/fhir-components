<template>
  <div>
    <div :class="['column-hide-options', { right: columnHideOptionsRight }]" v-if="showColumnHideOptions">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showId" />
        <label class="form-check-label">Id</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showGene" />
        <label class="form-check-label">Gene Symbol</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showLocation" />
        <label class="form-check-label">Location</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showRegion" />
        <label class="form-check-label">Region</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showEffect" />
        <label class="form-check-label">Effect</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showReference" />
        <label class="form-check-label">Reference</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showType" />
        <label class="form-check-label">DNA Change Type</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="showSource" />
        <label class="form-check-label">Genomic Source Class</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showFunctionalClass" />
        <label class="form-check-label">Functional Class</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showVariant" />
        <label class="form-check-label">DNA Change (c.HGVS)</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showTranscript" />
        <label class="form-check-label">Transcript</label>
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
        <label class="form-check-label">Variant</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'CNV'">
        <input class="form-check-input" type="checkbox" v-model="showCopyNumber" />
        <label class="form-check-label">Copy Number</label>
      </div>
      <div class="form-check form-check-inline" v-if="variantType === 'SNV'">
        <input class="form-check-input" type="checkbox" v-model="showLinks" />
        <label class="form-check-label">Links</label>
      </div>
    </div>
    <table class="table snv-table">
      <thead>
        <tr>
          <th v-if="showId">Id</th>
          <th v-if="showGene && variantType === 'SNV'">Gene Symbol</th>
          <th v-if="showLocation && variantType === 'CNV'">Location</th>
          <th v-if="showRegion && variantType === 'CNV'">Region</th>
          <th v-if="showEffect && variantType === 'CNV'">Effect</th>
          <th v-if="showReference">Reference</th>
          <th v-if="showType && variantType === 'SNV'">DNA Change Type</th>
          <th v-if="showSource">Genomic Source Class</th>
          <th v-if="showFunctionalClass && variantType === 'SNV'">Functional Class</th>
          <th v-if="showVariant && variantType === 'SNV'">DNA Change (c.HGVS)</th>
          <th v-if="showTranscript && variantType === 'SNV'">Transcript</th>
          <th v-if="showNaf && variantType === 'SNV'">NAF</th>
          <th v-if="showReadDepth && variantType === 'SNV'">Read Depth</th>
          <th v-if="showCnvSize && variantType === 'CNV'">Variant</th>
          <th v-if="showCopyNumber && variantType === 'CNV'">Copy Number</th>
          <th v-if="showLinks && variantType === 'SNV'">Links</th>
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
          <td v-if="showEffect && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "effect") }}</td>
          <td v-if="showReference">{{ getValueByLoincCode(resource.component, "62374-4") }}</td>
          <td v-if="showType && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "48019-4") }}</td>
          <td v-if="showSource">{{ getValueByLoincCode(resource.component, "48002-0") }}</td>
          <td v-if="showFunctionalClass && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "functional-annotation") }}</td>
          <td v-if="showVariant && variantType === 'SNV'">
            {{ getValueByLoincCode(resource.component, "48004-6") }}<span v-if="getValueByLoincCode(resource.component, '48005-3')">;</span> {{ getValueByLoincCode(resource.component, "48005-3") }}
          </td>
          <td v-if="showTranscript && variantType === 'SNV'">
            <a v-if="showNCBILinks" :href="`https://www.ncbi.nlm.nih.gov/nuccore/${getValueByLoincCode(resource.component, '51958-7')}`" target="_blank">{{
              getValueByLoincCode(resource.component, "51958-7")
            }}</a>
            <span v-else>{{ getValueByLoincCode(resource.component, "51958-7") }}</span>
          </td>
          <td v-if="showNaf && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "81258-6") ? getValueByLoincCode(resource.component, "81258-6").toFixed(nafDecimalPlaces) : "" }}</td>
          <td v-if="showReadDepth && variantType === 'SNV'">{{ getValueByLoincCode(resource.component, "82121-5") }}</td>
          <td v-if="showCnvSize && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "cnv-size") }}</td>
          <td v-if="showCopyNumber && variantType === 'CNV'">{{ getValueByLoincCode(resource.component, "82155-3") }}</td>
          <td v-if="showLinks && variantType === 'SNV'">
            <a
              v-if="showOncoKBLinks"
              :href="`https://www.cbioportal.org/results/cancerTypesSummary?case_set_id=all&gene_list=${getValueByLoincCode(resource.component, '48018-6')}&cancer_study_list=5c8a7d55e4b046111fee2296`"
              target="_blank"
              >cBioPortal</a
            >
          </td>
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

    hideEffect: {
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

    hideLinks: {
      type: Boolean,
      default: false
    },

    showOncoKBLinks: {
      type: Boolean,
      default: true
    },

    showNCBILinks: {
      type: Boolean,
      default: true
    },

    nafDecimalPlaces: {
      type: Number,
      default: 4
    }
  },

  data() {
    return {
      columns: [],
      showId: true,
      showGene: true,
      showLocation: true,
      showRegion: true,
      showEffect: true,
      showReference: true,
      showType: true,
      showSource: true,
      showFunctionalClass: true,
      showVariant: true,
      showTranscript: true,
      showNaf: true,
      showReadDepth: true,
      showCnvSize: true,
      showCopyNumber: true,
      showLinks: true
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
    this.showLinks = !this.hideLinks;
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
