import api, { getHeaders } from '../api/api.js';

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
