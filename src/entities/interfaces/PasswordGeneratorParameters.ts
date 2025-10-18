export interface PasswordGeneratorParameters {
  includesNumbers: boolean;
  includesLetters: boolean;
  includesSymbols: boolean;
  includesUpperCases: boolean;
  passwordLength: number | string;
}