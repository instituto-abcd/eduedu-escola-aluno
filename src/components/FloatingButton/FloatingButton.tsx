import { IconChevronDown } from "@tabler/icons-react";
import { motion } from "framer-motion";
import styles from "./FloatingButtonStyles.module.css";

const bounceTransition = {
    y: {
        duration: 0.5,
        yoyo: Infinity,
        ease: "easeOut",
    }
}

export const FloatingButton = () => {
    return (
        <motion.button 
            className={styles.container} 
            transition={bounceTransition} 
            animate={{ y: ["-50%", "50%"]}}
        >
            <IconChevronDown size={25} color="#FFF" />
        </motion.button>
    );
}
