import { useDebugInfo } from "~/stores/debug-info";
import { usePlanetsLimitStore } from "~/stores/planets.store";

export function PlanetTrackDebug() {
	const planetsLimit = usePlanetsLimitStore();
	const debugAllowed = useDebugInfo();

	if (!debugAllowed.planetTrack) return null;

	return (
		<div className="flex gap-4">
			{planetsLimit.usePlanetAvailability && (
				<button
					type="button"
					className="px-2 py-2 bg-blue-600 font-bold z-20 opacity-100 w-fit rounded-md text-white border-4 border-blue-900"
					onKeyDown={() =>
						usePlanetsLimitStore.setState({ usePlanetAvailability: false })
					}
					onClick={() =>
						usePlanetsLimitStore.setState({ usePlanetAvailability: false })
					}
				>
					Remover limite diário
				</button>
			)}

			{!planetsLimit.canExecuteAnyPlanet && (
				<button
					type="button"
					className="px-2 py-2 bg-blue-600 font-bold z-20 opacity-100 w-fit rounded-md text-white border-4 border-blue-900"
					onClick={() =>
						usePlanetsLimitStore.setState({ canExecuteAnyPlanet: true })
					}
					onKeyDown={() =>
						usePlanetsLimitStore.setState({ canExecuteAnyPlanet: true })
					}
				>
					Listar todos planetas
				</button>
			)}
		</div>
	);
}
