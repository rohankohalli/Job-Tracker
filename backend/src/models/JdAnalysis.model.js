import { DataTypes } from 'sequelize'
import sequelize from '../config/dbconfig.js'

const JdAnalysis = sequelize.define('JdAnalysis', {
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
  requiredSkills: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'required_skills',
  },
  niceToHave: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'nice_to_have',
  },
  experienceYears: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'experience_years',
  },
  roleType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'role_type',
  },
  keyResponsibilities: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'key_responsibilities',
  },
  redFlags: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'red_flags',
  },
  rawResponse: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    field: 'raw_response',
  },
}, {
  tableName: 'jd_analyses',
  createdAt: 'created_at',
  updatedAt: false,
})

export default JdAnalysis
