import { isValidObjectId, Types } from "mongoose";
import dotenv from "dotenv";
import Vehicle from "../models/vehicle.model";
import Driver, { IDriver } from "../models/driver.model";
import logger from "../utils/logger";
import { connectDB } from "../config/database.config";
import CarModel from "../models/carModel.model";
import UserService from "../services/users.service";

dotenv.config();

const seedVehiclesAndDrivers = async () => {
    const shouldReset =
        process.argv.includes("--reset") || process.argv.includes("--r");

    let insertedDriverIds: Types.ObjectId[] = [];

    try {
        await connectDB();

        const { _id: adminId } = await UserService.getUserByField(
            "email",
            "admin@admin.com"
        );

        if (shouldReset) {
            logger.debug("Resetting the Drivers collection data");
            await Driver.deleteMany({});
            logger.debug("Resetting the Vehicles collection data");
            await Vehicle.deleteMany({});
        }

        // Obtener los modelos de vehículos existentes
        const vehicleModels = await CarModel.find({}, "_id name"); // Asegúrate de que el campo 'name' sea el correcto
        const vehicleModelMap = new Map(
            vehicleModels.map((model) => [model.name, model._id])
        );

        const drivers = [
            {
                idCard: "V-223456789",
                createdBy: adminId,
                name: "Gabriela",
                lastname: "Diaz",
                avatar: "https://randomuser.me/api/portraits/women/96.jpg",
                email: "gabriela.diaz@transportes.com",
                phone: "+58-416-2223334",
                licenseExpiry: new Date("2024-09-05"),
            },
            {
                idCard: "V-329876543",
                createdBy: adminId,
                name: "Laura",
                lastname: "Campos",
                avatar: "https://randomuser.me/api/portraits/women/6.jpg",
                email: "laura.campos@transportes.com",
                phone: "+58-416-7890123",
                licenseExpiry: new Date("2024-02-20"),
            },
            {
                idCard: "V-012345678",
                createdBy: adminId,
                name: "Andrea",
                lastname: "Torres",
                avatar: "https://randomuser.me/api/portraits/women/94.jpg",
                email: "andrea.torres@transportes.com",
                phone: "+58-416-5432109",
                licenseExpiry: new Date("2024-08-25"),
            },
            {
                idCard: "V-109876543",
                createdBy: adminId,
                name: "Marcela",
                lastname: "Quintero",
                avatar: "https://randomuser.me/api/portraits/women/14.jpg",
                email: "marcela.quintero@transportes.com",
                phone: "+58-416-5678901",
                licenseExpiry: new Date("2024-01-15"),
            },
            {
                idCard: "V-549876543",
                createdBy: adminId,
                name: "Paola",
                lastname: "Ochoa",
                avatar: "https://randomuser.me/api/portraits/women/4.jpg",
                email: "paola.ochoa@transportes.com",
                phone: "+58-416-9012345",
                licenseExpiry: new Date("2024-03-15"),
            },
            {
                idCard: "V-234567890",
                createdBy: adminId,
                name: "Maria",
                lastname: "Requena",
                avatar: "https://randomuser.me/api/portraits/women/86.jpg",
                email: "maria.requena@transportes.com",
                phone: "+58-416-7654321",
                licenseExpiry: new Date("2024-06-30"),
            },
            {
                idCard: "V-445678901",
                createdBy: adminId,
                name: "Valeria",
                lastname: "Gonzalez",
                avatar: "https://randomuser.me/api/portraits/women/98.jpg",
                email: "valeria.gonzalez@transportes.com",
                phone: "+58-416-7778889",
                licenseExpiry: new Date("2024-10-20"),
            },
            {
                idCard: "V-667890123",
                createdBy: adminId,
                name: "Natalia",
                lastname: "Rivera",
                avatar: "https://randomuser.me/api/portraits/women/10.jpg",
                email: "natalia.rivera@transportes.com",
                phone: "+58-416-1234567",
                licenseExpiry: new Date("2024-11-30"),
            },
            {
                idCard: "V-769876543",
                createdBy: adminId,
                name: "Sofia",
                lastname: "Pineda",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
                email: "sofia.pineda@transportes.com",
                phone: "+58-416-1234567",
                licenseExpiry: new Date("2024-04-20"),
            },
            {
                idCard: "V-678901234",
                createdBy: adminId,
                name: "Lucia",
                lastname: "Hernandez",
                avatar: "https://randomuser.me/api/portraits/women/90.jpg",
                email: "lucia.hernandez@transportes.com",
                phone: "+58-416-1112223",
                licenseExpiry: new Date("2024-11-15"),
            },
            {
                idCard: "V-432162784",
                createdBy: adminId,
                name: "Jazmin",
                lastname: "Rondón",
                avatar: "https://randomuser.me/api/portraits/women/12.jpg",
                email: "jazmin.rondon@transportes.com",
                phone: "+58-416-4651124",
                licenseExpiry: new Date("2024-05-15"),
            },
            {
                idCard: "V-889012345",
                createdBy: adminId,
                name: "Elena",
                lastname: "Castro",
                avatar: "https://randomuser.me/api/portraits/women/12.jpg",
                email: "elena.castro@transportes.com",
                phone: "+58-416-3456789",
                licenseExpiry: new Date("2024-12-10"),
            },
            {
                idCard: "V-145522526",
                createdBy: adminId,
                name: "Alondra",
                lastname: "Padrón",
                avatar: "https://randomuser.me/api/portraits/women/11.jpg",
                email: "alondra.padron@transportes.com",
                phone: "+58-416-6598459",
                licenseExpiry: new Date("2024-05-15"),
            },
            {
                idCard: "V-989876543",
                createdBy: adminId,
                name: "Isabel",
                lastname: "Velasquez",
                avatar: "https://randomuser.me/api/portraits/women/40.jpg",
                email: "isabel.velasquez@transportes.com",
                phone: "+58-416-3456789",
                licenseExpiry: new Date("2024-05-15"),
            },
            {
                idCard: "V-890123456",
                createdBy: adminId,
                name: "Daniela",
                lastname: "Rodriguez",
                avatar: "https://randomuser.me/api/portraits/women/92.jpg",
                email: "daniela.rodriguez@transportes.com",
                phone: "+58-416-6667778",
                licenseExpiry: new Date("2024-07-10"),
            },
            {
                idCard: "V-456789012",
                createdBy: adminId,
                name: "Anais",
                lastname: "Morales",
                avatar: "https://randomuser.me/api/portraits/women/88.jpg",
                email: "anais.morales@transportes.com",
                phone: "+58-416-5432109",
                licenseExpiry: new Date("2024-09-30"),
            },
            {
                idCard: "V-345678901",
                createdBy: adminId,
                name: "Roberto",
                lastname: "Gomez",
                avatar: "https://randomuser.me/api/portraits/men/87.jpg",
                email: "roberto.gomez@transportes.com",
                phone: "+58-412-6543210",
                licenseExpiry: new Date("2025-01-15"),
            },
            {
                idCard: "V-556789012",
                createdBy: adminId,
                name: "Sebastian",
                lastname: "Lopez",
                avatar: "https://randomuser.me/api/portraits/men/99.jpg",
                email: "sebastian.lopez@transportes.com",
                phone: "+58-412-9990001",
                licenseExpiry: new Date("2025-07-25"),
            },
            {
                idCard: "V-990123456",
                createdBy: adminId,
                name: "Rafael",
                lastname: "Silva",
                avatar: "https://randomuser.me/api/portraits/men/13.jpg",
                email: "rafael.silva@transportes.com",
                phone: "+58-412-4567890",
                licenseExpiry: new Date("2025-09-20"),
            },
            {
                idCard: "V-112345678",
                createdBy: adminId,
                name: "Francisco",
                lastname: "Sanchez",
                avatar: "https://randomuser.me/api/portraits/men/95.jpg",
                email: "francisco.sanchez@transportes.com",
                phone: "+58-412-9876543",
                licenseExpiry: new Date("2025-05-10"),
            },
            {
                idCard: "V-659876543",
                createdBy: adminId,
                name: "Daniel",
                lastname: "Salazar",
                avatar: "https://randomuser.me/api/portraits/men/3.jpg",
                email: "daniel.salazar@transportes.com",
                phone: "+58-412-0123456",
                licenseExpiry: new Date("2024-03-20"),
            },
            {
                idCard: "V-567890123",
                createdBy: adminId,
                name: "Carlos",
                lastname: "Ramirez",
                avatar: "https://randomuser.me/api/portraits/men/89.jpg",
                email: "carlos.ramirez@transportes.com",
                phone: "+58-412-9876543",
                licenseExpiry: new Date("2025-02-28"),
            },
            {
                idCard: "V-901234567",
                createdBy: adminId,
                name: "Julian",
                lastname: "Garcia",
                avatar: "https://randomuser.me/api/portraits/men/93.jpg",
                email: "julian.garcia@transportes.com",
                phone: "+58-412-6543210",
                licenseExpiry: new Date("2025-04-15"),
            },
            {
                idCard: "V-439876543",
                createdBy: adminId,
                name: "Samuel",
                lastname: "Herrera",
                avatar: "https://randomuser.me/api/portraits/men/5.jpg",
                email: "samuel.herrera@transportes.com",
                phone: "+58-412-8901234",
                licenseExpiry: new Date("2025-11-30"),
            },
            {
                idCard: "V-12345678",
                createdBy: adminId,
                name: "Jose",
                lastname: "Gonzales",
                avatar: "https://randomuser.me/api/portraits/men/85.jpg",
                email: "jose.gonzales@transportes.com",
                phone: "+58-412-8765432",
                licenseExpiry: new Date("2024-12-31"),
            },
            {
                idCard: "V-778901234",
                createdBy: adminId,
                name: "Miguel",
                lastname: "Flores",
                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                email: "miguel.flores@transportes.com",
                phone: "+58-412-2345678",
                licenseExpiry: new Date("2025-08-15"),
            },
            {
                idCard: "V-789012345",
                createdBy: adminId,
                name: "Pedro",
                lastname: "Martinez",
                avatar: "https://randomuser.me/api/portraits/men/91.jpg",
                email: "pedro.martinez@transportes.com",
                phone: "+58-412-3334445",
                licenseExpiry: new Date("2025-03-20"),
            },
            {
                idCard: "V-334567890",
                createdBy: adminId,
                name: "Alejandro",
                lastname: "Perez",
                avatar: "https://randomuser.me/api/portraits/men/97.jpg",
                email: "alejandro.perez@transportes.com",
                phone: "+58-412-4445556",
                licenseExpiry: new Date("2025-06-15"),
            },
            {
                idCard: "V-219876543",
                createdBy: adminId,
                name: "Leonardo",
                lastname: "Navarro",
                avatar: "https://randomuser.me/api/portraits/men/7.jpg",
                email: "leonardo.navarro@transportes.com",
                phone: "+58-412-6789012",
                licenseExpiry: new Date("2025-10-25"),
            },
            {
                idCard: "V-879876543",
                createdBy: adminId,
                name: "Antonio",
                lastname: "Bernal",
                avatar: "https://randomuser.me/api/portraits/men/2.jpg",
                email: "antonio.bernal@transportes.com",
                phone: "+58-412-2345678",
                licenseExpiry: new Date("2025-01-10"),
            },
        ];

        const insertedDrivers: IDriver[] = await Driver.insertMany(drivers);
        if (!insertedDrivers) return;
        insertedDriverIds = insertedDrivers.map((driver) => driver._id); // Almacenar los IDs de los conductores
        logger.info("Drivers inserted successfully");

        const vehiclesBase = [
            {
                plate: "ABC123",
                model_id: "Corolla",
                year: 2023,
                color: "Blanco",
                capacity: 4,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "DEF456",
                model_id: "Civic",
                year: 2022,
                color: "Rojo",
                capacity: 4,
                status: false,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "GHI789",
                model_id: "Focus",
                year: 2021,
                color: "Azul",
                capacity: 5,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "JKL012",
                model_id: "Corolla",
                year: 2019,
                color: "Plata",
                capacity: 5,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "MNO345",
                model_id: "Civic",
                year: 2017,
                color: "Negro",
                capacity: 4,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "PQR678",
                model_id: "Focus",
                year: 2015,
                color: "Gris",
                capacity: 4,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "STU901",
                model_id: "Corolla",
                year: 2023,
                color: "Azul Oscuro",
                capacity: 5,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "VWX234",
                model_id: "Civic",
                year: 2018,
                color: "Rojo Oscuro",
                capacity: 4,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "YZA567",
                model_id: "Focus",
                year: 2016,
                color: "Blanco Perla",
                capacity: 4,
                status: false, // ya estaba en false
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "BCD890",
                model_id: "Corolla",
                year: 2022,
                color: "Plata Metalico",
                capacity: 5,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "EFG123",
                model_id: "Civic",
                year: 2021,
                color: "Negro Brillante",
                capacity: 4,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "HIJ456",
                model_id: "Focus",
                year: 2014,
                color: "Gris Titanio",
                capacity: 5,
                status: false,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "KLM789",
                model_id: "Corolla",
                year: 2023,
                color: "Azul Metalico",
                capacity: 5,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "NOP012",
                model_id: "Civic",
                year: 2019,
                color: "Blanco Pearl",
                capacity: 5,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "QRS345",
                model_id: "Focus",
                year: 2013,
                color: "Gris Claro",
                capacity: 7,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "STU678",
                model_id: "Corolla",
                year: 2022,
                color: "Negro Mate",
                capacity: 7,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "VWX901",
                model_id: "Civic",
                year: 2021,
                color: "Plata Brillante",
                capacity: 7,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "YZA234",
                model_id: "Focus",
                year: 2012,
                color: "Blanco Industrial",
                capacity: 5,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "BCD567",
                model_id: "Corolla",
                year: 2023,
                color: "Gris Carbon",
                capacity: 5,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "EFG890",
                model_id: "Civic",
                year: 2022,
                color: "Azul Profundo",
                capacity: 5,
                status: false,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "GHJ123",
                model_id: "Focus",
                year: 2020,
                color: "Rojo Carmesí",
                capacity: 4,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "IJK456",
                model_id: "Corolla",
                year: 2021,
                color: "Verde Oliva",
                capacity: 5,
                status: false,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "LMN789",
                model_id: "Civic",
                year: 2020,
                color: "Naranja Bronce",
                capacity: 4,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "OPQ012",
                model_id: "Focus",
                year: 2018,
                color: "Amarillo Mostaza",
                capacity: 5,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "RST345",
                model_id: "Corolla",
                year: 2022,
                color: "Gris Cemento",
                capacity: 4,
                status: false,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "UVW678",
                model_id: "Civic",
                year: 2019,
                color: "Azul Acero",
                capacity: 4,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "XYZ901",
                model_id: "Focus",
                year: 2017,
                color: "Beige Arena",
                capacity: 5,
                status: false,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
            {
                plate: "ABC234",
                model_id: "Corolla",
                year: 2020,
                color: "Negro Azabache",
                capacity: 6,
                status: true,
                picture:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/960px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
            },
            {
                plate: "DEF567",
                model_id: "Civic",
                year: 2016,
                color: "Gris Oscuro",
                capacity: 4,
                status: true,
                picture:
                    "https://mma.prnewswire.com/media/963411/2020_Honda_Civic_Si_Coupe.jpg?p=facebook",
            },
            {
                plate: "GHI890",
                model_id: "Focus",
                year: 2023,
                color: "Celeste",
                capacity: 5,
                status: true,
                picture:
                    "https://5659238.fs1.hubspotusercontent-na1.net/hubfs/5659238/ford%202019.webp",
            },
        ];

        const vehicles = vehiclesBase.map((v, i) => {
            const modelId = vehicleModelMap.get(v.model_id)?._id;
            const driverId = insertedDrivers[i]?._id; // Check if driver exists
            if (!modelId) {
                logger.warn(`Model ID not found for model: ${v.model_id}`);
            }
            if (!driverId) {
                logger.warn(`Driver not found for index: ${i}`);
            }

            return {
                plate: v.plate,
                createdBy: adminId,
                model_id: modelId,
                year: new Date(v.year, 0),
                color: v.color,
                capacity: v.capacity,
                driver_id: driverId,
                status: v.status,
                picture: v.picture,
            };
        });

        // Insertar los vehículos
        await Vehicle.insertMany(vehicles);
        logger.info("Vehicles inserted successfully");
        process.exit(0);
    } catch (error) {
        logger.debug(`Error inserting vehicles`);
        logger.error(error);

        if (insertedDriverIds.length > 0) {
            await Driver.deleteMany({ _id: { $in: insertedDriverIds } });
            logger.debug("Removed inserted drivers due to error");
        }

        process.exit(1);
    }
};

seedVehiclesAndDrivers();
