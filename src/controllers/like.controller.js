import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const likedAlready = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (likedAlready) {
    await Like.findByIdAndDelete(likedAlready?._id);

    return res
      .status(200)
      .json(new ApiResponse(200, { videoId, isLiked: false }));
  }

  await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  return res.status(200).json(new ApiResponse(200, { videoId, isLiked: true }));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const likedAlready = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (likedAlready) {
    await Like.findByIdAndDelete(likedAlready?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { commentId, isLiked: false }));
  }
  await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { commentId, isLiked: true }));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }
  const likedAlready = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });
  if (likedAlready) {
    await Like.findByIdAndDelete(likedAlready?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { tweetId, isLiked: false }));
  }
  await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  return res.status(200).json(new ApiResponse(200, { tweetId, isLiked: true }));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike };
