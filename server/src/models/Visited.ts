import { DataTypes, Model } from "sequelize";
import sequelize from '../config/connection';

//define Visited model
class Visited extends Model {
  public id!: number;
  public bar_name!: string;
  public address!: string;
};

Visited.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bar_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Visited",
    timestamps: true,
  }
);

export default Visited;