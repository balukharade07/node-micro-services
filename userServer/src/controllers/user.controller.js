import api, { getHeaders } from '../api/api.js';
import Chat from '../models/Chat.js';

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies?.token;

    const user = await api.get(`/auth/userServer/${id}`, getHeaders(token));

    return res.status(200).send(user);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Auth service unavailable',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies?.token;

    const user = await api.patch(
      `/auth/userServer/${id}`,
      req.body,
      getHeaders(token),
    );

    return res.status(200).send(user?.user);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Auth service unavailable',
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies?.token;

    await api.patch(`/auth/userServer/${id}`, getHeaders(token));

    return res.status(200).send({ data: id, message: 'Delete successfully!!' });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Auth service unavailable',
    });
  }
};

export const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies?.token;

    const bothUsers = await api.post(
      '/auth/userServer/users',
      {
        includeIds: [id, req.user._id],
      },
      getHeaders(token),
    );

    const targetUser = bothUsers?.find(
      (item) => item._id.toString() === id.toString(),
    );

    const userInfo = bothUsers?.find(
      (item) => item._id.toString() === req.user._id.toString(),
    );

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, id] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, id],
        messages: [],
      });
    }

    const messages = chat.messages.map((item) => ({
      _id: item._id,
      text: item.text,
      createdAt: item.createdAt,
      sender:
        item.senderId.toString() === req.user._id.toString()
          ? {
              _id: req.user._id,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
            }
          : {
              _id: targetUser._id,
              firstName: targetUser.firstName,
              lastName: targetUser.lastName,
            },
    }));

    return res.status(200).send({
      data: {
        chatId: chat._id,
        participants: [req.user._id, id],
        messages,
      },
      message: 'Data fetch successfully!!',
    });
  } catch (error) {
    console.log(error);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Auth service unavailable',
    });
  }
};
