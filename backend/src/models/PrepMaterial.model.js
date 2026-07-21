import { DataTypes } from 'sequelize'
import sequelize from '../config/dbconfig.js'

const PrepMaterial = sequelize.define('PrepMaterial', {
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
    interviewPrep: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'interview_prep',
    },
    resumeTailor: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'resume_tailor',
    },
  }, {
    tableName: 'prep_materials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

export default PrepMaterial
