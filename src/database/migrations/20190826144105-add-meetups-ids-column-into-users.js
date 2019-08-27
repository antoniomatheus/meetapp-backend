module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'meetups_ids', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'meetups_ids');
  },
};
