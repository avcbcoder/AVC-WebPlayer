import React from "react";
import styled from "styled-components";
import {ID} from '../../../constants'

const Box = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  /* position: fixed;
  top: 0;
  left: 0; */
`;

export default class WindowView extends React.Component {
  componentDidMount() {
    const { onLoad } = this.props;
    const img = document.getElementById("img-432");
    img.onload = () => {
      onLoad();
    };
  }

  render() {
    const { ratio } = this.props;
    const width = ratio * 16;
    const height = ratio * 9;
    return (
      <Box id={ID.FRAME.SPOTIFY} width={width} height={height}>
        <img
          id="img-432"
          width={width + "px"}
          height={height + "px"}
          alt=""
          src="https://images7.alphacoders.com/905/905837.jpg"
        />
      </Box>
    );
  }
}
