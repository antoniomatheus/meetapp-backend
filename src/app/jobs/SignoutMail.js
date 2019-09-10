import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class SignoutMail {
  get key() {
    return 'SignoutMail';
  }

  async handle({ data }) {
    const { user, meetup } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Meetup sign out',
      template: 'sign_out',
      context: {
        user: user.name,
        meetup_title: meetup.title,
        date: format(
          parseISO(meetup.date_time),
          "dd 'of' MMMM',' yyyy 'at' HH:mm"
        ),
      },
    });
  }
}

export default new SignoutMail();
