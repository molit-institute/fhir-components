<template>
  <div>
    <div :class="[{ 'molit-modal-dialog': modalDialog }]" @click="modalClicked">
      <div>
        <div class="molit-modal-title" v-if="modalDialog">
          <h5>{{ title }}</h5>
          <div aria-hidden="true" class="close-icon" @click="cancel">×</div>
        </div>
        <div :class="[{ 'molit-modal-dialog-body': modalDialog }]">
          <paginated-list
            :resourceName="resourceName"
            :fhirBaseUrl="fhirBaseUrl"
            :searchAttributes="searchAttributes"
            :searchParams="queryParams"
            :showPagination="false"
            @update="bundleUpdated"
            @error="error"
            class="paginated-list"
          >
            <div class="list-group" v-if="bundle">
              <a
                href="javascript:void(0);"
                @click="setResource(entry.resource)"
                :class="['list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start', { active: selectedResource === entry.resource }]"
                v-for="entry in bundle.entry"
                :key="entry.resource.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">{{ getAttribute(entry.resource, titleAttribute.value, titleAttribute.type) }}</h5>
                </div>
                <p class="mb-1">
                  <span v-for="(attribute, index) in subtitleAttributes" :key="attribute.value">
                    <span v-if="attribute.value && attribute.value !== ''">
                      <span>{{ attribute.name }}: </span>
                      <span>{{ getAttribute(entry.resource, attribute.value, attribute.type) }}</span>
                      <span v-if="index < subtitleAttributes.length - 1"> · </span>
                    </span>
                  </span>
                </p>
              </a>
            </div>
            <div class="spinner-container" v-else>
              <spinner />
            </div>
          </paginated-list>
        </div>
        <div :class="[{ 'molit-modal-dialog-footer': modalDialog }]">
          <button @click="cancel" type="button" class="btn btn-secondary">Cancel</button>
          <button @click="ok" type="button" class="btn btn-primary" :disabled="!selectedResource">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import PaginatedList from "./PaginatedList";
import { getStringFromHumanName } from "@molit/fhir-util";

export default {
  props: {
    resourceName: {
      type: String,
      required: true
    },
    fhirBaseUrl: {
      type: String,
      required: true
    },
    modalDialog: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "Choose..."
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
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
    titleAttribute: {
      type: Object,
      default() {
        return {
          value: "id"
        };
      }
    },
    subtitleAttributes: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      bundle: null,
      selectedResource: null
    };
  },

  methods: {
    bundleUpdated(bundle) {
      this.bundle = bundle;
    },

    setResource(resource) {
      this.selectedResource = resource;
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
        case "date":
        case "Date":
          return new Date(attribute).toLocaleDateString();
        default:
          return attribute;
      }
    },

    cancel() {
      this.$emit("cancel");
    },

    ok() {
      this.$emit("update", this.selectedResource);
    },

    error(e) {
      this.$emit("error", e);
    },

    modalClicked(e) {
      if (this.modalDialog && e.target.className === "molit-modal-dialog") {
        // this.cancel();
      }
    }
  },

  components: {
    PaginatedList,
    Spinner
  }
};
</script>

<style lang="scss" scoped>
.molit-modal-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.4);

  & > div {
    margin: 1rem;
    background: white;
    height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.molit-modal-title {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h5 {
    margin: 0;
  }
}

.molit-modal-dialog-body {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  flex: 1;
  overflow: hidden;
}

.paginated-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.molit-modal-dialog-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;

  button:last-child {
    margin-left: 0.125rem;
  }

  button:first-child {
    margin-right: 0.125rem;
  }
}

.list-group {
  overflow-y: auto;
}

.close-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;

  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>
