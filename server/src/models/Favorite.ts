import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';
import User from './Users';

// Define the Favorite model
class Favorite extends Model {
    public id!: number; // Primary Key
    public userId!: number; // Foreign key
    public barName!: string;
    public address!: string;
    public note!: string;

    // Define the relationship with User
    public user?: User;
}


// Initialize the Favorite model with attributes and options
User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true,
        },
        barName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Favorite',
        timestamps: true
    }
);


// Define relationship between Users and Favorite
User.hasOne(Favorite, {
    foreignKey: 'userId'
})

Favorite.belongsTo(User, {
    foreignKey: 'userId'
})

export default Favorite;
