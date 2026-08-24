import { SVGProps } from "react";

export function Char2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      preserveAspectRatio="xMinYMin meet"
      overflow="visible"
      viewBox="0 0 172 288"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* O corpo era um retangulo com gradiente recortado por uma mascara que
          continha a silhueta. Quando a mascara nao era aplicada, sobrava o
          retangulo cru e o personagem virava um bloco de cantos retos. A
          silhueta agora e pintada direto: o gradiente usa gradientUnits
          "userSpaceOnUse", entao o desenho fica identico sem depender de
          suporte a mascara. */}
      <path
        d="M88.87.648C26.509.648.9 38.05.9 84.192V202.09c0 44.5 28.982 81.189 65.909 83.437l32.168 1.958c39.666 2.414 72.923-35.638 72.923-83.435V84.191C170.678 75.944 165.911.649 88.87.649"
        fill="url(#b)"
      />
      <path
        d="M26.594 146.251s17.12 32.792 52.083 38.338 55.457-30.621 57.868-36.891 7.234-32.311-8.921-19.291c0 0-19.048 21.942-49.913 20.255-30.862-1.688-40.507-11.007-40.507-11.007s-11.815-3.942-10.61 8.596"
        fill="#831E60"
      />
      <path
        d="M123.165 144.153c-.275.837-11.191 32.377-40.342 30.167-29.068-2.197-36.427-24.277-36.647-24.963a61.5 61.5 0 0 0 11.822 4.531c23.905 6.508 47.88-1.812 58.905-6.687 3.79-1.675 6.056-2.938 6.262-3.048"
        fill="#D14970"
      />
      <path
        d="M116.903 147.201c-4.943 6.646-16.998 14.898-30.496 15.008-11.424.096-22.23-4.847-28.409-8.321 23.905 6.509 47.88-1.812 58.905-6.687"
        fill="#fff"
      />
      <path
        d="M34.863 144.153s19.726 14.837 50.505 11.65c30.781-3.185 45.328-17.431 45.328-17.431"
        stroke="#4C1035"
        strokeWidth={7.017}
        strokeMiterlimit={10}
      />
      <path
        d="M129.177 139.031s.434-5.204 1.908-6.158 3.384 3.643-1.474 7.46m-94.477 4.731c-.165-.081-2.544-1.793-1.156-3.065 1.387-1.273 4.104.868 4.51 1.532.404.665-.29 3.036-3.354 1.533"
        fill="#4C1035"
      />
      <path
        d="M126.624 101.886c0 21.935-17.781 39.717-39.716 39.717S47.19 123.821 47.19 101.886 64.973 62.17 86.908 62.17s39.716 17.781 39.716 39.716"
        fill="#fff"
      />
      <path
        d="M103.696 101.605c-.166 11.494-7.636 20.708-16.687 20.577-9.053-.13-16.254-9.556-16.088-21.05s7.636-20.705 16.69-20.574c9.05.13 16.251 9.553 16.085 21.047"
        fill="#1D1D1B"
      />
      <path
        d="M75.494 83.507c4.143 1.528 6.524 5.41 5.317 8.67-1.207 3.261-5.544 4.665-9.686 3.138s-6.523-5.41-5.316-8.671 5.543-4.665 9.685-3.137"
        fill="#fff"
      />
      <defs>
        <linearGradient
          id="b"
          x1={82.548}
          y1={-50.475}
          x2={88.85}
          y2={270.906}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#302D3A" />
          <stop offset={0.991} stopColor="#21435F" />
          <stop offset={1} stopColor="#21435F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
