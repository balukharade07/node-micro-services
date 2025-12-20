import api, { getHeaders } from '../api/api.js';

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies?.token;
    
    const user = await api.get(`/auth/user/${id}`, getHeaders(token));
   
    return res.status(200).send(user.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        "Auth service unavailable",
    });
  }
};
