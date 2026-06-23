export function setupAssociations(models) {
  const { Job, JdAnalysis, Resume, PrepMaterial, Message } = models

  // Job <-> JdAnalysis (One-to-One)
  Job.hasOne(JdAnalysis, { foreignKey: 'job_id', as: 'jdAnalysis', onDelete: 'CASCADE' })
  JdAnalysis.belongsTo(Job, { foreignKey: 'job_id', as: 'job' })

  // Job <-> Resume (One-to-One)
  Job.hasOne(Resume, { foreignKey: 'job_id', as: 'resume', onDelete: 'CASCADE' })
  Resume.belongsTo(Job, { foreignKey: 'job_id', as: 'job' })

  // Job <-> PrepMaterial (One-to-One)
  Job.hasOne(PrepMaterial, { foreignKey: 'job_id', as: 'prepMaterial', onDelete: 'CASCADE' })
  PrepMaterial.belongsTo(Job, { foreignKey: 'job_id', as: 'job' })
}
