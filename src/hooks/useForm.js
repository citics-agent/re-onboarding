import { useState } from 'react';

export const useForm = (initialValues = {}) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const setValue = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    return {
        values,
        handleChange,
        setValue
    };
};
