const { faker } = require('@faker-js/faker');
const { User, Cooperative, Plot, Exporter } = require('./models/models');
const xlsx = require("xlsx");


// import Xlsx Datas
exports.importDatas = async () => {
    try {
        const workbook = xlsx.readFile("resources/xlsx/datas.xlsx");

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        // Convertir les données en format Json
        const data = xlsx.utils.sheet_to_json(sheet);
        
        //console.log(data);
        // Sauvegarder les cooperatives
        let uniqueCoopsList = new Set();
        let uniqueExpList = new Set();
        for(let j = 1; j < 6; j++)
        {
            uniqueCoopsList.add(`COOPERATIVE ${j}`);
            uniqueExpList.add(`EXPORTATEUR ${j}`);
        }

        uniqueCoopsList.forEach((e) => {
            Cooperative.create({ name: e });
        });

        uniqueExpList.forEach((e) => {
            Exporter.create({ name: e });
        });

        let i = 0;
        data.forEach(async (e) => {
            //console.log("\n\n " + i + "\n\n");
            // Save User
            let code = e["CODE_PRODUCTEUR"],
                username = "",
                email = "",
                phone = "",
                password = "12345678";
            /*if(i > 0)
            {*/
                let fn = faker.person.firstName();
                let ln = faker.person.lastName();

                username = faker.internet.username({ firstName: fn, lastName: ln});
                email = faker.internet.email({ firstName: fn, lastName: ln});
                phone = faker.phone.number({ style: "national" });
            /*} else {
                username = "admin";
                email = "admin@gmail.com";
                phone = "654823040";
            }*/
            //let user = await User.create({ code, username, email, phone, password });
            let user = await User.findOrCreate({
                where: { code },
                defaults: { code, username, email, phone, password }
            });
            i++;

            //console.log({ "user": user });
            // id cooperative
            /*let cooperative = null;
            if(e["COOPERATIVE"] != null && e["COOPERATIVE"] != undefined)
                cooperative = await Cooperative.findOne({ where: { name: e["COOPERATIVE"] } });*/

            // Save Parcelle

            // Surfaces
            let areas = [ e["SURFACE_HA"], e["SURFACE_HA_1"], e["SURFACE_HA_2"], e["SURFACE_HA_3"], e["SURFACE_HA_4"], e["SURFACE_HA_5"], ]
            let fArea = "";
            areas.forEach((a) => {
                if(a != null && a != undefined)
                    fArea += `${a}`;
            });

            // Lieux dits
            let locations = [ e["LIEU_DIT"], e["LIEU_DIT_1"], e["LIEU_DIT_2"], e["LIEU_DIT_3"], e["LIEU_DIT_4"], e["LIEU_DIT_5"], ]
            let fLocation = "";
            locations.forEach((l) => {
                if(l != null && l != undefined)
                    fLocation += `${l}`;
            });

            let plot = await Plot.create({ code: e["CODE_PARCELLE"],
                region: e["REGION"],
                dept: e["DEPARTEMENT"],
                arr: e["ARRONDISSEMENT"],
                village: e["VILLAGE"],
                area: fArea,
                location: fLocation,
                /*xCoord: e["X"],
                yCoord: e["Y"],*/
                plantingAge: e["AGE MOYENNE DE LA PLANTATION"],
                plantsNumber: e["NOMBRE MOYEN DE PLANTS"],
                productionPerYear: e["PRODUCTION MOYENNE PAR AN"],
                chemistryIntrants: e["INTRANTS CHIMIQUES UTILISES"],
                cIYearUseFrequency: e["FREQUENCE D'UTILISATION D'INTRANTS PAR AN"],
                fertilizer: e["ENGRAIS UTILISES"],
                fYearUseFrequency: e["FREQUENCE D'UTILISATION D'ENGRAIS PAR AN"],
                difficulties: e["DIFFICULTES RENCONTRES"],
                //cooperativeId: ( cooperative == undefined || cooperative == null) ? null : cooperative.id,
                userCode: e["CODE_PRODUCTEUR"]
            });
        });

    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}