const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcrypt");

/** ---------- MODELS ---------- **/
// User Model
const User = sequelize.define("user", {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
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
    }
});

// Cooperative Model
const Cooperative = sequelize.define("cooperative", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// Exporter Model
const Exporter = sequelize.define("exporter", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// Purchase Model
const Purchase = sequelize.define("purchase", {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
});

// Sale Model
const Sale = sequelize.define("sale", {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
});

// Plot Model
const Plot = sequelize.define("plot", {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        //primaryKey: true,
        //autoIncrement: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dept: {
        type: DataTypes.STRING,
        allowNull: true
    },
    arr: {
        type: DataTypes.STRING,
        allowNull: true
    },
    village: {
        type: DataTypes.STRING,
        allowNull: true
    },
    area: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    xCoord : {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    yCoord: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    plantingAge : {
        type: DataTypes.STRING,
        allowNull: true
    },
    plantsNumber : {
        type: DataTypes.STRING,
        allowNull: true
    },
    productionPerYear : {
        type: DataTypes.STRING,
        allowNull: true
    },
    chemistryIntrants : { // En abrégé cI
        type: DataTypes.STRING,
        allowNull: true
    },
    cIYearUseFrequency : {
        type: DataTypes.STRING,
        allowNull: true
    },
    fertilizer : { // En abrégé f
        type: DataTypes.STRING,
        allowNull: true
    },
    fYearUseFrequency : {
        type: DataTypes.STRING,
        allowNull: true
    },
    difficulties : {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

/** ---------- RELATIONS ---------- **/
/*// Producer - Plot One to Many Relation
Producer.hasMany(Plot, { foreignKey: 'producerCode' });
Plot.belongsTo(Producer, { foreignKey: 'producerCode' });

// Producer - Purchase One to Many Relation
Producer.hasMany(Purchase, { foreignKey: 'producerCode' });
Purchase.belongsTo(Producer, { foreignKey: 'producerCode' });*/

// User - Plot One to Many Relation
User.hasMany(Plot, { foreignKey: 'userCode' });
Plot.belongsTo(User, { foreignKey: 'userCode' });

// User - Purchase One to Many Relation
User.hasMany(Purchase, { foreignKey: 'userCode' });
Purchase.belongsTo(User, { foreignKey: 'userCode' });

// Cooperative - Purchase One to Many Relation
Cooperative.hasMany(Purchase, { foreignKey: 'cooperativeId' });
Purchase.belongsTo(Cooperative, { foreignKey: 'cooperativeId' });

// Cooperative - Sale One to Many Relation
Cooperative.hasMany(Sale, { foreignKey: 'cooperativeId' });
Sale.belongsTo(Cooperative, { foreignKey: 'cooperativeId' });

// Exporter - Sale One to Many Relation
Exporter.hasMany(Sale, { foreignKey: 'exporterId' });
Sale.belongsTo(Exporter, { foreignKey: 'exporterId' });

// Cooperative - Plot One to Many Relation
Cooperative.hasMany(Plot, { foreignKey: { name: 'cooperativeId', allowNull: true }, onDelete: "SET NULL", onUpdate: "CASCADE" });
Plot.belongsTo(Cooperative, { foreignKey: { name: 'cooperativeId', allowNull: true } });

// User - Plot One to Many Relation
// Cooperative.hasMany(Plot, { foreignKey: 'cooperativeId' });
// Plot.belongsTo(Cooperative, { foreignKey: 'cooperativeId' });

/** ---------- OPERATIONS ---------- **/
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = {
    User,
    //Producer,
    Cooperative,
    Exporter,
    Purchase,
    Sale,
    Plot
};