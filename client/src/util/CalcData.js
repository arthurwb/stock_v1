export const fetchData = () => {
    return fetch("/api")
      .then((res) => res.json())
      .catch((error) => console.error("Error fetching data:", error));
  };
  
  export const calculateDifferences = (prevData, newData) => {
    if (!prevData || !newData) return {};
  
    const differences = {};
    newData.options.forEach(newOption => {
      prevData.options.forEach(prevOption => {
        if (prevOption.name === newOption.name) {
          differences[newOption.name] = newOption.price > prevOption.price;
        }
      });
    });
    return differences;
  };
  