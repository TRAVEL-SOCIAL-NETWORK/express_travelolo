const City = require('../models/City')

const getCity = async (req, res) => {
  try {
    const cities = await City.find({
      verify: true,
    }).exec()
    res.send({
      status_code: 200,
      message: 'Get cities successfully',
      cities,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getCity,
}
