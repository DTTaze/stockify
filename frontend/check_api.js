const axios = require("axios");
const client = axios.create({
  baseURL: "http://localhost:3060/v1/api",
  timeout: 30000,
});
async function test() {
  try {
    const res = await client.get("ml/market/quote", {
      params: { symbol: "vnindex", type: "index", period: "1d" },
    });
    console.log("RESPONSE SUCCESS:", res.status, JSON.stringify(res.data));
  } catch (err) {
    console.error(
      "RESPONSE ERROR:",
      err.message,
      err.response ? JSON.stringify(err.response.data) : "",
    );
  }
}
test();
