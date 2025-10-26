import { type Ref, ref, watch } from 'vue';
import { PasswordGenerator } from '../entities/classes/PasswordGenerator.ts';
import type { ReadonlyPasswordRequirements } from '../entities/types/ReadonlyPasswordRequirements.ts';

export default function usePasswordGenerator(parameters: {
  readonly includesNumbers: Ref<boolean>;
  readonly includesLetters: Ref<boolean>;
  readonly includesSymbols: Ref<boolean>;
  readonly includesUpperCases: Ref<boolean>;
  readonly passwordLength: Ref<number | string>;
  readonly passwordRequirements: Ref<ReadonlyPasswordRequirements>;
}) {
  const passwordGenerator = ref<PasswordGenerator>();

  const updateGenerator = () => {
    passwordGenerator.value = new PasswordGenerator({
      includesNumbers: parameters.includesNumbers.value,
      includesLetters: parameters.includesLetters.value,
      includesSymbols: parameters.includesSymbols.value,
      includesUpperCases: parameters.includesUpperCases.value,
      passwordLength: parameters.passwordLength.value,
      passwordRequirements: parameters.passwordRequirements.value
    });
  };

  watch(
    [
      parameters.includesNumbers,
      parameters.includesLetters,
      parameters.passwordLength,
      parameters.includesSymbols,
      parameters.includesUpperCases,
      parameters.passwordRequirements
    ],
    updateGenerator,
    { immediate: true }
  );

  return { passwordGenerator };
}
