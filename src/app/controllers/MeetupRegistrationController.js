import { isBefore, differenceInMinutes } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Notification from '../schemas/Notification';

class MeetupRegistrationController {
  async store(req, res) {
    const id = Number(req.params.id);

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(400).json({ error: 'The meetup does not exist.' });
    }

    const { date_time } = meetup;

    /**
     * The meetup should not have occurred yet.
     */
    if (isBefore(date_time, new Date())) {
      return res.status(400).json({ error: 'The meetup already occurred.' });
    }

    const user = await User.findByPk(req.userId);

    const { meetups_ids } = user;

    if (meetups_ids) {
      /**
       * The user can't register to the same meetup.
       */
      if (meetups_ids.includes(id)) {
        return res
          .status(400)
          .json({ error: 'You are already registered in this meetup.' });
      }

      /**
       * The user can't register to meetups that take place at the same time
       */

      let registered_meetups = [];

      for (let i = 0; i < meetups_ids.length; i += 1) {
        registered_meetups.push(Meetup.findByPk(meetups_ids[i]));
      }

      registered_meetups = await Promise.all(registered_meetups);

      for (let i = 0; i < registered_meetups.length; i += 1) {
        const { date_time: date } = registered_meetups[i];
        const difference = Math.abs(differenceInMinutes(date_time, date));
        if (difference < 60) {
          return res.status(400).json({
            error: `You have already signed up to a meetup that occurs at the same
          time as the one you're signing up.`,
          });
        }
      }
    }

    if (!meetups_ids) {
      user.meetups_ids = [];
    }
    if (!meetup.participants_ids) {
      meetup.participants_ids = [];
    }

    user.meetups_ids.push(id);
    meetup.participants_ids.push(user.id);
    await user.update({ meetups_ids: user.meetups_ids });
    await meetup.update({ participants_ids: meetup.participants_ids });

    /**
     * Notify organizer about the sign up
     */
    await Notification.create({
      content: `New attendee in ${meetup.title}: ${user.name}`,
      user: meetup.organizer_id,
    });

    return res.json({
      message: `You signed up succesffuly to ${meetup.title} meetup.`,
    });
  }

  async delete(req, res) {
    return res.json({});
  }
}

export default new MeetupRegistrationController();
