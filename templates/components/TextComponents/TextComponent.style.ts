import { TextComponentProps } from "./TextComponents.tsx";
import { css } from "styled-components";

export const baseTextStyle = css<TextComponentProps>`
  margin: 0;
  padding: 0;
  color: ${(props) => props.color};
  text-align: ${(props) => props.align};
`;

export const TextTypesStyles = {};
