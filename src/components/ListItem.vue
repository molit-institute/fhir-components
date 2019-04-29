<template>
  <li class="list-group-item">
    <div class="avatar">
      {{ title[0] }}
    </div>
    <div>
      <div class="title">
        <a v-if="viewBehavior === 'href'" :href="urlView">{{ title }}</a>
        <a v-else @click="$emit('view')" href="javascript:void(0);">{{ title }}</a>
      </div>
      <div>{{ subtitle }}</div>
    </div>
    <div class="actions">
      <a :href="urlEdit" @click="$emit('edit')">
        <i class="fas fa-pencil-alt"></i>
      </a>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String
    },
    icon: {
      type: String,
      default: ""
    },
    urlView: {
      type: String
    },
    urlEdit: {
      type: String
    },
    viewBehavior: {
      type: String,
      default: "href"
    }
  }
};
</script>

<style lang="scss" scoped>
.list-group-item {
  display: flex;
  align-items: center;

  .title {
    font-weight: 600;
  }

  .avatar {
    border-radius: 50%;
    margin-right: 1.1rem;
    font-size: 1.1rem;
    color: white;
    width: 40px;
    min-width: 40px;
    height: 40px;
    background: #3498db;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
