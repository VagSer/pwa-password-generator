import type { ReadonlyPasswordGeneratorParameters } from "../types/ReadonlyPasswordGeneratorParameters.ts";
import { Randomizer } from "./Randomizer.ts";

export class PasswordGenerator {
  private readonly includesNumbers: boolean
  private readonly includesLetters: boolean
  private readonly includesSymbols: boolean
  private readonly includesUpperCases: boolean
  private readonly passwordLength: number | string

  constructor(parameters: ReadonlyPasswordGeneratorParameters) {
    this.includesNumbers = parameters.includesNumbers
    this.includesLetters = parameters.includesLetters
    this.includesSymbols = parameters.includesSymbols
    this.includesUpperCases = parameters.includesUpperCases
    this.passwordLength = parameters.passwordLength
  }

  private buildValuableSymbols() {
    let valuableSymbols = ''

    if (this.includesLetters) valuableSymbols += 'abcdefghijklmnopqrstuvwxyz'
    if (this.includesSymbols) valuableSymbols += '!@#$%^&*'
    if (this.includesNumbers) valuableSymbols += '0123456789'

    if (!valuableSymbols.length) {
      throw new Error("no symbols for creating password")
    }

    return valuableSymbols
  }

  generatePassword() {
    let newPassword = ''
    const valuableSymbols = this.buildValuableSymbols()
    const randomizer = new Randomizer()

    for (let i = +this.passwordLength; i > 0; i--) {
      const newSymbol = randomizer.getRandomArrayElement(Array.from(valuableSymbols))

      if (!this.includesUpperCases) {
        newPassword += newSymbol
        continue
      }

      const isUpperCase = randomizer.getRandomBoolean()

      if (!isUpperCase) {
        newPassword += newSymbol
        continue
      }

      newPassword += newSymbol.toUpperCase()
    }

    return newPassword
  }
}