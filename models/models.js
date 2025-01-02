const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcrypt");

/** ---------- MODELS ---------- **/
// User Model
const User = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
{
    hooks: {
        beforeCreate: async (user) => {
            if(user.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if(user.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    },
    timestamps: true,
});

// Food Model
const Food = sequelize.define("food", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    calories: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: true,
});

// Restaurant Model
const Restaurant = sequelize.define("restaurant", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinates: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: true,
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate : {
            isEmail: true
        }
    },
}, {
    timestamps: true,
});

// Reservations Model
const Reservation = sequelize.define("reservation", {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    nb_personnes: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
}, {
    timestamps: true,
});

// Dietician Model
const Dietitian = sequelize.define("dietitian", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinates: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: true,
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate : {
            isEmail: true
        }
    }
}, {
    timestamps: true,
});

// Meeting Model
const Meeting = sequelize.define("meeting", {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
});

/** ---------- RELATIONS ---------- **/
/*// Producer - Plot One to Many Relation
Producer.hasMany(Plot, { foreignKey: 'producerCode' });
Plot.belongsTo(Producer, { foreignKey: 'producerCode' });

// Producer - Purchase One to Many Relation
Producer.hasMany(Purchase, { foreignKey: 'producerCode' });
Purchase.belongsTo(Producer, { foreignKey: 'producerCode' });*/

// User - Food One to Many Relation
User.hasMany(Food, { foreignKey: 'userId' });
Food.belongsTo(User, { foreignKey: 'userId' });

// User - Reservation One to Many Relation
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

// User - Meeting One to Many Relation
User.hasMany(Meeting, { foreignKey: 'userId' });
Meeting.belongsTo(User, { foreignKey: 'userId' });

// Reservation - Restaurant One to Many Relation
Restaurant.hasMany(Reservation, { foreignKey: 'restaurantId' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

// Meeting - Dietist One to Many Relation
Dietitian.hasMany(Meeting, { foreignKey: 'dietitianId' });
Meeting.belongsTo(Dietitian, { foreignKey: 'dietitianId' });

// Cooperative - Plot One to Many Relation
// Cooperative.hasMany(Plot, { foreignKey: { name: 'cooperativeId', allowNull: true }, onDelete: "SET NULL", onUpdate: "CASCADE" });
// Plot.belongsTo(Cooperative, { foreignKey: { name: 'cooperativeId', allowNull: true } });

// User - Plot One to Many Relation
// Cooperative.hasMany(Plot, { foreignKey: 'cooperativeId' });
// Plot.belongsTo(Cooperative, { foreignKey: 'cooperativeId' });

/** ---------- OPERATIONS ---------- **/
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = {
    User,
    Food,
    Restaurant,
    Reservation,
    Dietitian,
    Meeting,
    sequelize
};