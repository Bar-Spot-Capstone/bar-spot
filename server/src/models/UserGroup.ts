import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';
import User from './Users';
import Group from './Group';

class UserGroup extends Model {
    public id!: number;
    public role!: string;
    public userId!: User;
    public groupId!: Group;
};

UserGroup.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        groupId: {
            type: DataTypes.INTEGER,
            references: {
                model: Group,
                key: 'id'
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'UserGroup',
        timestamps: true
    }
);

export default UserGroup