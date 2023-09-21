import {
  Box,
  Button,
  Image,
  Rating,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { SimplifiedPlanet } from "~/api/student";

const useStyles = createStyles({
  wrapper: {
    position: "relative",
    height: 190,
    width: 160,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(2px)",
    paddingBlock: 13,
  },
  avatar: {
    position: "absolute",
    top: 0,
    transform: "translateY(-50%)",
    zIndex: 5,
  },
});

export function PlanetCard({ planet }: { planet: SimplifiedPlanet }) {
  const { classes } = useStyles();

  return (
    <Box py={40}>
      <Stack className={classes.wrapper} align="center" justify="end">
        <Image
          src={planet.planetAvatar}
          height={120}
          width="auto"
          className={classes.avatar}
        />
        <Text size={14} color="white" weight={600}>
          {planet.planetName}
        </Text>
        <Rating
          readOnly
          defaultValue={planet.stars ?? 0}
          fractions={2}
          size="md"
        />
        {planet.stars == 0 && (
          <Button
            component={Link}
            to={`/planeta/${planet.planetId}`}
            state={{ planet }}
            // disabled={!planet.canExecutePlanet}
          >
            Fazer planeta
          </Button>
        )}
        {planet.stars > 0 && (
          <Button
            component={Link}
            to={`/planeta/${planet.planetId}`}
            state={{ planet }}
            variant="outline"
          >
            Tentar de novo
          </Button>
        )}
      </Stack>
    </Box>
  );
}
