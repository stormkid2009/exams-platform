// helper function to check valid answer /s


export function validateRightAnswer(arr: string[] , options: string[]): boolean {
  return arr.every(item => options.includes(item));
}



// export function validateRightAsnwer(answer:string,options:string[]):boolean{
//   return options.includes(answer);
// }