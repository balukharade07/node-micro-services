import api, { getHeaders } from '../api/api.js';
import Connection from '../models/connection.js';

export const connectionRequestSend = async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;
    const token = req.cookies?.token;

    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid type ${status}` });
    }

    const toUser = await api.get(`/auth/user/${toUserId}`, getHeaders(token));

    if (!toUser) {
      return res.status(400).json({ message: 'Invalid user id!' });
    }

    const isConnectionExisting = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (isConnectionExisting) {
      return res.status(400).json({
        message: 'Connection request already exists!',
      });
    }

    const connectionRequest = new Connection({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    return res.status(200).json({
      message: 'Connection request sent successfully!',
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const connectionRequestReview = async (req, res) => {
  try {
    const { requestId, status } = req.params;
    const loggedInUser = req.user;
    const allowededStatus = ['accepeted', 'rejected'];

    if (!allowededStatus.includes(status)) {
      return res.status(400).json({
        message: `Invalid type ${status}`,
      });
    }

    const connectionRequest = await Connection.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: 'Connection request not found.',
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send('ERROR :' + error.message);
  }
};

export const connectionRequestReceived = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const token = req.cookies?.token;
    const connections = await Connection.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    });

    const fromUserIds = [
      ...new Set(connections.map((r) => r.fromUserId.toString())),
    ];

    const usersResponse = await api.post(
      '/auth/userServer/users',
      { includeIds: fromUserIds },
      getHeaders(token),
    );
    const usersMap = {};
    console.log('usersResponse', usersResponse);
    usersResponse.forEach((user) => {
      usersMap[user._id] = user;
    });

    const data = connections.map((req) => ({
      ...req.toObject(),
      fromUserId: usersMap[req.fromUserId.toString()],
    }));
    res.status(200).json({
      data,
      message: 'Requests received fetch successfully!!',
    });
  } catch (error) {
    res.status(400).send('ERROR :' + error.message);
  }
};

export const getConnections = async (req, res) => {
  try {
    const logggedInUser = req.user;
    const token = req.cookies?.token;
    const connections = await Connection.find({
      $or: [
        { toUserId: logggedInUser._id, status: 'accepeted' },
        { fromUserId: logggedInUser._id, status: 'accepeted' },
      ],
    });

    const userIds = connections.map((item) =>
      item.fromUserId.toString() === logggedInUser._id.toString()
        ? item.toUserId
        : item.fromUserId,
    );

    const uniqueUserIds = [...new Set(userIds.map((id) => id.toString()))];

    const users = await api.post(
      '/auth/userServer/users',
      { includeIds: uniqueUserIds },
      getHeaders(token),
    );

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    const result = userIds.map((id) => userMap[id]);

    res.status(200).json({
      data: result,
      message: 'Connection fetch successfully!!',
    });
  } catch (error) {
    res.status(400).send('ERROR :' + error.message);
  }
};

export const getFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const token = req.cookies?.token;
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const isAlreadyConnectionExists = await Connection.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    });

    const hideUserIds = [];

    isAlreadyConnectionExists.forEach((item) => {
      hideUserIds.push(...[item.toUserId, item.fromUserId]);
    });

    const allUsers = await api.post(
      '/auth/userServer/users',
      {
        excludeIds: [loggedInUser._id, ...hideUserIds],
        skip,
        limit,
      },
      getHeaders(token),
    );
    res.status(200).send(allUsers?.[0]);
  } catch (error) {
    res.status(400).send('Connections not found!!');
  }
};
