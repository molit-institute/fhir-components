<template>
  <div class="form-row">
    <div class="form-group col-md-4">
      <label :for="localId">{{ label }}</label>
      <input type="date" class="form-control" :id="localId" v-model="localValue" />
    </div>
    <div class="form-group col-md-2">
      <label :for="localId">&nbsp;</label>
      <input type="time" class="form-control" />
    </div>
    <div class="form-group col-md-6">
      <label :for="localId">&nbsp;</label>
      <select class="form-control">
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";

import DtBase from "./DtBase";

export default {
  extends: DtBase,

  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
      }
    }
  },

  created() {
    this.type = "date";
    console.log(moment);
  }
};
</script>
