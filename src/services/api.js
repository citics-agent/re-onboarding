const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
const VITE_AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL;

export const submitData = async (data) => {
  try {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn(
        "Google Script URL not set. Logging data to console instead:",
        data
      );
      return { success: true, message: "Data logged in console (Dev mode)" };
    }

    // Clone data to format phone number
    const payload = { ...data };
    if (payload.phone && payload.phone.startsWith("0")) {
      payload.phone = `'${payload.phone}`;
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: "Submission sent" };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, message: error.message };
  }
};

export const fetchQuestions = async () => {
  try {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("Google Script URL not set. Returning empty bank.");
      return {};
    }

    const response = await fetch(GOOGLE_SCRIPT_URL);
    const result = await response.json();

    if (result.result === "success") {
      return result.data;
    } else {
      throw new Error(result.error || "Failed to fetch questions");
    }
  } catch (error) {
    console.error("Fetch questions error:", error);
    return null; // Return null to handle fallback
  }
};

export const startReOnboard = async (data) => {
  try {
    const payload = { ...data };

    const response = await fetch(
      VITE_AGENT_API_URL + "/v2.4.2/re-onboard/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (result?.data?.sessionId) {
      return result.data;
    } else {
      throw new Error(result.error || "Failed to start");
    }
  } catch (error) {
    console.error("Fetch questions error:", error);
    return null; // Return null to handle fallback
  }
};

export const submitReOnboard = async (data) => {
  try {
    const payload = { ...data };

    const response = await fetch(
      VITE_AGENT_API_URL + "/v2.4.2/re-onboard/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (result?.data === "Successfully") {
      return result.data;
    } else {
      throw new Error(result.error || "Failed to submit");
    }
  } catch (error) {
    console.error("Fetch questions error:", error);
    return null; // Return null to handle fallback
  }
};
