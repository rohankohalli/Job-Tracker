import Job from './Job.model.js'
import JdAnalysis from './JdAnalysis.model.js'
import Resume from './Resume.model.js'
import PrepMaterial from './PrepMaterial.model.js'
import User from './User.model.js'
import MasterResume from './MasterResume.model.js'

export function setupAssociations() {
  // Job <-> JdAnalysis (One-to-One)
  Job.hasOne(JdAnalysis, { foreignKey: 'job_id', as: 'jdAnalysis', onDelete: 'CASCADE' })
  JdAnalysis.belongsTo(Job, { foreignKey: 'job_id', as: 'job' })

  // Job <-> Resume (One-to-One)
  Job.hasOne(Resume, { foreignKey: 'job_id', as: 'resume', onDelete: 'CASCADE' })
  Resume.belongsTo(Job, { foreignKey: 'job_id', as: 'job' })

  // Job <-> PrepMaterial (One-to-One)
  Job.hasOne(PrepMaterial, { foreignKey: 'job_id', as: 'prepMaterial', onDelete: 'CASCADE' })
  PrepMaterial.belongsTo(Job, { foreignKey: 'job_id', as: 'job' })

  // User <-> Job
  User.hasMany(Job, { foreignKey: 'user_id', as: 'jobs', onDelete: 'CASCADE' })
  Job.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

  // User <-> MasterResume
  User.hasMany(MasterResume, { foreignKey: 'user_id', as: 'masterResumes', onDelete: 'CASCADE' })
  MasterResume.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
}
