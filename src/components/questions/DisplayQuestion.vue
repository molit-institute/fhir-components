<template>
  <div>
    <div class="display">
      <h5 class="">{{ question.prefix }} {{ question.text }}</h5>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.display {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}
</style>
<script>
export default {
  props: {
    question: Object,
    mode: null,
    /**
     *  Object containing the translations for the current locale
     */
    language: {
      type: Object
    }
  }
};
</script>
