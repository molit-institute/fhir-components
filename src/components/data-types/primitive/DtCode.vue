<template>
  <div>
    <div class="form-group" v-if="edit">
      <label :for="localId" v-if="label">{{ label }}</label>
      <div v-if="valueSet">
        <select class="form-control" :id="localId" v-model="localValue" v-if="inputType === singleChoiceType.SELECT">
          <option disabled selected :value="undefined">{{ selectText }}</option>
          <option v-for="v in valueSet.expansion.contains" :key="v.code" :value="v.code">{{ v.display }}</option>
        </select>
        <div class="form-check" v-for="(v, i) in valueSet.expansion.contains" :key="v.code" v-else>
          <input class="form-check-input" :id="localId + '' + i" type="radio" :value="v.code" v-model="localValue" />
          <label class="form-check-label" :for="localId + '' + i">
            {{ v.display }}
          </label>
        </div>
      </div>
      <!-- <dt-string :label="label" :value.sync="localValue" v-else /> -->
    </div>
    <div v-else class="form-group">
      <label v-if="label" :for="localId">{{ label }}</label>
      <div v-if="localValue">
        {{ localValue }}
      </div>
      <div v-else>
        -
      </div>
    </div>
  </div>
</template>

<script>
import DtBase from "./DtBase";
import singleChoiceType from "./../../../util/enums/single-choice-type.js";

export default {
  extends: DtBase,

  props: {
    valueSet: {
      type: Object
    },
    selectText: {
      type: String,
      default: "Select one"
    },
    inputType: {
      type: Number,
      default: singleChoiceType.SELECT
    }
  },

  computed: {
    singleChoiceType() {
      return singleChoiceType;
    }
  }
};
</script>
