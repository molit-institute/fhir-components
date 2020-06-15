<template>
  <div>
    <div class="form-row">
      <dt-coding v-for="(value, index) in resourceData.coding" :key="index" :resource="value" :edit="edit" />
      <dt-string label="text" :value.sync="resourceData.text" :edit="edit" />
    </div>

    <pre><code>{{resourceData}}</code></pre>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtCoding from "./DtCoding";
import DtString from "./../primitive/DtString";

export default {
  extends: BaseDataType,

  components: {
    DtCoding,
    DtString
  }
};
</script>
