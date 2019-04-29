<template>
  <div class="form-group">
    <label :for="localId" v-if="label">{{ label }}</label>
    <input :type="type" class="form-control" :id="localId" :placeholder="localPlaceholder" v-model="localValue" v-if="edit" />
    <div v-if="!edit && localValue">{{ localValue }}</div>
    <div v-if="!edit && !localValue">-</div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    id: null,
    placeholder: {
      type: String
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      type: "text",
      localId: ""
    };
  },

  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
      }
    },

    localPlaceholder() {
      if (this.placeholder) {
        return this.placeholder;
      } else {
        return this.label;
      }
    }
  },

  created() {
    if (this.id) {
      this.localId = this.id;
    } else {
      this.localId =
        "id-" +
        Math.random()
          .toString(36)
          .substr(2, 16);
    }
  }
};
</script>
