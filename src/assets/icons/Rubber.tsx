import { SVGProps } from "react";

export const RubberIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    id="vector" 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width ?? 40}
    height={props.height ?? 29}
    viewBox="0 0 500 500"
  >
    <path 
      fill="#ef858b" 
      d="M425.43,166 L352.11,92.67a41.48,41.48 0,0 0,-58.65 0h0L189.74,196.4l38.55,89.74 93.49,42.3L425.45,224.62A41.46,41.46 0,0 0,425.43 166Z" 
      fill-rule="evenodd" 
      id="path_0"
    />

    <path 
      fill="#5695d0" 
      d="M321.78,328.44l-132,-132L74.57,311.57a41.45,41.45 0,0 0,0 58.64h0l60.89,61.06H219.1Z"
      id="path_1"
    />

    <path 
      fill="#9c9b9b" 
      d="M90.05,431.27L343.47,431.27A0.43,0.43 0,0 1,343.9 431.7L343.9,435.46A0.43,0.43 0,0 1,343.47 435.89L90.05,435.89A0.43,0.43 0,0 1,89.62 435.46L89.62,431.7A0.43,0.43 0,0 1,90.05 431.27z" 
      id="path_2"
    />
  </svg>
);
