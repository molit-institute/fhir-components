<template>
  <div>
    <div v-for="(value, index) in resources" :key="index" class="entry">
      <component :is="type" :resource.sync="value" :edit="edit" class="component" />
      <!-- <button type="button" class="btn btn-link" v-if="edit" @click="resources.push({})">Add</button> -->
      <div v-if="edit">
        <button class="btn btn-link" @click="remove(index)">
          <slot>X</slot>
        </button>
      </div>
    </div>
    <a href="#" v-if="edit" @click="resources.push({})">{{ addString }}</a>
  </div>
</template>

<script>
import DtAddressDeBasis from "../complex/DtAddress-de-basis";
import DtContactPoint from "../complex/DtContactPoint";
import DtHumanNameDeBasis from "../complex/DtHumanName-de-basis";
import DtIdentifier from "../complex/DtIdentifier";

export default {
  props: {
    resources: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    },
    addString: {
      type: String,
      default: "Add"
    }
  },

  watch: {
    resources: {
      handler(newValue) {
        this.$emit("update:resources", newValue);
      },
      deep: true
    }
  },

  methods: {
    remove(index) {
      this.$delete(this.resources, index);
    }
  },

  components: {
    DtAddressDeBasis,
    DtContactPoint,
    DtHumanNameDeBasis,
    DtIdentifier
  }
};
</script>

<style lang="scss" scoped>
.entry {
  display: flex;

  .component {
    flex: 1;
    // border-bottom: 1px solid #e6e6e6;
    margin-bottom: 6px;
  }
}
</style>
