import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';

class Group extends Model {
    public id!: number;
    public name!: string;
};

Group.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Group',
        timestamps: true
    }
);

export default Group