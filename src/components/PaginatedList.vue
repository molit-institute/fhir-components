<script setup>
import * as fhirApi from '@molit/fhir-api'
import debounce from 'debounce'

import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
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
  // Number of pages in the pagination element
  paginationSize: {
    type: Number,
    default: 5
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
    default() {
      return {}
    }
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
  // The attributes that will be used for the search
  searchAttributes: {
    type: Array,
    default() {
      return [
        {
          name: 'ID',
          value: '_id'
        }
      ]
    }
  },
  // Debounce time for search input
  searchDebounceTime: {
    type: Number,
    default: 500
  },
  // Placeholder for search input
  searchInputPlaceholder: {
    type: String,
    default: 'Search..'
  },
  // Whether to use POST for the query instead of GET
  usePostForQuery: {
    type: Boolean,
    default: false
  }
})

const bundle = ref(undefined)
const getpagesoffset = ref(0)
const searchTerm = ref(null)

const currentPage = computed(() => getpagesoffset.value / props.pageCount + 1)
const lastPage = computed(() => Math.ceil(bundle.value.total / props.pageCount))
const params = computed(() => {
  let params = {
    ...props.searchParams,
    _total: 'accurate',
    _getpagesoffset: getpagesoffset.value,
    _count: props.pageCount
  }

  if (searchTerm.value && props.searchAttributes && props.searchAttributes[0]) {
    params[props.searchAttributes[0].value] = searchTerm.value
  } else if (!searchTerm.value && props.searchAttributes && props.searchAttributes[0]) {
    delete params[props.searchAttributes[0].value]
  }

  Object.keys(params).forEach((key) => !params[key] && params[key] === '' && delete params[key])

  return params
})
const firstPageOffset = ref(0)
const prevPageOffset = computed(() => Math.max(getpagesoffset.value - props.pageCount, 0))
const nextPageOffset = computed(() => Math.min(getpagesoffset.value + props.pageCount, bundle.value.total))
const lastPageOffset = computed(() => (lastPage.value - 1) * props.pageCount)

const paginationArray = computed(() => {
  let paginationArray = []

  for (let i = 1; i <= lastPage.value; i++) {
    if (currentPage.value < i + props.paginationSize && currentPage.value > i - props.paginationSize) {
      paginationArray.push(i)
    }
  }

  return paginationArray
})

const initializeView = () => {
  fetchResources()
}

const fetchResources = async () => {
  try {
    emit('updateStart')
    if (props.usePostForQuery) {
      bundle.value = (await fhirApi.fetchResourcesPost(props.fhirBaseUrl, props.resourceName, params.value, props.token)).data
    } else {
      bundle.value = (await fhirApi.fetchResources(props.fhirBaseUrl, props.resourceName, params.value, props.token)).data
    }
  } catch (e) {
    emit('error', e)
    throw new Error(e, 'Could not load FHIR resources.')
  }
}

const navigateToFirstPage = () => {
  getpagesoffset.value = firstPageOffset.value
  initializeView()
}

const navigateToPrevPage = () => {
  getpagesoffset.value = prevPageOffset.value
  initializeView()
}

const navigateToNextPage = () => {
  getpagesoffset.value = nextPageOffset.value
  initializeView()
}

const navigateToLastPage = () => {
  getpagesoffset.value = lastPageOffset.value
  initializeView()
}

const navigateToPage = (pageNumber) => {
  getpagesoffset.value = (pageNumber - 1) * props.pageCount
  initializeView()
}

const keyup = (event) => {
  if (bundle.value && document.activeElement.tagName !== 'INPUT') {
    if (event.code === 'ArrowLeft' && currentPage.value !== 1) {
      navigateToPrevPage()
    } else if (event.code === 'ArrowRight' && currentPage.value !== lastPage.value) {
      navigateToNextPage()
    }
  }
}

const emit = defineEmits(['error', 'updateStart', 'update'])

onMounted(() => {
  initializeView()
  window.addEventListener('keyup', keyup)
})

onUnmounted(() => {
  window.removeEventListener('keyup', keyup)
})

const updateSearch = debounce((e) => {
  searchTerm.value = e.target.value
}, props.searchDebounceTime)

watch(searchTerm, () => navigateToFirstPage())
watch(bundle, (value) => emit('update', value))
watch(() => props.searchParams, () => initializeView, { deep: true })
</script>

<template>
  <div>
    <div class="form-group" v-if="searchable">
      <input class="form-control" @input="updateSearch" :placeholder="searchInputPlaceholder" />
    </div>
    <slot></slot>
    <nav v-if="bundle && bundle.entry && bundle.entry[0] && showPagination">
      <div class="text-muted results-description"></div>
      <ul class="pagination">
        <li :class="['page-item ', { disabled: currentPage === 1 }]">
          <a href="javascript:void(0);" class="page-link" @click="navigateToFirstPage"><slot name="firstPage">&laquo;</slot></a>
        </li>

        <li :class="['page-item ', { disabled: currentPage === 1 }]">
          <a href="javascript:void(0);" class="page-link" @click="navigateToPrevPage"><slot name="previousPage">&lsaquo;</slot></a>
        </li>

        <li class="page-item disabled" v-if="currentPage > paginationSize">
          <a href="javascript:void(0);" class="page-link">...</a>
        </li>

        <li :class="['page-item ', { active: currentPage === n }]" v-for="n in paginationArray" :key="n">
          <a href="javascript:void(0);" class="page-link" @click="navigateToPage(n)">{{ n }}</a>
        </li>

        <li class="page-item disabled" v-if="currentPage < bundle.total / pageCount - (paginationSize - 1)">
          <a href="javascript:void(0);" class="page-link">...</a>
        </li>

        <li :class="['page-item ', { disabled: currentPage === lastPage }]">
          <a href="javascript:void(0);" class="page-link" @click="navigateToNextPage"><slot name="nextPage">&rsaquo;</slot></a>
        </li>

        <li :class="['page-item ', { disabled: currentPage === lastPage }]">
          <a href="javascript:void(0);" class="page-link" @click="navigateToLastPage"><slot name="lastPage">&raquo;</slot></a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
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
