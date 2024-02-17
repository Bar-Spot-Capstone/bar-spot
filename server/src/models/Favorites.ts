import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';
import User from './Users';

// Define the Favorites model
class Favorites extends Model {
    public id!: number; // Primary Key
    public userId!: number; // Foreign key
    public barName!: string;
    public address!: string;
    public note!: string;

    // Define the relationship with User
    public user?: User;
}

// Initialize the Favorites model with attributes and options
Favorites.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        barName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Favorites',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'barName', 'address']
            }
        ]
    }
);

export default Favorites;
