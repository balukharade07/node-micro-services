import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const signupUser = async (req, res) => {
  const presentUser = await User.findOne({ email: req.body.email });
  if (presentUser) {
    return res.status(400).send({ error: 'Email already present.' });
  }
  try {
    const { firstName, lastName, email, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: passwordHash,
    });
    const result = await user.save();
    const token = await user.getJWT(user);
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 3600000),
    });
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ error: 'Somthing wrong.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('INVALID CREDENTIALS');
    }

    const passwordHash = await user.validatePassword(password);
    if (passwordHash) {
      const token = await user.getJWT(user);
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 3600000),
      });
      res.status(200).send(user, token);
    } else {
      res.status(400).send('INVALID CREDENTIALS');
    }
  } catch (error) {
    console.error('LOGIN FAILED ↓↓↓', error);
    res.status(400).send('Somthing is Worng');
  }
};

export const loggedInUser = (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).send({ error: 'User not loggend-in' });
    res.send(req.user);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid json' });
  }
};

export const logout = (req, res) => {
  // res.clearCookie("token");
  res
    .cookie('token', null, { expires: new Date(Date.now()) })
    .status(200)
    .send('Logout Successfully...!!');
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne(req.params).select('-password');
  if (!user) {
    res.status(404).send('Email is not valid!');
  } else {
    res.status(200).send(user);
  }
};

export const resetPassword = async (req, resp) => {
  if (!req.body?.password) return resp.status(400).send('invalid password');
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await User.updateOne(req.params, {
    $set: { password: passwordHash },
  });

  if (user) {
    return resp.status(200).send('Reset Password Successfully...!!');
  } else {
    return resp.status(400).send('User not fount');
  }
};

export const getUsers = async (req, res) => {
  try {
 
    const { excludeIds = [], includeIds = [], skip = 0, limit=100 } = req.body;
    
    if (excludeIds?.length) {
      const allUsers = await User.aggregate([
        {
          $match: {
            _id: {
              $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $project: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        },
        {
          $addFields: {
            fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          },
        },
        {
          $facet: {
            result: [{ $skip: skip }, { $limit: limit }],
            count: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            result: 1,
            count: { $arrayElemAt: ['$count.count', 0] },
          },
        },
      ]);
      
      return res.status(200).send(allUsers);
    } else if (includeIds?.length) {
      const allUsers = await User.aggregate([
        {
          $match: {
            _id: {
              $in: includeIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $project: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        },
        {
          $addFields: {
            fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          },
        },
      ]);

      res.status(200).send(allUsers);
    } else {
      const allUser = await User.find({}).select('-password');
      const updatedUserList = allUser.map((item) => {
        const user = {
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          _id: item._id,
        };
        return user;
      });
      return res.status(200).send(updatedUserList);
    }
  } catch (error) {
    
    return res.status(400).send('Somthing wrong!!');
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params);
    res.status(200).send('Deleted Successfully...!!');
  } catch (error) {
    res.status(400).send('Somthing wrong!!');
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne(req.params).select('-password');
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send('User not fount');
  }
};

export const userUpdate = async (req, res) => {
  try {
    const loggedInUserId = req.params?._id;

    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || 'Failed to update user',
    });
  }
};
