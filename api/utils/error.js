export const errorHandler = (stausCode, message) => { //to handle custom errors
    const error = new Error() // js error cnstructor
    error.stausCode = stausCode
    error.message = message
    return error;
}