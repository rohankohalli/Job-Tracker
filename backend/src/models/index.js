import { Sequelize } from 'sequelize'
import sequelize from '../config/dbconfig.js'
import JobModel from './Job.model.js'
import JdAnalysisModel from './JdAnalysis.model.js'
import ResumeModel from './Resume.model.js'
import PrepMaterialModel from './PrepMaterial.model.js'
import SearchCacheModel from './SearchCache.model.js'
import { setupAssociations } from './associations.js'

const db = {
  Sequelize,
  sequelize,
  Job: JobModel(sequelize),
  JdAnalysis: JdAnalysisModel(sequelize),
  Resume: ResumeModel(sequelize),
  PrepMaterial: PrepMaterialModel(sequelize),
  SearchCache: SearchCacheModel(sequelize),
}

setupAssociations(db)

export default db
