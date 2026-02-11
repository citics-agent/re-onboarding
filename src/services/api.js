const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export const submitData = async (data) => {
    try {
        if (!GOOGLE_SCRIPT_URL) {
            console.warn('Google Script URL not set. Logging data to console instead:', data);
            return { success: true, message: 'Data logged in console (Dev mode)' };
        }

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for opaque response from GAS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // innovative hack: with no-cors, we can't read the response status, 
        // but the request usually goes through if no network error.
        // For critical apps, we might use a proxy or CORS-enabled GAS (tricky with redirects).
        // For this prototype, success is assumed if no error throws.

        return { success: true, message: 'Submission sent' };
    } catch (error) {
        console.error('Submission error:', error);
        return { success: false, message: error.message };
    }
};
