<template>
    <div class="text-xs-center">
        <v-dialog v-model="waitingDialog" persistent width="300">
            <v-card color="primary" dark>
            <v-card-text>Please stand by
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
  name: 'ProgressDialog',
  props: {
    waitingDialog: {
      type: Boolean,
      required: true
    }
  }
}
</script>
