import { useDraggable } from "@dnd-kit/core";
import { ReactNode, useId } from "react";

type Props = {
  children: ReactNode;
  element?: JSX.ElementType;
};

export function Draggable({ children, element }: Props) {
  const id = useId();
  const { setNodeRef, attributes, listeners } = useDraggable({ id });
  const Element = element || "div";

  return (
    <Element
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </Element>
  );
}
