<template>
  <div>
    <div v-if="edit">
      <dt-code label="use" :value.sync="resourceData.use" :valueSet="identifierUse" :edit="edit" />
      <dt-codeable-concept label="type" :resource="resourceData.type" v-if="resourceData.type" :edit="edit" />
      <div class="form-row">
        <dt-uri label="system" class="col-md-6" :value.sync="resourceData.system" :edit="edit" />
        <dt-string label="value" class="col-md-6" :value.sync="resourceData.value" :edit="edit" />
      </div>
      <dt-period label="period" :resource.sync="resourceData.period" :edit="edit" />

      <!-- <pre><code>{{resourceData}}</code></pre> -->
    </div>
    <div v-else>
      <div class="form-row">
        <dt-code label="use" class="col-md-2" :value.sync="resourceData.use" :valueSet="identifierUse" :edit="edit" />
        <dt-uri label="system" class="col-md-5" :value.sync="resourceData.system" :edit="edit" />
        <dt-string label="value" class="col-md-5" :value.sync="resourceData.value" :edit="edit" />
      </div>
    </div>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtCode from "./../primitive/DtCode";
import DtCodeableConcept from "./../complex/DtCodeableConcept";
import DtPeriod from "./../complex/DtPeriod";
import DtString from "./../primitive/DtString";
import DtUri from "./../primitive/DtUri";

import identifierUse from "@/assets/fhir/value-sets/identifier-use.json";

export default {
  extends: BaseDataType,

  props: {
    resource: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  computed: {
    identifierUse() {
      return identifierUse;
    }
  },

  components: {
    BaseDataType,
    DtCode,
    DtCodeableConcept,
    DtPeriod,
    DtString,
    DtUri
  }
};
</script>
