<script setup lang="ts">
import { useGreetStore } from '@/stores/greet';

const greeter = useGreetStore()
</script>

<template>
  <section class="home-view">
    <form @submit.prevent="greeter.sayHello">
      <div class="form-container">
        <input v-model="greeter.name" autofocus placeholder="your name" :disabled="greeter.processing">
        <button type="submit" :disabled="greeter.processing">submit</button>
      </div>
    </form>

    <div> message: {{ greeter.message }} </div>
  </section>
</template>

<style scoped>
.home-view {
  display: flex;
  gap: 4px;
  flex-direction: column;
}

.home-view .form-container {
  display: flex;
  gap: 4px;
}
</style>