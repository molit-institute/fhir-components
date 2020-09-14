<template>
  <div>
    <div class="class option-card">
      <div class="labels">
        <p>No Pain</p>
        <p>Worst Pain Ever</p>
      </div>
      <input name="vas" type="range" :min="min" :max="max" step="0.1" class="range" :value="selected / 10" @input="$emit('selected-value', value * 10)" />
      <!--  v-model="selected"-->
      <div class="sliderticks">
        <p v-for="n in range" :key="n">{{ n }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin basic-card {
  border-radius: 20px;
  border: 0;
}

.card {
  @include basic-card;
}

.option-card {
  margin-top: 3px;
}

.range {
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 90%;
  margin-top: 10px;
  margin-left: 5%;
}

input[type="range"] {
  &::-webkit-slider-runnable-track {
    //defines gradient in webkit Browser (Chrome)
    -webkit-appearance: none;
    background: rgba(59, 173, 227, 1);
    background: -moz-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 98, 1) 44%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: -webkit-gradient(
      left bottom,
      right top,
      color-stop(0%, rgba(16, 158, 0, 1)),
      color-stop(44%, rgba(242, 237, 98, 1)),
      color-stop(47%, rgba(242, 237, 38, 1)),
      color-stop(70%, rgba(250, 155, 2, 1)),
      color-stop(82%, rgba(251, 125, 2, 1)),
      color-stop(100%, rgba(255, 0, 0, 1))
    );
    background: -webkit-linear-gradient(
      45deg,
      rgba(16, 158, 0, 1) 0%,
      rgba(242, 237, 98, 1) 44%,
      rgba(242, 237, 38, 1) 47%,
      rgba(250, 155, 2, 1) 70%,
      rgba(251, 125, 2, 1) 82%,
      rgba(255, 0, 0, 1) 100%
    );
    background: -o-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 98, 1) 44%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: -ms-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 98, 1) 44%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 98, 1) 44%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 22px;
  }

  &:focus {
    outline: none;
  }

  &::-moz-range-track {
    // defines gradient in Firefox
    -moz-appearance: none;
    background: rgba(59, 173, 227, 1);
    background: -moz-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: -webkit-gradient(
      left bottom,
      right top,
      color-stop(0%, rgba(16, 158, 0, 1)),
      color-stop(47%, rgba(242, 237, 38, 1)),
      color-stop(70%, rgba(250, 155, 2, 1)),
      color-stop(82%, rgba(251, 125, 2, 1)),
      color-stop(100%, rgba(255, 0, 0, 1))
    );
    background: -webkit-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: -o-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: -ms-linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    background: linear-gradient(45deg, rgba(16, 158, 0, 1) 0%, rgba(242, 237, 38, 1) 47%, rgba(250, 155, 2, 1) 70%, rgba(251, 125, 2, 1) 82%, rgba(255, 0, 0, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 22px;
  }

  &::-webkit-slider-thumb {
    //defines slider in webkit Browser (Chrome)
    -webkit-appearance: none;
    border: 2px solid #474747;
    height: 26px;
    width: 15px;
    max-width: 80px;
    position: relative;
    bottom: 2px;
    background-color: none;
    cursor: -webkit-grab;
    -webkit-transition: border 1000ms ease;
    transition: border 1000ms ease;
  }
  &::-moz-range-thumb {
    // defines slider in Firefox
    -moz-appearance: none;
    border: 2px solid #474747;
    height: 26px;
    width: 15px;
    max-width: 80px;
    position: relative;
    bottom: 2px;
    background-color: none;
    cursor: -moz-grab;
    -moz-transition: border 1000ms ease;
    transition: border 1000ms ease;
  }
}
.sliderticks {
  display: flex;
  width: 91%;
  margin-left: 4.5%;
  justify-content: space-between;
  padding: 0 10px;

  p {
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 1px;
    background: #d3d3d3;
    height: 10px;
    line-height: 40px;
    margin: 0 0 20px 0;
  }
}
.labels {
  display: flex;
  width: 90%;
  margin-left: 5%;
  justify-content: space-between;
  padding: 0 10px;

  p {
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
    height: 10px;
    // margin: 0 0 20px 0;
  }
}
</style>

<script>
export default {
  props: {
    selected: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: this.selected
    };
  },
  computed: {
    min() {
      return 0; //fhir-minValue?
    },
    max() {
      return 10; //fhir-minValue?
      // return this.question.answerOption[question.answerOption.length-1].valueString;
    },
    range() {
      let range = [];
      for (let i = this.min; i < this.max + 1; i++) {
        range = [...range, i];
      }
      return range;
    }
  }
};
</script>
