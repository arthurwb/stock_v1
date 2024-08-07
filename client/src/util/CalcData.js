export const fetchData = () => {
  return fetch("/api")
    .then((res) => res.json())
    .catch((error) => console.error("Error fetching data:", error));
};

export const calculateDifferences = (prevData, newData) => {
  if (!prevData || !newData) return {};

  const differences = {};
  newData.options.forEach((newOption) => {
    prevData.options.forEach((prevOption) => {
      if (prevOption.name === newOption.name) {
        differences[newOption.name] = newOption.price > prevOption.price;
      }
    });
  });
  return differences;
};

export const formatedCookie = (cookie) => {
  cookie = cookie.split(";");
  const dic = {
    username: cookie[0].split("=")[1],
  };
  return cookie ? dic : null;
};

export const getUserData = (username) => {
  return fetch("/api-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error fetching data:", error));
};

export const getOptionWallet = async (username) => {
  try {
    const userData = await getUserData(username);
    if (userData && userData.carrots) {
      return userData.carrots;
    } else {
      throw new Error("Carrots object not found in user data");
    }
  } catch (error) {
    console.error("Error getting option wallet:", error);
    return error;
  }
};