<template>
  <div>
    <dt-code label="use" :value.sync="resourceData.use" :valueSet="contactPointUse" :edit="edit" />
    <div class="form-row">
      <dt-code label="system" class="col-md-6" :value.sync="resourceData.system" :valueSet="contactPointSystem" :edit="edit" />
      <dt-string label="value" class="col-md-6" :value.sync="resourceData.value" :edit="edit" />
    </div>
    <dt-period label="period" :resource.sync="resourceData.period" :edit="edit" />

    <pre><code>{{resourceData}}</code></pre>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtCode from "./../primitive/DtCode";
import DtPeriod from "./../complex/DtPeriod";
import DtString from "./../primitive/DtString";

import contactPointSystem from "@/assets/fhir/value-sets/contact-point-system.json";
import contactPointUse from "@/assets/fhir/value-sets/contact-point-use.json";

export default {
  extends: BaseDataType,

  computed: {
    contactPointSystem() {
      return contactPointSystem;
    },
    contactPointUse() {
      return contactPointUse;
    }
  },

  components: {
    BaseDataType,
    DtCode,
    DtPeriod,
    DtString
  }
};
</script>
