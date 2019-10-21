<template>
  <div class="qtable">
    <table border="0" cellspacing="0">
      <tbody>
        <tr>
          <th>题目</th>
          <th>答案</th>
          <th>对/错</th>
          <th v-if="showRate">正确率</th>
        </tr>
        <tr v-for="(question, index) in questions" :key="index">
          <td :class="{wrong: !question.result}">{{ question.title }}</td>
          <td>{{ question.rightAnswer }}</td>
          <td
            :style="{color: question.result ? '#229110': '#e85f5f'}"
          >{{ question.result ? '答对': '答错' }}</td>
          <td v-if="showRate" :style="{color: question.rate>0.5 ? '#5f8ae8' : '#e85f5f'}">{{ question.rate !==undefined ? question.rate*100 + '%': '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    questions: {
      type: Array,
      default: {}
    },
    showRate: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.wrong {
  position: relative;
}
.wrong:before {
  content: "";
  position: absolute;
  // border: 1px solid red;
  height: 16px;
  width: 16px;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  background: url(../../../static/icon/error.png) no-repeat center;
  background-size: cover;
}
table {
  width: 100%;
  text-align: center;
  tr {
    border: 1px solid #7a7a7a;
    th:first-child,
    td:first-child {
      padding-left: 20px;
    }
  }
  td {
    background: #f8f8f8;
    color: black;
  }
  td,
  th {
    font-size: 12.4px;
    line-height: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
  td:nth-child(1) {
    
    width: 40%;
  }
  td:nth-child(2) {
    width: 25%;
  }
  td:nth-child(3) {
    width: 18%;
  }
  td:nth-child(4) {
    width: 17%;
  }
}
</style>