// helper function to check valid answer /s


export function validateAnswers(arr: string[] , options: string[]): boolean {
  return arr.every(item => options.includes(item));
}



