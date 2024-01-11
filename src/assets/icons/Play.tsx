import { SVGProps } from "react";

export const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width} 
    height={props.height} 
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    stroke="currentColor" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path 
      stroke="none" 
      d="M0 0h24v24H0z" 
      fill="none"
    />
    <path 
      d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" 
      strokeWidth="0" 
      fill="currentColor" 
    />
  </svg>
);
