import type { ReadonlyPasswordGeneratorParameters } from '../types/ReadonlyPasswordGeneratorParameters.ts';
import { Randomizer } from './Randomizer.ts';
import { PasswordGenerationErrorIds } from '../enums/PasswordGenerationErrorIds.ts';
import type { ReadonlyPasswordRequirements } from '../types/ReadonlyPasswordRequirements.ts';

const ALL_LETTERS = `abcdefghijklmnopqrstuvwxyz`;
const ALL_NUMBERS = `0123456789`;
const ALL_SYMBOLS = `!@#$%^&*`;

export class PasswordGenerator {
  private readonly includesNumbers: boolean;
  private readonly includesLetters: boolean;
  private readonly includesSymbols: boolean;
  private readonly includesUpperCases: boolean;
  private readonly passwordLength: number | string;
  private readonly passwordRequirements: ReadonlyPasswordRequirements;

  constructor(parameters: ReadonlyPasswordGeneratorParameters) {
    this.includesNumbers = parameters.includesNumbers;
    this.includesLetters = parameters.includesLetters;
    this.includesSymbols = parameters.includesSymbols;
    this.includesUpperCases = parameters.includesUpperCases;
    this.passwordLength = parameters.passwordLength;
    this.passwordRequirements = parameters.passwordRequirements;
  }

  private buildValuableSymbols() {
    let valuableSymbols = '';

    if (this.includesLetters) valuableSymbols += ALL_LETTERS;
    if (this.includesSymbols) valuableSymbols += ALL_SYMBOLS;
    if (this.includesNumbers) valuableSymbols += ALL_NUMBERS;

    if (!valuableSymbols.length) {
      throw new Error(PasswordGenerationErrorIds.NO_SYMBOLS);
    }

    return valuableSymbols;
  }

  private generateSymbolFromValuableSymbols() {
    const randomizer = new Randomizer();
    const valuableSymbols = this.buildValuableSymbols();

    return randomizer.getRandomArrayElement(Array.from(valuableSymbols))!;
  }

  generatePassword() {
    let newPassword = '';
    const randomizer = new Randomizer();

    for (let i = +this.passwordLength; i > 0; i--) {
      const newSymbol = this.generateSymbolFromValuableSymbols();

      if (!(this.includesUpperCases && this.includesLetters)) {
        newPassword += newSymbol;
        continue;
      }

      const isUpperCase = randomizer.getRandomBoolean();

      if (!isUpperCase) {
        newPassword += newSymbol;
        continue;
      }

      newPassword += newSymbol.toUpperCase();
    }

    return newPassword;
  }

  generatePasswordWithRequirements() {
    const passwordSymbolBySymbolQuantity = new Map<string, number>();

    const randomizer = new Randomizer();

    if (this.includesNumbers && this.passwordRequirements.minNumbers) {
      for (let i = this.passwordRequirements.minNumbers; i > 0; i--) {
        const randomNumber = randomizer.getRandomArrayElement(Array.from(ALL_NUMBERS));

        if (!randomNumber) {
          throw new Error('unknown symbol');
        }

        if (!passwordSymbolBySymbolQuantity.has(randomNumber)) {
          passwordSymbolBySymbolQuantity.set(randomNumber, 1);

          continue;
        }

        const howMany = passwordSymbolBySymbolQuantity.get(randomNumber)!;
        passwordSymbolBySymbolQuantity.set(randomNumber, howMany + 1);
      }
    }

    if (this.includesSymbols && this.passwordRequirements.minSymbols) {
      for (let i = this.passwordRequirements.minSymbols; i > 0; i--) {
        const randomSymbol = randomizer.getRandomArrayElement(Array.from(ALL_SYMBOLS));

        if (!randomSymbol) {
          throw new Error('unknown symbol');
        }

        if (!passwordSymbolBySymbolQuantity.has(randomSymbol)) {
          passwordSymbolBySymbolQuantity.set(randomSymbol, 1);

          continue;
        }

        const howMany = passwordSymbolBySymbolQuantity.get(randomSymbol)!;
        passwordSymbolBySymbolQuantity.set(randomSymbol, howMany + 1);
      }
    }

    if (
      this.includesLetters &&
      this.includesUpperCases &&
      this.passwordRequirements.minUppercases
    ) {
      for (let i = this.passwordRequirements.minUppercases; i > 0; i--) {
        const randomLetter = randomizer
          .getRandomArrayElement(Array.from(ALL_LETTERS))!
          .toUpperCase();

        if (!randomLetter) {
          throw new Error('unknown symbol');
        }

        if (!passwordSymbolBySymbolQuantity.has(randomLetter)) {
          passwordSymbolBySymbolQuantity.set(randomLetter, 1);

          continue;
        }

        const howMany = passwordSymbolBySymbolQuantity.get(randomLetter)!;
        passwordSymbolBySymbolQuantity.set(randomLetter, howMany + 1);
      }
    }

    let newPasswordSymbolsArray: string[] = [];

    passwordSymbolBySymbolQuantity.forEach((value, key) => {
      for (let i = value; i > 0; i--) {
        newPasswordSymbolsArray.push(key);
      }
    });

    newPasswordSymbolsArray = randomizer.shuffleArray(newPasswordSymbolsArray);

    for (let i = newPasswordSymbolsArray.length; i < +this.passwordLength; i++) {
      const newSymbol = this.generateSymbolFromValuableSymbols()!;

      newPasswordSymbolsArray.push(newSymbol);
    }

    newPasswordSymbolsArray = randomizer.shuffleArray(newPasswordSymbolsArray);

    return newPasswordSymbolsArray.join('');
  }
}
