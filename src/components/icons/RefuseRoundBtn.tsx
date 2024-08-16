import { SVGProps, useId } from "react";

export function RefuseRoundBtn(props: SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg
      width={130}
      height={130}
      preserveAspectRatio="xMinYMin meet"
      overflow="visible"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath={`url(#${id})`}>
        <rect width={130} height={130} rx={65} fill="#fff" />
        <path
          d="M92.084 18.092a54.17 54.17 0 0 1 20.15 73.42 54.173 54.173 0 0 1-73.171 21.041A54.17 54.17 0 0 1 10.86 66.756L10.834 65l.027-1.755a54.166 54.166 0 0 1 81.223-45.153m-35.15 31.416a5.417 5.417 0 0 0-6.597 8.488L57.336 65l-6.999 7.004-.45.509a5.417 5.417 0 0 0 8.11 7.15L65 72.665l7.004 6.998.51.45a5.416 5.416 0 0 0 7.15-8.11l-7-7.003 7-7.004.449-.509a5.417 5.417 0 0 0-8.11-7.15L65 57.335l-7.004-6.998-.509-.45z"
          fill="#FF0C0C"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <rect width={130} height={130} rx={65} fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}
