<template>
  <div>
    <v-snackbar
      v-model="toastVisible"
      bottom
      right
      :titemout="1000"
      color="dark"
    >
      {{ msg }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    toastVisible: false,
    msgAlert: "",
  },

  data() {
    return {
      internalToastVisible: this.toastVisible,
      msg: this.msgAlert,
    };
  },

  methods: {
    setValueFromParent(toastVisible, msgAlert) {
      (this.internalToastVisible = toastVisible), (this.msg = msgAlert);
    },
  },
};
</script>
