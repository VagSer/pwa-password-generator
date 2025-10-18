export class Randomizer {
  private readonly DEFAULT_MAX_VALUE

  constructor() {
    this.DEFAULT_MAX_VALUE = 999
  }

  getRandomIntegerFromMinToMax(min = 0, max = this.DEFAULT_MAX_VALUE) {
    if (max < min) {
      throw new Error("max cannot be less then min")
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  getRandomBoolean() {
    return Math.random() < 0.5
  }


  getRandomArrayElement<T>(array: T[]) {
    if (array.length === 0) {
      throw new Error("trying take random element from empty array")
    }

    const randomIndex = this.getRandomIntegerFromMinToMax(0, array.length - 1)

    return array[randomIndex]
  }
}