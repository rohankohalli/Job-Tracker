import { Sequelize } from 'sequelize'
import sequelize from '../config/db.config.js'
import JobModel from './Job.model.js'
import JdAnalysisModel from './JdAnalysis.model.js'
import ResumeModel from './Resume.model.js'
import PrepMaterialModel from './PrepMaterial.model.js'
import MessageModel from './Message.model.js'
import { setupAssociations } from './associations.js'

const db = {
  Sequelize,
  sequelize,
  Job: JobModel(sequelize),
  JdAnalysis: JdAnalysisModel(sequelize),
  Resume: ResumeModel(sequelize),
  PrepMaterial: PrepMaterialModel(sequelize),
  Message: MessageModel(sequelize),
}

// Establish associations
setupAssociations(db)

export default db
