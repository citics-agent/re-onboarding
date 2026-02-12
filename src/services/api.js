const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export const submitData = async (data) => {
    try {
        if (!GOOGLE_SCRIPT_URL) {
            console.warn('Google Script URL not set. Logging data to console instead:', data);
            return { success: true, message: 'Data logged in console (Dev mode)' };
        }

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return { success: true, message: 'Submission sent' };
    } catch (error) {
        console.error('Submission error:', error);
        return { success: false, message: error.message };
    }
};

export const fetchQuestions = async () => {
    try {
        if (!GOOGLE_SCRIPT_URL) {
            console.warn('Google Script URL not set. Returning empty bank.');
            return {};
        }

        const response = await fetch(GOOGLE_SCRIPT_URL);
        const result = await response.json();

        if (result.result === 'success') {
            return result.data;
        } else {
            throw new Error(result.error || 'Failed to fetch questions');
        }
    } catch (error) {
        console.error('Fetch questions error:', error);
        return null; // Return null to handle fallback
    }
};
