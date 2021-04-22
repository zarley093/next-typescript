export function handleRequestError(error, setErrors, callback) {
  console.log('message', error)
  if (!error.response) {
    const message = 'Something went wrong please try and reload the page.';
    if (typeof callback === 'function') callback(message);
    
    return;
  }

  if ([400, 401, 403, 404, 409, 429].includes(error.response.status)) {
    if (typeof callback === 'function') callback(error.response.data.message);

    return;
  }

  if (error.response.status === 422) {
    if (typeof setErrors === 'function') {
      setErrors(error.response.data.errors);
    }

    error.response.data.errors.forEach(error => {
      if (typeof callback === 'function') callback(error.message);
    });

    // const errorMessage = error.response.data.errors.reduce((acc, error) => {
    //   let messages = acc;
    //   messages += `${error.message}\n`;
    //   return messages;
    // }, '');

    // if (typeof callback === 'function') callback(errorMessage);

    return;
  }

  if (error.response.status === 500) {
    const message = 'Something went wrong please try and reload the page.';
    if (typeof callback === 'function') callback(message);
  }
}