<template>
  <div class="tx-order-material-choose">
  </div>

</template>

<script>
  export default {
    name: 'materialChoose',
    props: {
    },
    data () {
      return {
      }
    },
    created() {

    },
    methods: {}
  }
</script>

<style>
  .tx-order-material-table .data-list .input input,
  .tx-order-material-table .data-list .input textarea {
    width: 100%;
    height: 100%;
    border: none;
    font-size: 14px;
    resize: none;
  }
</style>
<style scoped>
  .data-list {
    width: 100%;
    border-collapse: collapse;
    border-color: #DDDEE1;
  }

  .data-list th {
    height: 30px;
    background-color: rgb(238, 238, 238);
  }

  .data-list td {
    height: 60px;
    position: relative;
  }

  .data-list .upload-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    opacity: 0;
    background-color: rgba(0, 0, 0, .5);
    transition: all 1s;
    cursor: pointer;
  }

  .data-list .upload-box i {
    font-size: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .data-list td:first-child {
    background-size: cover;
    background-position: center;
  }

  .data-list td:first-child:hover .upload-box {
    opacity: 1;
  }

  .tx-order-material-table .data-list .input {
    width: 20%;
  }
</style>
