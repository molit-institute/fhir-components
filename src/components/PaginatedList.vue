<template>
  <div>
    <div class="form-group" v-if="searchable">
      <input class="form-control" @input="updateSearch" :placeholder="searchInputPlaceholder" />
    </div>
    <slot></slot>
    <nav v-if="bundle && bundle.entry && bundle.entry[0] && showPagination">
      <div class="text-muted results-description">
        <!-- <i18n path="showingResults" tag="p">
                    <span place="lower">{{ currentLower }}</span>
                    <span place="upper">{{ currentUpper }}</span>
                    <span place="total">{{ bundle.total }}</span>
        </i18n>-->
      </div>
      <ul class="pagination">
        <li :class="['page-item ', { disabled: currentPage === 1 }]">
          <router-link :to="{ path: currentPath, query: firstPageParams }" class="page-link" v-if="useQueryParams"><slot name="firstPage">&lt;&lt;</slot></router-link>
          <a href="javascript:void(0);" class="page-link" @click="navigateToFirstPage" v-else><slot name="firstPage">&lt;&lt;</slot></a>
        </li>

        <li :class="['page-item ', { disabled: currentPage === 1 }]">
          <router-link :to="{ path: currentPath, query: prevPageParams }" class="page-link" v-if="useQueryParams"><slot name="previousPage">&lt;</slot></router-link>
          <a href="javascript:void(0);" class="page-link" @click="navigateToPrevPage" v-else><slot name="previousPage">&lt;</slot></a>
        </li>

        <li class="page-item disabled" v-if="currentPage > paginationSize">
          <a href="javascript:void(0);" class="page-link">...</a>
        </li>

        <li :class="['page-item ', { active: currentPage === n }]" v-for="n in paginationArray" :key="n">
          <router-link :to="{ path: currentPath, query: getQueryParamsForPage(n, count) }" class="page-link" v-if="useQueryParams">{{ n }}</router-link>
          <a href="javascript:void(0);" class="page-link" @click="navigateToPage(n)" v-else>{{ n }}</a>
        </li>

        <li class="page-item disabled" v-if="currentPage < bundle.total / count - (paginationSize - 1)">
          <a href="javascript:void(0);" class="page-link">...</a>
        </li>

        <li :class="['page-item ', { disabled: currentPage === lastPage }]">
          <router-link :to="{ path: currentPath, query: nextPageParams }" class="page-link" v-if="useQueryParams"><slot name="nextPage">&gt;</slot></router-link>
          <a href="javascript:void(0);" class="page-link" @click="navigateToNextPage" v-else><slot name="nextPage">&gt;</slot></a>
        </li>

        <li :class="['page-item ', { disabled: currentPage === lastPage }]">
          <router-link :to="{ path: currentPath, query: lastPageParams }" class="page-link" v-if="useQueryParams"><slot name="lastPage">&gt;&gt;</slot></router-link>
          <a href="javascript:void(0);" class="page-link" @click="navigateToLastPage" v-else><slot name="lastPage">&gt;&gt;</slot></a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import * as fhirApi from "@molit/fhir-api";
import debounce from "debounce";

// @group Lists
export default {
  props: {
    // The authentication token
    token: {
      type: String,
      default: null
    },
    // Whether to show pagination
    showPagination: {
      type: Boolean,
      default: true
    },
    // The base URL of the FHIR server
    fhirBaseUrl: {
      type: String,
      required: true
    },
    // Number of entries per page
    pageCount: {
      type: Number,
      default: 20
    },
    // Parameters used in fhir query
    searchParams: {
      type: Object,
      // {}
      default() {
        return {};
      }
    },
    // Whether to use url query params
    useQueryParams: {
      type: Boolean,
      default: false
    },
    // Name of the resource
    resourceName: {
      type: String,
      required: true
    },
    // Whether the list is searchable
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
    },
    searchInputPlaceholder: {
      type: String,
      default: "Search.."
    },
    usePostForQuery: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      bundle: undefined,
      getpagesoffset: 0,
      count: 20,
      paginationSize: 5,
      searchTerm: null
    };
  },

  computed: {
    currentPath() {
      return this.$route.path;
    },

    currentPage() {
      return this.getpagesoffset / this.count + 1;
    },

    currentLower() {
      return Math.min(this.getpagesoffset + 1, this.bundle.total);
    },

    currentUpper() {
      return Math.min(this.getpagesoffset + this.count, this.bundle.total);
    },

    lastPage() {
      return Math.ceil(this.bundle.total / this.count);
    },

    params() {
      let params = {
        ...this.searchParams,
        _getpagesoffset: this.getpagesoffset,
        _count: this.count
      };

      if (this.useQueryParams) {
        params = {
          ...params,
          ...this.$route.query
        };
      }

      if (this.searchTerm && this.searchAttributes && this.searchAttributes[0]) {
        params[this.searchAttributes[0].value] = this.searchTerm;
      } else if (!this.searchTerm && this.searchAttributes && this.searchAttributes[0]) {
        delete params[this.searchAttributes[0].value];
      }

      Object.keys(params).forEach(key => !params[key] && params[key] === "" && delete params[key]);

      return params;
    },

    firstPageOffset() {
      return 0;
    },

    prevPageOffset() {
      return Math.max(this.getpagesoffset - this.count, 0);
    },

    nextPageOffset() {
      return Math.min(this.getpagesoffset + this.count, this.bundle.total);
    },

    lastPageOffset() {
      return (this.lastPage - 1) * this.count;
    },

    firstPageParams() {
      return {
        ...this.params,
        _getpagesoffset: this.firstPageOffset
      };
    },

    prevPageParams() {
      return {
        ...this.params,
        _getpagesoffset: this.prevPageOffset
      };
    },

    nextPageParams() {
      return {
        ...this.params,
        _getpagesoffset: this.nextPageOffset
      };
    },

    lastPageParams() {
      return {
        ...this.params,
        _getpagesoffset: this.lastPageOffset
      };
    },

    paginationArray() {
      let paginationArray = [];

      for (let i = 1; i <= this.lastPage; i++) {
        if (this.currentPage < i + this.paginationSize && this.currentPage > i - this.paginationSize) {
          paginationArray.push(i);
        }
      }

      return paginationArray;
    }
  },

  methods: {
    setQueryParams() {
      if (this.$route.query._count != null && this.$route.query._count != undefined) {
        this.count = parseInt(this.$route.query._count);
      }
      if (this.$route.query._getpagesoffset !== null && this.$route.query._getpagesoffset !== undefined) {
        this.getpagesoffset = parseInt(this.$route.query._getpagesoffset);
      }
      if (this.searchAttributes && this.searchAttributes[0] && this.$route.query[this.searchAttributes[0].value]) {
        this.searchTerm = this.$route.query[this.searchAttributes[0].value];
      }
    },

    initializeView() {
      if (this.useQueryParams) {
        this.setQueryParams();
      }
      this.fetchResources();
    },

    async fetchResources() {
      try {
        this.$emit("updateStart");
        if (this.usePostForQuery) {
          this.bundle = (await fhirApi.fetchResourcesPost(this.fhirBaseUrl, this.resourceName, this.params, this.token)).data;
        } else {
          this.bundle = (await fhirApi.fetchResources(this.fhirBaseUrl, this.resourceName, this.params, this.token)).data;
        }
      } catch (e) {
        this.$emit("error", e);
        throw new Error(e, "Could not load FHIR resources.");
      }
    },

    getQueryParamsForPage(pageNumber, count) {
      return {
        ...this.params,
        _getpagesoffset: (pageNumber - 1) * count
      };
    },

    navigateToFirstPage() {
      this.getpagesoffset = 0;
      this.initializeView();
    },

    navigateToPrevPage() {
      this.getpagesoffset = this.prevPageOffset;
      this.initializeView();
    },

    navigateToNextPage() {
      this.getpagesoffset = this.nextPageOffset;
      this.initializeView();
    },

    navigateToLastPage() {
      this.getpagesoffset = this.lastPageOffset;
      this.initializeView();
    },

    navigateToPage(pageNumber) {
      this.getpagesoffset = (pageNumber - 1) * this.count;
      this.initializeView();
    },

    keyup(event) {
      if (this.bundle && document.activeElement.tagName !== "INPUT") {
        if (event.code === "ArrowLeft" && this.currentPage !== 1) {
          if (this.useQueryParams) {
            this.$router.push({
              path: this.currentPath,
              query: this.prevPageParams
            });
          } else {
            this.navigateToPrevPage();
          }
        } else if (event.code === "ArrowRight" && this.currentPage !== this.lastPage) {
          if (this.useQueryParams) {
            this.$router.push({
              path: this.currentPath,
              query: this.nextPageParams
            });
          } else {
            this.navigateToNextPage();
          }
        }
      }
    }
  },

  watch: {
    $route() {
      this.initializeView();
    },
    searchTerm() {
      if (this.useQueryParams) {
        this.$router.push({
          path: this.currentPath,
          query: this.firstPageParams
        });
      } else {
        this.navigateToFirstPage();
      }
    },
    bundle(value) {
      this.$emit("update", value);
    },
    pageCount() {
      this.count = this.pageCount;
      this.initializeView();
    },
    searchParams: {
      deep: true,
      handler() {
        this.initializeView();
      }
    }
  },

  created() {
    this.count = this.pageCount;
    window.addEventListener("keyup", this.keyup);
    this.updateSearch = debounce(e => {
      this.searchTerm = e.target.value;
    }, this.searchDebounceTime);
  },

  mounted() {
    this.initializeView();
  },

  destroyed() {
    window.removeEventListener("keyup", this.keyup);
  }
};
</script>

<style lang="scss" scoped>
.page-item {
  z-index: 2;
}
.pagination {
  justify-content: center;
  margin-top: 1rem;
}

.no-results {
  text-align: center;
  margin-top: 1rem;
}

.results-description {
  text-align: right;
}
</style>
