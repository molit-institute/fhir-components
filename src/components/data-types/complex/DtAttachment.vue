<template>
  <div>
    <div class="form-row">
      <div class="form-group col">
        <label for="localId">photo</label>
        <input type="file" class="form-control" id="localId" placeholder="localPlaceholder" @change="fileChanged" />
      </div>
      <dt-uri label="text" :value.sync="resourceData.url" />
    </div>

    <pre><code>{{resourceData}}</code></pre>
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtUri from "./../primitive/DtUri";

export default {
  extends: BaseDataType,

  methods: {
    async fileChanged(event) {
      let file = event.target.files[0];

      if (file) {
        let data = await this.getBase64(file);

        let attachment = {
          contentType: file.type,
          data: data,
          size: file.size,
          title: file.name,
          creation: new Date().toISOString()
        };
        this.$emit("update:resource", attachment);
      }
    },

    // https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  },

  watch: {
    binary() {}
  },

  components: {
    DtUri
  }
};
</script>

... language Σ 0..1 code Human language of the content (BCP-47) Common Languages (Extensible but limited to All Languages) ... url Σ 0..1 uri Uri where the data can be found ... hash Σ 0..1
base64Binary Hash of the data (sha-1, base64ed)
