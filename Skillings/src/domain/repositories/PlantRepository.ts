import { PlantTypes } from "../entities/Plant";

type PlantRepositoryImpl = {
    GetPlants(): Promise<PlantTypes[]>;
};

export default PlantRepositoryImpl;
