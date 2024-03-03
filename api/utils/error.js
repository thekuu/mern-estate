export const errorHandler = (stausCode, message) => { //custom error handler
    const error = new Error() // js error cnstructor
    error.stausCode = stausCode
    error.message = message
    return error;
}