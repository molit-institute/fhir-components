<template>
  <div>
    <div class="form-row">
      <dt-code label="use" :value.sync="resourceData.use" :valueSet="addressUse" :edit="edit" class="col-md-6" />
      <dt-code label="type" :value.sync="resourceData.type" :valueSet="addressType" :edit="edit" class="col-md-6" />
    </div>

    <div class="form-row">
      <dt-string label="postalCode" :value.sync="resourceData.postalCode" :edit="edit" class="col-md-3" />
      <dt-string label="city" :value.sync="resourceData.city" :edit="edit" class="col-md-9" />
    </div>
    <dt-string label="state" :value.sync="resourceData.state" :edit="edit" />
    <dt-string label="country" :value.sync="resourceData.country" :edit="edit" />
    <dt-period :resource.sync="resourceData.period" :edit="edit" />

    <!-- <pre><code>{{resourceData}}</code></pre> -->
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtCode from "./../primitive/DtCode";
import DtPeriod from "./../complex/DtPeriod";
import DtString from "./../primitive/DtString";

import addressUse from "@/assets/fhir/value-sets/address-use.json";
import addressType from "@/assets/fhir/value-sets/address-type.json";

export default {
  extends: BaseDataType,

  computed: {
    addressUse() {
      return addressUse;
    },

    addressType() {
      return addressType;
    }
  },

  components: {
    DtCode,
    DtPeriod,
    DtString
  }
};
</script>
