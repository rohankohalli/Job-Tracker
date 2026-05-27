import { DataTypes } from 'sequelize'

export default (sequelize) => {
  return sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'job_id',
    },
    type: {
      type: DataTypes.ENUM('cold_dm', 'email'),
      allowNull: false,
    },
    draft: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
  }, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  })
}
