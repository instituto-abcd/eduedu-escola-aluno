import { createStyles } from "@mantine/core";
import { EduEduLogo } from "~/components/icons/EduEduLogo";
import { MEDIA_QUERY } from "~/constants/dimensions";
import {
	CharacterStudent,
	CharacterProfessor,
} from "~/components/vector/Character";
import { env } from "~/env";

const useStyles = createStyles(() => ({
	container: {
		display: "flex",
		flexDirection: "column",
		width: "100vw",
		minHeight: "100vh",
		userSelect: "none",

		[`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
			flexDirection: "row",
		},
	},

	selectionBox: {
		width: "100%",
		height: "50vh",
		filter: "grayscale(1)",
		transition: "filter 200ms ease-in-out",
		position: "relative",
		containerType: "inline-size",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		[`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
			height: "100vh",
			width: "50vw",
			justifyContent: "flex-end",
			paddingBottom: 120,
			gap: 80,
		},

		":hover": {
			filter: "none",
		},

		h2: {
			margin: 0,
			width: "fit-content",
			height: "fit-content",
			fontSize: "min(10cqw, 52px)",
			fontWeight: "bold",
			color: "white",
		},
	},

	floatingLogo: {
		position: "fixed",
		bottom: "1.5rem",
		right: "1.5rem",
		zIndex: 5,
		pointerEvents: "none",
	},

	character: {
		width: "auto",
		height: "60%",
		maxHeight: 250,
		[`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
			height: "auto",
		},
	},

	bg_student: {
		backgroundColor: "#3b93c4",
	},
	bg_professor: {
		backgroundColor: "#f6a314",
	},
}));

type Profile = "STUDENT" | "TEACHER";

export function ProfileSelection({ onNext }: { onNext: () => void }) {
	const { classes, cx } = useStyles();

	function handleSelection(value: Profile) {
		if (value === "STUDENT") return onNext();
		if (value === "TEACHER") return window.open(env.VITE_ADMIN_URL);
	}

	return (
		<div className={classes.container}>
			<div
				className={cx([classes.selectionBox, classes.bg_student])}
				onClick={() => handleSelection("STUDENT")}
			>
				<CharacterStudent className={classes.character} />
				<h2>Aluno</h2>
			</div>
			<div
				className={cx([classes.selectionBox, classes.bg_professor])}
				onClick={() => handleSelection("TEACHER")}
			>
				<CharacterProfessor className={classes.character} />
				<h2>Professor</h2>
			</div>

			<EduEduLogo className={classes.floatingLogo} />
		</div>
	);
}
