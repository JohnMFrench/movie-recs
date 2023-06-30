import axios from "axios";

export default axios.create({
  baseURL: "/api/clicks",
  headers: {
    "Content-type": "application/json"
  }
});