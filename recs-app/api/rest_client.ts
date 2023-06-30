import axios from "axios";

export default axios.create({
  baseURL: "/api/click",
  headers: {
    "Content-type": "application/json"
  }
});