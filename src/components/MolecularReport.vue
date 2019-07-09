<template>
  <div>
    <table class="snv-table">
      <thead>
        <tr>
          <th>Gen</th>
          <th>Lokation</th>
          <th>Referenz</th>
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
        <tr>
          <td>{{ getValueByLoincCode(resource.component, "48018-6") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48001-2") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "62374-4") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48019-4") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48002-0") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48006-1") }}</td>
          <td>{{ getValueByLoincCode(resource.component, "48004-6") }}; {{ getValueByLoincCode(resource.component, "48005-3") }}</td>
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
    resource: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      columns: []
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
  }
};
</script>

<style lang="scss" scoped>
.snv-table {
  width: 100%;
}
</style>
