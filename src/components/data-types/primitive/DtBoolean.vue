<template>
  <div class="form-group">
    <label :for="localId">{{ label }}</label>
    <div class="form-check">
      <input class="form-check-input" :id="localId + '1'" type="radio" :value="true" v-model="localValue" />
      <label class="form-check-label" :for="localId + '1'"> yes </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" :id="localId + '2'" type="radio" :value="false" v-model="localValue" />
      <label class="form-check-label" :for="localId + '2'"> no </label>
    </div>
  </div>
</template>

<script>
import DtBase from "./DtBase";

export default {
  extends: DtBase
};
</script>
