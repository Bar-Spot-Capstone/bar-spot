import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';

// Define the User model
class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public email!: string;
};

// Initialize the User model with attributes and options
User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true
    }
);

export default User;

// Define hook function to create preferences entry after user creation
import Preferences from './Preferences';

export const createUserPreferences = async (user: User) => {
    try {
        // Create boilerplate preferences data
        await Preferences.create({ userId: user.id, timerSetting: 10, shareLocation: false });
    } catch (error) {
        console.error('Error creating preferences:', error);
        // Handle error if preferences creation fails
    }
};