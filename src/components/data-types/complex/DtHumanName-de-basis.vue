<template>
  <div>
    <div v-if="edit">
      <div class="form-row" v-if="viewUse">
        <dt-code label="Use" class="col-md-12" :value.sync="resourceData.use" :valueSet="nameUse" :edit="edit" />
      </div>
      <div class="form-row">
        <dt-string :label="prefix" class="col-md-2" :value.sync="resourceData.prefix" :edit="edit" :invalid="prefixInvalid" />
        <dt-string-array :label="firstname" class="col-md-4" :value.sync="resourceData.given" :edit="edit" :invalid="firstnameInvalid"/>
        <dt-string :label="lastname" class="col-md-4" :value.sync="resourceData.family" :edit="edit" :invalid="lastnameInvalid"/>
        <dt-string-array label="Suffix" class="col-md-2" :value.sync="resourceData.suffix" :edit="edit" :invalid="suffixInvalid"/>
      </div>

      <!-- <div class="form-group">
        <label for="hn-text">Text</label>
        <input disabled type="text" class="form-control" id="hn-text" placeholder="Text" v-model="resourceData.text">
      </div> -->

      <!-- <pre><code>{{resourceData}}</code></pre> -->
    </div>
    <div v-else>
      <div>
        {{ getDisplayForArray(resourceData.prefix) }}
        {{ getDisplayForArray(resourceData.given) }} {{ resourceData.family }}
        {{ getDisplayForArray(resourceData.suffix) }}
      </div>
      <div class="text-muted" v-if="viewUse">
        {{ getDisplayForCode(nameUse, resourceData.use) }}
      </div>
    </div>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtCode from "./../primitive/DtCode";
import DtString from "./../primitive/DtString";
import DtStringArray from "./../primitive/DtStringArray";

import nameUse from "@/assets/fhir/value-sets/name-use.json";

export default {
  extends: BaseDataType,
  props: {
    firstname: {
      type: String,
      default: "Firstname"
    },
    lastname: {
      type: String,
      default: "Lastname"
    },
    prefix: {
      type: String,
      default: "Prefix"
    },
    viewUse: {
      type: Boolean,
      default: false
    },
    firstnameInvalid: {
      type: Boolean,
      default: false
    },
    lastnameInvalid: {
      type: Boolean,
      default: false
    },
    prefixInvalid: {
      type: Boolean,
      default: false
    },
    suffixInvalid: {
      type: Boolean,
      default: false
    }

  },
  computed: {
    nameUse() {
      return nameUse;
    }

    // text() {
    //   return this.resourceData
    //     ? this.resourceData.prefix +
    //         " " +
    //         this.resourceData.given.join(" ") +
    //         " " +
    //         this.resourceData.family
    //     : "";
    // }
  },

  watch: {
    text(newText) {
      this.resourceData.text = newText;
    }
  },

  methods: {
    getDisplayForCode(valueSet, code) {
      let valueSetItem = valueSet.expansion.contains.find(v => v.code === code);
      if (valueSetItem) {
        return valueSetItem.display;
      }
      return undefined;
    },

    getDisplayForArray(array) {
      if (array && Array.isArray(array)) {
        return array.join(" ");
      } else {
        return "";
      }
    }
  },

  components: {
    DtCode,
    DtString,
    DtStringArray
  }
};
</script>

<style lang="scss" scoped>
label {
  font-size: smaller;
  font-weight: bold;
  margin-bottom: 0.1em;
  color: rgba(0, 0, 0, 0.6) !important;
}

.text-muted {
  font-size: smaller;
}
</style>
