import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';
import User from './Users';

// Define the Prefernces model
class Preferences extends Model {
    public id!: number; // Primary Key
    public userId!: User; // Foreign key
    public timerSetting!: number;
    public shareLocation!: boolean;
    public shareVisitedBars!: boolean;
}

// Initialize the Favorites model with attributes and options
Preferences.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // Makes a one-to-one relationship
            references: {
                model: User,
                key: 'id'
            }
        },
        timerSetting: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shareLocation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        shareVisitedBars: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Preferences',
        timestamps: true,
    }
);

export default Preferences;