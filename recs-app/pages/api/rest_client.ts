import axios from "axios";

export default axios.create({
  baseURL: "http://3.18.122.83/api",
  headers: {
    "Content-type": "application/json"
  }
});