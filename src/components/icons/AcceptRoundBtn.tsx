import { SVGProps, useId } from "react";

export function AcceptRoundBtn(props: SVGProps<SVGSVGElement>) {
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
          d="M92.084 18.092a54.17 54.17 0 0 1 20.15 73.42 54.173 54.173 0 0 1-73.171 21.041A54.17 54.17 0 0 1 10.86 66.756L10.834 65l.027-1.755a54.166 54.166 0 0 1 81.223-45.153M85.08 50.337a5.42 5.42 0 0 0-7.15-.45l-.51.45-17.836 17.832-7.004-6.999-.51-.45a5.417 5.417 0 0 0-7.599 7.6l.45.51 10.833 10.833.51.45a5.416 5.416 0 0 0 6.64 0l.51-.45L85.08 57.996l.45-.509a5.416 5.416 0 0 0-.45-7.15"
          fill="#00A958"
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
