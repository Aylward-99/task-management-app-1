// server/controllers/taskController.js
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all tasks with advanced filtering
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getTasks = async (req, res, next) => {
  try {
    // 1. Filtering
    const queryObj = { ...req.query, user: req.user.id };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1a. Advanced filtering (convert gte, gt, lte, lt to MongoDB operators)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Task.find(JSON.parse(queryStr));

    // 2. Search functionality
    if (req.query.search) {
      const search = req.query.search;
      query = query.or([
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]);
    }

    // 3. Sorting
    if (req.query.sort) {
      let sortBy;
      switch (req.query.sort) {
        case 'newest':
          sortBy = '-createdAt';
          break;
        case 'oldest':
          sortBy = 'createdAt';
          break;
        case 'deadline':
          sortBy = 'deadline';
          break;
        case 'priority':
          sortBy = { 
            priority: -1 // Custom sort for priority (high > medium > low)
          };
          break;
        default:
          sortBy = '-createdAt';
      }
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4. Field limiting (optional)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 5. Pagination (optional)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;
    const total = await Task.countDocuments(query.getFilter());

    query = query.skip(startIdx).limit(limit);

    // Execute query
    const tasks = await query;

    // Pagination result
    const pagination = {};
    if (endIdx < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIdx > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
exports.createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this task`,
          401
        )
      );
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this task`,
          401
        )
      );
    }

    await task.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};