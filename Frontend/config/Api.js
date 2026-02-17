// ⭐ BASE API CONFIG FOR ENTIRE APP

export const BASE_URL = "https://petapp-km5c.onrender.com/api";

// ⭐ COMMON FETCH FUNCTION (PRO LEVEL)
export const apiRequest = async (endpoint, method = "GET", body = null, token = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // ⭐ ADD TOKEN IF EXISTS
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    // ⭐ ADD BODY IF EXISTS
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;

  } catch (error) {
    console.log("API ERROR:", error.message);
    throw error;
  }
};
