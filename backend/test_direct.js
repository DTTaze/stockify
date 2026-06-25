const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:8000/api/v1/market/quote', {
      params: { symbol: 'vnindex', type: 'index', period: '1d' }
    });
    console.log("SUCCESS:", res.status, JSON.stringify(res.data));
  } catch (err) {
    console.error("ERROR:", err.message, err.response ? JSON.stringify(err.response.data) : '');
  }
}
test();
