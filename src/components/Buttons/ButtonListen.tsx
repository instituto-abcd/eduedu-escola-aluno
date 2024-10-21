import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { useId } from "react";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonListen({ children: _, size = 50, ...props }: Props) {
  const id1 = useId();
  const id2 = useId();

  return (
    <UnstyledButton {...props}>
      <svg
        style={{ minWidth: size, minHeight: size }}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath={`url(#${id1})`}>
          <path
            d="M25 0C11.197 0 0 11.197 0 25s11.197 25 25 25 25-11.197 25-25S38.81 0 25 0"
            fill={`url(#${id2})`}
          />
          <path
            d="M25 0C17.891 0 11.481 2.974 6.931 7.737A24.9 24.9 0 0 1 24.206.794c13.81 0 25 11.197 25 25 0 6.7-2.642 12.778-6.931 17.269C47.032 38.513 50 32.103 50 25c.006-13.803-11.19-25-25-25"
            fill="#686159"
            style={{
              mixBlendMode: "screen",
            }}
          />
          <path
            d="M29.235 33.21a1.286 1.286 0 0 1-.908-2.198l.53-.528c2.222-2.22 2.935-4.67 2.12-7.276a8.7 8.7 0 0 0-1.884-3.2l-.52-.517a1.287 1.287 0 0 1 1.814-1.825l.53.527c.306.313 1.776 1.9 2.514 4.244.774 2.472.924 6.19-2.756 9.869l-.532.529c-.25.25-.58.375-.908.375"
            fill="#fff"
          />
          <path
            d="M32.301 36.482a1.287 1.287 0 0 1-.908-2.198l.79-.787c4.349-4.349 4.203-8.642 3.315-11.48-.902-2.86-2.749-4.807-2.957-5.02l-.782-.777a1.286 1.286 0 0 1 1.815-1.824l.79.785c.428.438 2.53 2.703 3.589 6.066 1.1 3.517 1.309 8.81-3.952 14.071l-.792.788c-.251.25-.58.376-.908.376"
            fill="#fff"
          />
          <path
            d="M36.145 38.414c-.496-.597-.5-1.551.004-2.14l.79-.927c4.348-5.116 4.203-10.169 3.314-13.507-.901-3.367-2.748-5.657-2.956-5.907l-.782-.915c-.504-.59-.807-1.519-.306-2.111.5-.593 1.617-.625 2.12-.036l.79.924c.428.516 2.53 3.182 3.59 7.138 1.1 4.138 1.308 10.368-3.953 16.557l-.791.928c-.252.294-1.28.644-1.82-.004M6.35 27.56a3.225 3.225 0 0 0 3.217 3.216h1.23c1.769 0 4.378.863 5.798 1.918l5.657 4.205c1.42 1.056 2.581.472 2.581-1.297V14.709c0-1.769-1.161-2.353-2.581-1.298l-5.657 4.204c-1.42 1.056-4.03 1.919-5.798 1.919h-1.23a3.226 3.226 0 0 0-3.216 3.216z"
            fill="#fff"
          />
        </g>
        <defs>
          <linearGradient
            id={id2}
            x1={-7.426}
            y1={57.426}
            x2={50.743}
            y2={-0.743}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B2B2B2" />
            <stop offset={1} stopColor="#EFEFEF" />
          </linearGradient>
          <clipPath id={id1}>
            <path fill="#fff" d="M0 0h50v50H0z" />
          </clipPath>
        </defs>
      </svg>
    </UnstyledButton>
  );
}

export const ButtonListen = createPolymorphicComponent<"button", Props>(
  _ButtonListen,
);
