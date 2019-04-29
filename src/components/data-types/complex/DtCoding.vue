<template>
  <div>
    <div class="form-row">
      <dt-uri label="system" :value.sync="resourceData.system" :edit="edit" />
      <dt-string label="version" :value.sync="resourceData.version" :edit="edit" />
      <dt-code label="code" :value.sync="resourceDate.code" :edit="edit" />
      <dt-string label="display" :value.sync="resourceDate.display" :edit="edit" />
      <dt-boolean label="userSelected" :value.sync="resourceData.userSelected" :edit="edit" />
    </div>

    <pre><code>{{resourceData}}</code></pre>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtBoolean from "./../primitive/DtBoolean";
import DtCode from "./../primitive/DtCode";
import DtString from "./../primitive/DtString";
import DtUri from "./../primitive/DtUri";

export default {
  extends: BaseDataType,

  components: {
    BaseDataType,
    DtBoolean,
    DtCode,
    DtString,
    DtUri
  }
};
</script>
