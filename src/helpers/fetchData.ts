// Assuming questionData and path are defined in your component
const fetchData = async (questionData: unknown,path: string) => {
    try {
        const response = await fetch(path, {
            method: 'POST', // or 'GET', depending on your API
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData), // Only include this for POST requests
        });

        if (!response.ok) {
            console.log('Network response was not ok', response);
        }

        const data = await response.json();
        console.log(data); // Handle the data as needed
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};


export default fetchData;