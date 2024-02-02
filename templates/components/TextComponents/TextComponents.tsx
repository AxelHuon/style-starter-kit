import React from "react";
import styled from "styled-components";
import { htmlTagType, StyleTypeInteface } from "./TextComponent.type.ts";
import { baseTextStyle, TextTypesStyles } from "./TextComponent.style.ts";

export interface TextComponentProps {
  children: React.ReactNode;
  htmlTag: htmlTagType;
  color?: string;
  styleType: StyleTypeInteface | null;
  align?: "left" | "center" | "right";
}

const TextComponentStyle = styled.p<TextComponentProps>`
  ${baseTextStyle}
  ${({ styleType }) => TextTypesStyles[styleType as StyleTypeInteface] || ""}
`;

const TextComponent: React.FC<TextComponentProps> = ({
  children,
  htmlTag,
  color = "#000",
  styleType,
  align = "left",
}) => {
  const props = {
    children,
    htmlTag,
    color,
    styleType,
    align,
  };

  return (
    <TextComponentStyle as={htmlTag} {...props}>
      {children}
    </TextComponentStyle>
  );
};

export default TextComponent;
