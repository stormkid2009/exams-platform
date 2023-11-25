

// Create a new function that will fetch data from an api endpoint
// we give the function generic type or placeholder for incoming data which we dont know 
// what type it will be



const fetcher = async<T>(data:T,path:string) => {
    
    // handle the response to take care of errors and issues
    // we gonna use try catch block for this goal
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      // You can use the response here if needed
      //const submittedData = await response.json()
      //console.log('Form data submitted:', submittedData);
    
    } catch (error) {
      console.error('There was a problem with the fetch operation: ', error);
    }
    
  };


  export default fetcher;