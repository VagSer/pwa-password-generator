<script setup lang="ts">
import { computed, onMounted, type Ref, ref, watch } from 'vue';
import usePasswordGenerator from './composables/usePasswordGenerator.ts';
import { useI18n } from 'vue-i18n';
import { PasswordGenerationErrorIds } from './entities/enums/PasswordGenerationErrorIds.ts';
import type { PasswordRequirements } from './entities/interfaces/PasswordRequirements.ts';

const { t, locale } = useI18n();

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 30;

const includesLetters = ref(true);
const includesNumbers = ref(false);
const includesUpperCases = ref(false);
const includesSymbols = ref(false);
const passwordLength = ref(8);
const isCopyPasswordButtonDisabled = ref(false);

const isProModeActive = ref(true);
const passwordRequirements: Ref<PasswordRequirements> = ref({
  minNumbers: 1,
  minSymbols: 1,
  minUppercases: 1
});

const { passwordGenerator } = usePasswordGenerator({
  includesNumbers,
  includesLetters,
  includesSymbols,
  includesUpperCases,
  passwordLength,
  passwordRequirements
});

const errorMessage = computed(() => {
  try {
    passwordGenerator.value?.generatePassword();
    return '';
  } catch (err) {
    const errorId = err instanceof Error ? err.message : PasswordGenerationErrorIds.UNKNOWN_ERROR;

    const errorMessagesByErrorId = new Map<PasswordGenerationErrorIds, string>([
      [PasswordGenerationErrorIds.NO_SYMBOLS, t('errors.noSymbols')],
      [PasswordGenerationErrorIds.COPY_FAILED, t('errors.copyFailed')],
      [PasswordGenerationErrorIds.GENERATION_FAILED, t('errors.generationFailed')],
      [PasswordGenerationErrorIds.UNKNOWN_ERROR, t('errors.unknownError')]
    ]);

    const normalizedCode = Object.values(PasswordGenerationErrorIds).includes(
      errorId as PasswordGenerationErrorIds
    )
      ? (errorId as PasswordGenerationErrorIds)
      : PasswordGenerationErrorIds.UNKNOWN_ERROR;

    return errorMessagesByErrorId.get(normalizedCode) || t('errors.unknownError');
  }
});

const createNewPassword = () => {
  try {
    if (!passwordGenerator.value) return '';
    if (isProModeActive.value) {
      return passwordGenerator.value.generatePasswordWithRequirements();
    }

    return passwordGenerator.value.generatePassword();
  } catch (err) {
    return '';
  }
};

const password = ref(createNewPassword());

const copyPassword = async () => {
  if (!password.value) return;

  await navigator.clipboard.writeText(password.value);
  const COPY_TIMEOUT_DELAY_IN_MILLISECONDS = 3_000;

  isCopyPasswordButtonDisabled.value = true;
  setTimeout(() => {
    isCopyPasswordButtonDisabled.value = false;
  }, COPY_TIMEOUT_DELAY_IN_MILLISECONDS);
};

const generateNewPassword = () => (password.value = createNewPassword());

const isError = computed(() => errorMessage.value !== '');

const copyPasswordButtonText = computed(() => {
  if (isCopyPasswordButtonDisabled.value) {
    return t('actions.copied');
  }

  return t('actions.copy');
});

watch(
  [
    includesNumbers,
    includesLetters,
    includesSymbols,
    includesUpperCases,
    passwordLength,
    isProModeActive,
    passwordRequirements
  ],
  generateNewPassword,
  { deep: true }
);

onMounted(() => {
  const savedLang = localStorage.getItem('minpasmen-preferred-language');
  const browserLang = navigator.language.split('-')[0];

  if (savedLang === 'ru' || savedLang === 'en') {
    locale.value = savedLang;
  } else if (browserLang === 'ru') {
    locale.value = 'ru';
  }
});

const switchLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const lang = target.value as 'en' | 'ru';
  locale.value = lang;
  localStorage.setItem('minpasmen-preferred-language', lang);
};
</script>

<template>
  <main class="main__wrapper">
    <select :value="locale" @change="switchLanguage">
      <option value="en">{{ t('languages.english') }}</option>
      <option value="ru">{{ t('languages.russian') }}</option>
      <option value="zh-CN">{{ t('languages.chinese') }}</option>
    </select>
    <h1 class="main__header">{{ t('app.title') }}</h1>
    <p>{{ t('app.description') }}</p>
    <p v-if="password" class="password__block">{{ password }}</p>
    <h2 v-if="errorMessage" class="error__message">{{ errorMessage }}</h2>
    <fieldset class="filters">
      <legend>{{ t('passwordParameters.title') }}</legend>
      <ul class="filters__list">
        <li class="length__wrapper">
          <input
            id="password--length"
            type="range"
            :min="MIN_PASSWORD_LENGTH"
            :max="MAX_PASSWORD_LENGTH"
            v-model="passwordLength"
          />
          <label for="password--length"
            >{{ t('passwordParameters.length') }} {{ passwordLength }}</label
          >
        </li>
        <li class="filters__item">
          <input type="checkbox" id="includes--letters" v-model="includesLetters" />
          <label for="includes--letters">{{ t('passwordParameters.letters') }}</label>
        </li>
        <li class="filters__item">
          <input type="checkbox" id="includes--numbers" v-model="includesNumbers" />
          <label for="includes--numbers">{{ t('passwordParameters.numbers') }}</label>
        </li>
        <li class="filters__item">
          <input type="checkbox" id="includes--symbols" v-model="includesSymbols" />
          <label for="includes--symbols">{{ t('passwordParameters.symbols') }}</label>
        </li>
        <li class="filters__item">
          <input
            type="checkbox"
            id="includes--uppercases"
            v-model="includesUpperCases"
            :disabled="!includesLetters"
          />
          <label for="includes--uppercases">{{ t('passwordParameters.uppercase') }}</label>
        </li>
        <li class="filters__item">
          <input type="checkbox" id="pro--mode--toggle" v-model="isProModeActive" />
          <label for="pro--mode--toggle">{{ t('pro.proModeCheckbox') }}</label>
        </li>
      </ul>
      <ul class="filters__list" v-if="isProModeActive">
        <li class="filters__item">
          <input
            type="number"
            id="minimum--numbers"
            v-model="passwordRequirements.minNumbers"
            min="1"
            :max="MAX_PASSWORD_LENGTH"
            :disabled="!includesNumbers"
            autocomplete="new-password"
            inputmode="numeric"
          />
          <label for="minimum--numbers">{{ t('pro.minNumbers') }}</label>
        </li>
        <li class="filters__item">
          <input
            type="number"
            id="minimum--symbols"
            v-model="passwordRequirements.minSymbols"
            min="1"
            :max="MAX_PASSWORD_LENGTH"
            :disabled="!includesSymbols"
            autocomplete="new-password"
            inputmode="numeric"
          />
          <label for="minimum--symbols">{{ t('pro.minSymbols') }}</label>
        </li>
        <li class="filters__item">
          <input
            type="number"
            id="minimum--uppercases"
            v-model="passwordRequirements.minUppercases"
            min="1"
            :max="MAX_PASSWORD_LENGTH"
            :disabled="!(includesLetters && includesUpperCases)"
            autocomplete="new-password"
            inputmode="numeric"
          />
          <label for="minimum--uppercases">{{ t('pro.minUppercase') }}</label>
        </li>
      </ul>
    </fieldset>
    <button class="app__button" @click="generateNewPassword" v-if="!isError">
      <span>{{ t('actions.generate') }}</span>
      <img src="/images/icons/refresh.svg" alt="" class="button__icon" />
    </button>
    <button class="app__button" :disabled="isCopyPasswordButtonDisabled" @click="copyPassword">
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
  font-family: 'Courier New', monospace;
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
