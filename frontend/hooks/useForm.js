// Custom hook for form handling
import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, validate = null, onSubmit = null) => {
  // Form values state
  const [values, setValues] = useState(initialValues);
  
  // Form errors state
  const [errors, setErrors] = useState({});
  
  // Form touched state (which fields have been interacted with)
  const [touched, setTouched] = useState({});
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form submission count
  const [submitCount, setSubmitCount] = useState(0);
  
  /**
   * Handle field change
   * @param {string} name - Field name
   * @param {*} value - Field value
   */
  const handleChange = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  }, [errors]);
  
  /**
   * Handle field blur
   * @param {string} name - Field name
   */
  const handleBlur = useCallback((name) => {
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate field if validation function exists
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: validationErrors[name]
        }));
      }
    }
  }, [validate, values]);
  
  /**
   * Set field value
   * @param {string} name - Field name
   * @param {*} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);
  
  /**
   * Set field touched
   * @param {string} name - Field name
   * @param {boolean} isTouched - Whether the field is touched
   */
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: isTouched
    }));
  }, []);
  
  /**
   * Set field error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);
  
  /**
   * Reset form
   * @param {Object} newValues - New form values (defaults to initial values)
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  /**
   * Validate form
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = useCallback(() => {
    if (!validate) {
      return true;
    }
    
    const validationErrors = validate(values);
    const isValid = Object.keys(validationErrors).length === 0;
    
    setErrors(validationErrors);
    
    return isValid;
  }, [validate, values]);
  
  /**
   * Handle form submission
   * @param {Event} event - Form submission event
   */
  const handleSubmit = useCallback(async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
    setSubmitCount(prevCount => prevCount + 1);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid || !onSubmit) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Set form-level error
      setErrors(prevErrors => ({
        ...prevErrors,
        form: error.message || 'Form submission failed'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, validateForm, values]);
  
  /**
   * Check if a field has an error
   * @param {string} name - Field name
   * @returns {boolean} Whether the field has an error
   */
  const hasError = useCallback((name) => {
    return Boolean(touched[name] && errors[name]);
  }, [errors, touched]);
  
  /**
   * Get field props
   * @param {string} name - Field name
   * @returns {Object} Field props
   */
  const getFieldProps = useCallback((name) => {
    return {
      value: values[name],
      onChangeText: (text) => handleChange(name, text),
      onBlur: () => handleBlur(name),
      error: hasError(name),
      errorText: errors[name],
    };
  }, [values, handleChange, handleBlur, hasError, errors]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    resetForm,
    validateForm,
    hasError,
    getFieldProps,
  };
};

export default useForm;
