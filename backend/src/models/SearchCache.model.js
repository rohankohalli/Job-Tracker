import { DataTypes } from 'sequelize'

export default function (sequelize) {
  return sequelize.define('SearchCache', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cache_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    search_params: {
      type: DataTypes.JSON,
      allowNull: true
    },
    response_data: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    tableName: 'search_cache',
    timestamps: true, // Will automatically add created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
