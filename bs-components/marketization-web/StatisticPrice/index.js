import React, { useContext } from "react";
import { Statistic, Card } from "antd";

import styled, { ThemeContext } from "styled-components";

function hexToRgbA(hex, opacity) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      `,${opacity})`
    );
  }
  throw new Error("Bad Hex");
}

const StatisticPrice = ({ title, active, price = 0 }) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <StyleCard color={primaryColor} active={active? 1: 0}>
      <Statistic title={title} value={price} precision={2} suffix="元" />
    </StyleCard>
  );
};

const StyleCard = styled(Card)`
  background-color: ${(props) =>
    props.active ? hexToRgbA(props.color, 1) : "#FFFFFF"};
  &:hover {
    background-color: ${(props) => hexToRgbA(props.color, 0.5)};
    cursor: pointer;
  }
`;
export default StatisticPrice;
