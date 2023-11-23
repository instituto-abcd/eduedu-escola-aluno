import { DebugProps, debug_getNumberIcon } from ".";

export const DebugDiv: React.FC<{
  children?: React.ReactNode;
  position?: unknown;
  debug?: DebugProps;
}> = ({ children, position, debug }) => {
  const styles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    transform: debug?.outside ? "translate(-50%, -50%)" : "translate(50%, 50%)",
    zIndex: 5,
    pointerEvents: "none",
    color: "#25abe6",
    fontSize: debug?.size,
  };

  if (position !== undefined && debug?.debugProperty === "position")
    return <div style={styles}>{debug_getNumberIcon(position)}</div>;

  return (
    <div style={styles}>
      {typeof children === "boolean" ? (children ? "✅" : "❌") : children}
    </div>
  );
};
