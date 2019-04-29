<template>
  <div>
    <paginated-list
      :resourceName="resourceName"
      :fhirBaseUrl="fhirBaseUrl"
      :searchParams="searchParams"
      :pageCount="pageCount"
      :searchAttributes="searchAttributes"
      :sortable="sortable"
      :sortAttributes="sortAttributes"
      :searchDebounceTime="searchDebounceTime"
      :useQueryParams="useQueryParams"
      :searchable="searchable"
      @update="bundleUpdated"
    >
      <div class="card list-data">
        <div class="loading" v-if="!bundle">
          <spinner />
        </div>
        <div class="no-results" v-if="bundle && !bundle.entry">
          <!-- {{ $t('noResourcesFound') }} -->
        </div>
        <ul class="list-group list-group-flush" v-else-if="bundle">
          <list-item
            @view="$emit('view', entry.resource)"
            :viewBehavior="viewBehavior"
            v-for="entry in bundle.entry"
            :key="entry.resource.id"
            :title="getAttributesAsString(entry.resource, titleAttributes)"
            :subtitle="getAttributesAsString(entry.resource, subtitleAttributes)"
            :urlView="detailPageName + '/' + entry.resource.id"
          >
          </list-item>
        </ul>
      </div>
    </paginated-list>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import ListItem from "./ListItem";
import PaginatedList from "./PaginatedList";

import { getStringFromHumanName } from "@molit/fhir-util";

export default {
  props: {
    fhirBaseUrl: {
      type: String,
      required: true
    },
    pageCount: {
      type: Number,
      default: 20
    },
    searchParams: {
      type: Object,
      default() {
        return {};
      }
    },
    useQueryParams: {
      type: Boolean,
      default: false
    },
    resourceName: {
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
    subtitleAttributes: {
      type: Array,
      default() {
        return [];
      }
    },
    sortable: {
      type: Boolean,
      default: false
    },
    sortAttributes: {
      type: Array,
      default() {
        return [
          {
            name: "ID",
            value: "_id"
          }
        ];
      }
    },
    searchable: {
      type: Boolean,
      default: true
    },
    searchAttributes: {
      type: Array,
      default() {
        return [
          {
            name: "ID",
            value: "_id"
          }
        ];
      }
    },
    searchDebounceTime: {
      type: Number,
      default: 500
    },
    detailPageName: {
      type: String
    },
    viewBehavior: {
      type: String,
      default: "href"
    }
  },

  data() {
    return {
      bundle: null
    };
  },

  methods: {
    bundleUpdated(bundle) {
      this.bundle = bundle;
    },

    byString: function(o, s) {
      s = s.replace(/\[(\w+)\]/g, ".$1"); // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
      s = s.replace(/^\./, "");
      var a = s.split(".");
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    },

    getAttribute(resource, attributeName, attributeType) {
      if (!resource) {
        return "";
      } else if (!attributeName) {
        return resource.id;
      }

      let attribute = this.byString(resource, attributeName);

      switch (attributeType) {
        case "HumanName":
          return getStringFromHumanName(attribute);
        default:
          return attribute;
      }
    },

    getAttributesAsString(resource, attributes) {
      return attributes.map(attribute => this.getAttribute(resource, attribute.value, attribute.type)).join(" ");
    }
  },

  components: {
    ListItem,
    PaginatedList,
    Spinner
  }
};
</script>

<style lang="scss" scoped>
.no-results {
  text-align: center;
  margin-top: 1rem;
}

.results-description {
  text-align: right;
}
</style>
