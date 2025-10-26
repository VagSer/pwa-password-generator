import type { PasswordRequirements } from './PasswordRequirements.ts';

export interface PasswordGeneratorParameters {
  includesNumbers: boolean;
  includesLetters: boolean;
  includesSymbols: boolean;
  includesUpperCases: boolean;
  passwordLength: number | string;
  passwordRequirements: PasswordRequirements;
}
