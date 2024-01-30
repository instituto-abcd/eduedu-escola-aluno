import { createStyles } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { motion } from "framer-motion";

const bounceTransition = {
    y: {
        duration: 0.5,
        yoyo: Infinity,
        ease: "easeOut",
    }
}

const useStyles = createStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: "center", 
        alignItems: "center", 
        width: 30,
        height: 30,
        borderRadius: '50%',
        position: "absolute", 
        bottom: 20, 
        right: 5, 
        backgroundColor: "#CCC",
        borderWidth: 0,
        elevation: 5,
        boxShadow: '3px 3px 10px -4px rgba(0,0,0,0.75)',
        WebkitBoxShadow: '3px 3px 10px -4px rgba(0,0,0,0.75)',
        MozBoxShadow: '3px 3px 10px -4px rgba(0,0,0,0.75)',
    },
}));

export const FloatingButton = () => {
    const { classes } = useStyles();

    return (
        <motion.button 
            className={classes.container} 
            transition={bounceTransition} 
            animate={{ y: ["-50%", "50%"]}}
        >
            <IconChevronDown size={25} color="#FFF" />
        </motion.button>
    );
}
