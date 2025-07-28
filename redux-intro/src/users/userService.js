import axios from 'axios';

const API_URL = 'http://localhost:3001';

const followUser = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/users/${userId}/follow`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // espera que res.data incluya el usuario actualizado con "following"
};

const unfollowUser = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/users/${userId}/unfollow`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // idem, usuario actualizado
};

const userService = {
  followUser,
  unfollowUser,
};

export default userService;
