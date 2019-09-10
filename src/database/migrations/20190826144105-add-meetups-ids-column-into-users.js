module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'meetups_ids', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
      defaultValue: [],
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'meetups_ids');
  },
};
