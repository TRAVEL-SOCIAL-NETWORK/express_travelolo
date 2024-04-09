const Notify = require('../models/Notify')

const getNotifyUser = async (req, res) => {
  try {
    const userId = req.user._id
    const notify = await Notify.find({
      user_id: userId,
    })
      .populate('user_send', 'first_name last_name avatar')
      .populate('post_id', 'content ')
      .sort({ created_at: -1 })
      .exec()
    
    res.send({
      status_code: 200,
      message: 'Notify fetched successfully',
      data: notify,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const seenNotify = async (req, res) => {
  try {
    const userId = req.user._id
    const notify = await Notify.findOneAndUpdate(
      {
        user_id: userId,
        _id: req.params.notify_id,
      },
      {
        seen: true,
      },
      { new: true }
    ).exec()
    if (!notify) {
      return res.status(400).send('Notify not found')
    }
    res.send({
      status_code: 200,
      message: 'Notify updated successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getNotifyUser,
  seenNotify,
}
