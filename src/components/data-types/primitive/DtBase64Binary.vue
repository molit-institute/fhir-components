<template>
  <div class="form-group">
    <label :for="localId">{{ label }}</label>
    <input type="file" class="form-control" :id="localId" :placeholder="localPlaceholder" @change="previewFiles" />
  </div>
</template>

<script>
import DtBase from "./DtBase";

export default {
  extends: DtBase,

  methods: {
    previewFiles(event) {
      console.log(event.target.files);
    }
  }
};
</script>
