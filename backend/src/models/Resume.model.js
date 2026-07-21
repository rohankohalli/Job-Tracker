import { DataTypes } from 'sequelize'
import sequelize from '../config/dbconfig.js'

const Resume = sequelize.define('Resume', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'job_id',
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    explanation: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  }, {
    tableName: 'resumes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

export default Resume
