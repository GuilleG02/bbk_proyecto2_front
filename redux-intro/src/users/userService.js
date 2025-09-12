import axios from 'axios';

const API_URL = 'http://localhost:3001';

const followUser = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/users/${userId}/follow`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; 
};

const unfollowUser = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/users/${userId}/unfollow`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; 
};

const userService = {
  followUser,
  unfollowUser,
};

export default userService;
