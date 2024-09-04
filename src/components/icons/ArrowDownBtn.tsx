import { SVGProps } from "react";

export function ArrowDownBtn(
  props: SVGProps<SVGSVGElement> & { color?: string },
) {
  return (
    <svg
      preserveAspectRatio="xMinYMin meet"
      overflow="visible"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0ZM58.0313 42.6093L41.6178 62.9766C41.2021 63.4928 40.6009 63.7507 40 63.7507C39.3991 63.7507 38.7978 63.4928 38.3821 62.9766L21.9687 42.6093C20.8734 41.2499 21.8411 39.2275 23.5864 39.2275H30.0063V16.2493H49.9936V39.2275H56.4135C58.1589 39.2275 59.1265 41.2499 58.0313 42.6093Z"
        fill={props.color ?? "white"}
      />
    </svg>
  );
}
