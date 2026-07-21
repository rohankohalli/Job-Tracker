import sequelize from '../config/dbconfig.js'
import Job from './Job.model.js'
import JdAnalysis from './JdAnalysis.model.js'
import Resume from './Resume.model.js'
import PrepMaterial from './PrepMaterial.model.js'
import SearchCache from './SearchCache.model.js'
import User from './User.model.js'
import MasterResume from './MasterResume.model.js'
import { setupAssociations } from './associations.js'

const db = {
  sequelize,
  Job,
  JdAnalysis,
  Resume,
  PrepMaterial,
  SearchCache,
  User,
  MasterResume,
}

setupAssociations()

export default db
