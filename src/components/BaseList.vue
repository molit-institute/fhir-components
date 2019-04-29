<template>
  <list-view
    @view="$emit('view', $event)"
    :viewBehavior="viewBehavior"
    :fhirBaseUrl="fhirBaseUrl"
    :resourceName="resourceName"
    :titleAttributes="titleAttributes"
    :subtitleAttributes="subtitleAttributes"
    :sortAttributes="sortAttributes"
    :searchAttributes="searchAttributes"
    :detailPageName="detailPageName"
    :useQueryParams="useQueryParams"
  />
</template>

<script>
import ListView from "./ListView";

export default {
  props: {
    fhirBaseUrl: {
      type: String,
      required: true
    },
    titleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "id",
            type: ""
          }
        ];
      }
    },
    useQueryParams: {
      type: Boolean,
      default: false
    },
    subtitleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "id",
            type: ""
          }
        ];
      }
    },
    viewBehavior: {
      type: String,
      default: "href"
    }
  },

  data() {
    return {
      resourceName: "",
      sortAttributes: [
        {
          name: "Id",
          value: "_id"
        }
      ]
    };
  },

  components: {
    ListView
  }
};
</script>
