import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date_time: Yup.date().required(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { title, description, date_time, image_id } = req.body;

    const date = parseISO(req.body.date_time);
    if (isBefore(date, new Date())) {
      return res
        .status(401)
        .json({ error: 'You cannot create a meetup with a past date.' });
    }

    const file = await File.findOne({
      where: {
        id: image_id,
      },
    });

    if (!file) {
      return res
        .status(401)
        .json('You must upload the image before assigning it to a meetup.');
    }

    const meetup = await Meetup.create({
      title,
      description,
      date_time,
      organizer_id: req.userId,
      image_id,
    });

    return res.json(meetup);
  }

  async index(req, res) {
    const { date, page = 1 } = req.query;

    let meetups;

    if (date) {
      meetups = await Meetup.findAll({
        where: {
          date_time: {
            [Op.between]: [
              startOfDay(parseISO(date)),
              endOfDay(parseISO(date)),
            ],
          },
        },
        order: ['date_time'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['url', 'path'],
              },
            ],
          },
          {
            model: File,
            as: 'image',
            attributes: ['url', 'path'],
          },
        ],
      });
    } else {
      meetups = await Meetup.findAll({
        order: ['date_time'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: File,
            as: 'image',
            attributes: ['name', 'url'],
          },
        ],
      });
    }

    return res.json(meetups);
  }

  async delete(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res
        .status(401)
        .json({ error: "You can't delete a meetup that doesn't exist." });
    }

    if (meetup.organizer_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You can not delete a meetup that you do not own.' });
    }

    const date = parseISO(meetup.date_time);
    if (isBefore(date, new Date())) {
      return res.status(401).json({ error: "You can't delete a past meetup." });
    }

    const meetup_title = meetup.title;

    await meetup
      .destroy()
      .then(() =>
        res.json({ message: `'${meetup_title}' was delete succesfully.` })
      );

    return res
      .status(500)
      .json({ error: 'It was not possible to delete the meetup.' });
  }

  async update(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found.' });
    }

    if (meetup.organizer_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to modify this meetup.' });
    }

    const date = parseISO(meetup.date_time);
    if (isBefore(date, new Date())) {
      res.status(401).json({ error: "You can't change a past meetup data." });
    }

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      date_time: Yup.date(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { date_time } = req.body;
    if (isBefore(parseISO(date_time), new Date())) {
      return res
        .status(400)
        .json({ error: "You can't change to a past date." });
    }

    const updatedMeetup = await meetup.update(req.body);

    return res.json(updatedMeetup);
  }
}

export default new MeetupController();
