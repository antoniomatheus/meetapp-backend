import { Sequelize, Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        date_time: Sequelize.DATE,
        organizer_id: Sequelize.INTEGER,
        participants_ids: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'image_id',
      as: 'image',
    });
  }
}

export default Meetup;
