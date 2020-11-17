<template>
  <div>
    <div v-if="edit">
      <div class="form-row">
        <dt-string :label="prefix" class="col-md-2" :value.sync="resourceData.prefix" :edit="edit" />
        <dt-string-array :label="firstname" class="col-md-4" :value.sync="resourceData.given" :edit="edit" />
        <dt-string :label="lastname" class="col-md-4" :value.sync="resourceData.family" :edit="edit" />
        <dt-string-array label="Suffix" class="col-md-2" :value.sync="resourceData.suffix" :edit="edit" />
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
    </div>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtString from "./../primitive/DtString";
import DtStringArray from "./../primitive/DtStringArray";


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
    }
  },
  computed: {
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
    getDisplayForArray(array) {
      if (array && Array.isArray(array)) {
        return array.join(" ");
      } else {
        return "";
      }
    }
  },

  components: {
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
