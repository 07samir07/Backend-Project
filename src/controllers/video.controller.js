import { asyncHandler } from "../utils/asyncHandler.js";

//GET ALL VIDEOS BASED ON QUERY,SORT AND PAGINATION
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  console.log(userId);
  const pipeline = [];
});
export { getAllVideos };
