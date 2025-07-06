import mongoose from 'mongoose';

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Task ID' });
  }
  next();
};

export default validateObjectId;
// This middleware function checks if the provided ID in the request parameters is a valid MongoDB ObjectId.
// If the ID is invalid, it responds with a 400 status code and an error message