import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const joinWaitlist = async (email, source = "hero") => {
  const res = await axios.post(`${API}/waitlist`, { email, source });
  return res.data;
};

export const getWaitlistCount = async () => {
  const res = await axios.get(`${API}/waitlist/count`);
  return res.data.count;
};
