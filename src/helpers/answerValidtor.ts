export function validateArrayElements<T>(arr: T[], options: T[]): boolean {
  return arr.every(item => options.includes(item));
}

// Example usage
const fruits = ['apple', 'banana', 'cherry'];
const validFruits = ['apple', 'banana', 'cherry', 'date'];

const result1 = validateArrayElements(fruits, validFruits); // true
const result2 = validateArrayElements(['grape'], validFruits); // false
