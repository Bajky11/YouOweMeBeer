import {useState} from "react";

const useForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const resetForm = (newValues = initialValues) => {
        setFormData(newValues);
    };

    return {
        formData,
        handleChange,
        resetForm,
    };
};

export default useForm;