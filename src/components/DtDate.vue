<script setup>
import { computed, ref, onMounted } from 'vue'

import dayjs from 'dayjs'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    required: true
  },
  id: null,
  placeholder: {
    type: String
  },
  edit: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  maxValue: {
    type: [String, Number],
    default: null
  },
  minValue: {
    type: [String, Number],
    default: null
  }
})

const localId = ref('')

const localPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder
  } else {
    return props.label
  }
})

const min = computed(() => {
  if (!props.minValue) {
    return null
  }
  return dayjs(props.minValue).format('YYYY-MM-DD')
})

const max = computed(() => {
  if (!props.maxValue) {
    return null
  }
  return dayjs(props.maxValue).format('YYYY-MM-DD')
})

onMounted(() => {
  if (props.id) {
    localId.value = props.id
  } else {
    localId.value = 'id-' + Math.random().toString(36).substr(2, 16)
  }
})
</script>

<template>
  <div class="form-group">
    <label :for="localId" v-if="label">{{ label }}</label>
    <input
      type="date"
      class="form-control"
      v-bind:class="{ 'is-invalid': invalid === true }"
      :id="localId"
      :placeholder="localPlaceholder"
      :value="modelValue"
      v-if="edit"
      :max="max"
      :min="min"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="!edit && modelValue">{{ modelValue }}</div>
    <div v-if="!edit && !modelValue">-</div>
  </div>
</template>
