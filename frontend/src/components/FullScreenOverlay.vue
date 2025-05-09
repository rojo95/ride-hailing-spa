<template>
    <v-overlay :model-value="modelValue" class="z-50 align-center justify-center" persistent>
        <div class="text-center text-white text-h6">
            <v-progress-circular indeterminate color="white" size="100" />
        </div>
    </v-overlay>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean;
}>();
</script>

<style scoped>
.v-overlay {
    position: fixed !important;
}
</style>
