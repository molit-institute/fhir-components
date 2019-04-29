<template>
  <div class="resource-form">
    <h2>Patient</h2>

    <fieldset>
      <label>Name</label>
      <dt-array :resources.sync="resourceData.name" type="DtHumanName-de-basis" :edit="editMode" />
    </fieldset>

    <dt-date :value.sync="resourceData.birthDate" :edit="editMode" label="Geburtsdatum" />
    <dt-code :value.sync="resourceData.gender" :edit="editMode" label="gender" :valueSet="administrativeGender" />

    <fieldset>
      <label>Identifier</label>
      <dt-array :resources.sync="resourceData.identifier" type="DtIdentifier" :edit="editMode" />
    </fieldset>

    <dt-boolean :value.sync="resourceData.active" :edit="editMode" label="active" />

    <fieldset>
      <label>Telecom</label>
      <dt-array :resources.sync="resourceData.telecom" type="DtContactPoint" :edit="editMode" />
    </fieldset>

    <fieldset>
      <label>Adresse</label>
      <dt-array :resources.sync="resourceData.address" type="DtAddress-de-basis" :edit="editMode" />
    </fieldset>

    <!-- <dt-attachment :edit="editMode" :resource.sync="resourceData.photo" /> -->

    <button class="btn btn-secondary" @click="toggleEditMode">Edit</button>

    <!-- <code>
      <pre>{{ resourceData }}</pre>
    </code> -->
  </div>
</template>

<script>
import BaseResource from "./BaseResource";
import DtArray from "../data-types/helper/DtArray";
import DtAttachment from "../data-types/complex/DtAttachment";
import DtBoolean from "../data-types/primitive/DtBoolean";
import DtCode from "../data-types/primitive/DtCode";
import DtDate from "../data-types/primitive/DtDate";

import administrativeGender from "@/assets/fhir/value-sets/administrative-gender.json";

export default {
  extends: BaseResource,

  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editMode: false
    };
  },

  computed: {
    administrativeGender() {
      return administrativeGender;
    }
  },

  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    }
  },

  created() {
    this.editMode = this.edit;
  },

  components: {
    DtArray,
    DtAttachment,
    DtBoolean,
    DtCode,
    DtDate
  }
};
</script>
