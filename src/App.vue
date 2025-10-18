<script setup lang="ts">
import {computed, ref} from "vue"
import usePasswordGenerator from "./composables/usePasswordGenerator.ts";

const includesLetters = ref(true)
const includesNumbers = ref(false)
const includesUpperCases = ref(false)
const includesSymbols = ref(false)
const passwordLength = ref(8)
const isCopyPasswordButtonDisabled = ref(false)

const { passwordGenerator } = usePasswordGenerator({
  includesNumbers,
  includesLetters,
  includesSymbols,
  includesUpperCases,
  passwordLength
})

const password = computed(() => {
  try {
    if (!passwordGenerator.value) return ''
    return passwordGenerator.value.generatePassword()
  } catch (err) {
    return ""
  }
})

const errorMessage = computed(() => {
  try {
    passwordGenerator.value?.generatePassword()
    return ''
  } catch (err) {
    return err instanceof Error ? err.message : 'Ошибка генерации'
  }
})

const copyPassword = async () => {
  await navigator.clipboard.writeText(password.value)
  const COPY_TIMEOUT_DELAY_IN_MILLISECONDS = 3_000

  isCopyPasswordButtonDisabled.value = true
  setTimeout(() => {
    isCopyPasswordButtonDisabled.value = false
  }, COPY_TIMEOUT_DELAY_IN_MILLISECONDS)
}

const copyPasswordButtonText = computed(() => {
  if (isCopyPasswordButtonDisabled.value) {
    return "Password copied!"
  }

  return "Copy password"
})
</script>

<template>
  <main class="main__wrapper">
    <h1 class="main__header">My password generator</h1>
    <p v-if="password" class="password__block">{{ password }}</p>
    <h2 v-if="errorMessage" class="error__message">{{ errorMessage }}</h2>
    <fieldset class="filters">
      <legend>Parameters</legend>
      <ul class="filters__list">
        <li class="length__wrapper">
        <input id="password--length" type="range" min="4" max="20" v-model="passwordLength">
        <label for="password--length">Password length: {{ passwordLength }}</label>
      </li>
        <li class="filters__item">
        <input type="checkbox" id="includes--letters" v-model="includesLetters"/>
        <label for="includes--letters" >Use letters</label>
      </li>
        <li class="filters__item">
        <input type="checkbox" id="includes--numbers" v-model="includesNumbers"/>
        <label for="includes--numbers" >Use numbers</label>
      </li>
        <li class="filters__item">
          <input type="checkbox" id="includes--symbols" v-model="includesSymbols"/>
          <label for="includes--symbols" >Use symbols</label>
        </li>
        <li class="filters__item">
          <input type="checkbox" id="includes--uppercases" v-model="includesUpperCases"/>
          <label for="includes--uppercases" >Use uppercases</label>
        </li>
      </ul>
    </fieldset>
    <button
      class="app__button"
      :disabled="isCopyPasswordButtonDisabled"
      @click="copyPassword"
    >
      <span>{{ copyPasswordButtonText }}</span>
      <img
        v-show="!isCopyPasswordButtonDisabled"
        src="/images/icons/copy.svg"
        alt=""
        class="button__icon"
      />
    </button>
  </main>
</template>

<style scoped>
.main__wrapper {
  display: flex;
  flex-direction: column;
  width: min(100%, 1440px);
  margin-inline: auto;
  align-items: center;

  text-align: center;
}

.main__header {
  font-size: 2rem;
}

.password__block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: min(100%, 600px);

  color: oklch(0.6 0 0);
  font-family: "Courier New", monospace;
  font-size: 1.5rem;
}

.filters {
  display: flex;
  flex-direction: column;
}

.filters__list {
  margin: 0;
  padding: 0;
}

.length__wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.filters__item {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.error__message {
  background-color: oklch(0.9 0.03 20);
  padding: 40px;

  color: oklch(0.4 0.2 20);
}

.app__button {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.button__icon {
  height: 1lh;
}
</style>
