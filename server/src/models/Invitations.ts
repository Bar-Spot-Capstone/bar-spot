import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';
import Group from './Group';
import User from './Users';

class Invitation extends Model {
    public id!: number;
    public status!: string;
    public groupId!: Group;
    public invited_by!: User;
    public invited_user!: User;
};

Invitation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        groupId: {
            type: DataTypes.INTEGER,
            references: {
                model: Group,
                key: 'id'
            }
        },
        invited_by: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        invited_user: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Invitation',
        timestamps: true
    }
);

export default Invitation;