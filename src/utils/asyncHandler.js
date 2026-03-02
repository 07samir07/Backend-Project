//THIS IS A MIDDLEWARE FUNCTION TO HANDLE ASYNC ERRORS IN EXPRESS JS(PRODCUTION STYLE)
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };

// this is try catch block for async functions in express js to handle errors in a better way and send response to client with error message and status code
// const asyncHandler = (fn) => async (req,res,next) => {
//   try{
//     await fn(req,res,next);
//   }catch(error){
//     res.status(err.code|| 500).json({
//       success: false,
//       message:err.message
//     })
//   }
// };
