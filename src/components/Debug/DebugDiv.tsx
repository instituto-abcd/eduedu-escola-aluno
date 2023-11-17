import { debug_getNumberIcon } from ".";

export const DebugDiv: React.FC<{
  children?: React.ReactNode;
  position?: unknown;
}> = ({ children, position }) => {
  const styles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    transform: "translate(50%, 50%)",
    zIndex: 5,
    pointerEvents: "none",
    color: "#25abe6",
  };

  if (position !== undefined)
    return <div style={styles}>{debug_getNumberIcon(position)}</div>;

  return (
    <div style={styles}>
      {typeof children === "boolean" ? (children ? "✅" : "❌") : children}
    </div>
  );
};
