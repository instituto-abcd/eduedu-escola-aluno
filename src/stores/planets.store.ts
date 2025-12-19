import { create } from "zustand";

type PlanetsLimitStore = {
	canExecuteAnyPlanet: boolean;
	hideLastPlanets: boolean;
	usePlanetAvailability: boolean;
};

export const usePlanetsLimitStore = create<PlanetsLimitStore>()(() => ({
	usePlanetAvailability: true,
	hideLastPlanets: true,
	canExecuteAnyPlanet: false,
}));
