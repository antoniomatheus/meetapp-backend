import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const { userId } = req;

    const response = await Notification.find({ user: userId }).sort({
      createdAt: 'desc',
    });

    return res.json(response);
  }

  async update(req, res) {
    const { id } = req.params;

    await Notification.update({ _id: id }, { read: true });

    return res.json({ msg: 'ok' });
  }
}

export default new NotificationController();
