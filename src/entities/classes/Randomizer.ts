export class Randomizer {
  private readonly DEFAULT_MAX_VALUE;

  constructor() {
    this.DEFAULT_MAX_VALUE = 999;
  }

  getRandomIntegerFromMinToMax(min = 0, max = this.DEFAULT_MAX_VALUE) {
    if (max < min) {
      return 0;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomBoolean() {
    return Math.random() < 0.5;
  }

  getRandomArrayElement<T>(array: T[]) {
    const randomIndex = this.getRandomIntegerFromMinToMax(0, array.length - 1);

    return array[randomIndex];
  }

  shuffleArray<T>(array: T[]) {
    const shuffledArray = [...array];
    const maxIndex = array.length - 1;

    for (let i = maxIndex; i >= 0; i--) {
      const j = this.getRandomIntegerFromMinToMax(0, maxIndex);

      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j]!, shuffledArray[i]!];
    }

    return shuffledArray;
  }
}
