

// Generic validation function for request bodies
export function validateRequestBody<T>(body: T, schema: Record<keyof T, (value: any) => boolean>): boolean {
  if (typeof schema !== 'object' || schema === null) {
    throw new Error("Validation Error: Schema must be a non-null object.");
  }

  return Object.keys(schema).every((key) => {
    const validator = schema[key as keyof T];
    if (typeof validator !== 'function') {
      throw new Error(`Validation Error: Validator for key '${key}' must be a function.`);
    }
    const isValid = validator(body[key as keyof T]);
    if (!isValid) {
      throw new Error(`Validation Error: Validation failed for key '${key}'.`);
    }
    return isValid;
  });
}

// Example usage for specific models
export const grammaireSchema = {
  content: (value: any): boolean => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      console.error("Validation Error: 'content' must be a non-empty string.", { value });
      return false;
    }
    return true;
  },
  options: (value: any): boolean => {
    const expectedLength = 4; // Parameterize the expected length for flexibility
    if (!Array.isArray(value) || value.length !== expectedLength) {
      console.error(`Validation Error: 'options' must be an array with exactly ${expectedLength} elements.`, { value });
      return false;
    }
    if (!value.every((opt) => typeof opt === 'string' && opt.trim().length > 0)) {
      console.error("Validation Error: All elements in 'options' must be non-empty strings.", { value });
      return false;
    }
    return true;
  },
  rightAnswer: (value: any): boolean => typeof value === 'number' && value >= 0 && value <= 3
};
