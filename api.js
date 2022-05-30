module.exports = {
  async updatePrices({ homey, body }) {
    homey.app.setPrices(body);
  },
};