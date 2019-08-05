<template>
  <div>
    <div class="column-hide-options" v-if="showColumnHideOptions">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="showGene" v-model="showGene" />
        <label class="form-check-label" for="showGene">Gen</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="showLocation" v-model="showLocation" />
        <label class="form-check-label" for="showLocation">Lokation</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="showReference" v-model="showReference" />
        <label class="form-check-label" for="showReference">Referenz</label>
      </div>
    </div>
    <table class="table snv-table">
      <thead>
        <tr>
          <th v-if="showGene">Gen</th>
          <th v-if="showLocation">Lokation</th>
          <th v-if="showReference">Referenz</th>
          <th>Typ</th>
          <th>Source</th>
          <th>Funkt. Klasse</th>
          <th>Variante</th>
          <th>Transkript</th>
          <th>NAF</th>
          <th>Read Depth</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td v-if="showGene">
            <a v-if="showOncoKBLinks" :href="`https://oncokb.org/gene/${getValueByLoincCode(resource.component, '48018-6')}`" target="_blank">{{
              getValueByLoincCode(resource.component, "48018-6")
            }}</a>
            <span v-else>{{ getValueByLoincCode(resource.component, "48018-6") }}</span>
          </td>
          <td v-if="showLocation">{{ getValueByLoincCode(resource.component, "48001-2") }}</td>
          <td v-if="showReference">{{ getValueByLoincCode(resource.component, "62374-4") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48019-4") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48002-0") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48006-1") }}</td>
          <td>
            {{ getValueByLoincCode(resource.component, "48004-6") }}<span v-if="getValueByLoincCode(resource.component, '48004-6')">;</span> {{ getValueByLoincCode(resource.component, "48005-3") }}
          </td>
          <td>{{ getValueByLoincCode(resource.component, "51958-7") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "81258-6") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "82121-5") }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import fhirpath from "fhirpath";

export default {
  props: {
    resources: {
      type: Array,
      default() {
        return [];
      }
    },

    showColumnHideOptions: {
      type: Boolean,
      default: true
    },

    hideGene: {
      type: Boolean,
      default: false
    },

    hideLocation: {
      type: Boolean,
      default: true
    },

    hideReference: {
      type: Boolean,
      default: true
    },

    showOncoKBLinks: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      columns: [],
      showGene: true,
      showLocation: false,
      showReference: false
    };
  },

  methods: {
    getValueByLoincCode(components, loincCode) {
      if (!components || !components.length) {
        return undefined;
      }

      let component = components.find(component => {
        if (!component || !component.code || !component.code.coding || !component.code.coding.length) {
          return undefined;
        }
        let code = component.code.coding.find(code => code.system === "http://loinc.org");
        if (!code) {
          return undefined;
        }
        return code.code === loincCode;
      });

      if (!component) {
        return undefined;
      }

      if (component.valueCodeableConcept && component.valueCodeableConcept.coding && component.valueCodeableConcept.coding.length) {
        return component.valueCodeableConcept.coding[0].display;
      } else if (component.valueQuantity) {
        return component.valueQuantity.value;
      }
    }
  },

  mounted() {
    // const a = fhirpath.evaluate({ resourceType: "Patient" }, "Patient.name.given");
    // console.log(a);
    this.showGene = !this.hideGene;
    this.showLocation = !this.hideLocation;
    this.showReference = !this.hideReference;
  }
};
</script>

<style lang="scss" scoped>
.snv-table {
  width: 100%;
}

.column-hide-options {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}
</style>
