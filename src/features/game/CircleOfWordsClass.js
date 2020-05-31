import React, { Component } from "react";
import { View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Svg, Line } from "react-native-svg";
import { cloneDeep, capitalize } from "lodash";
import styled from "styled-components";
import { screenHeight, screenWidth } from "../../utils/sizing-utils";
import { MediumLargeText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import { containerColors, getCircleCoordinatesForAngle } from "./game-utils";

const AnimatedLine = Animated.createAnimatedComponent(Line);

const { set, cond, block, eq, add, Value } = Animated;

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SvgContainer = styled(View)`
  top: 0;
  left: 0;
  position: absolute;
`;

const DIAMETER = screenWidth - 120;
const RADIUS = DIAMETER / 2;

const Circle = styled(View)`
  height: ${DIAMETER};
  width: ${DIAMETER};
  border-width: 1;
  border-color: red;
  position: relative;
  border-radius: ${RADIUS};
`;

const WordContainer = styled(View)`
  position: absolute;
  top: ${({ y }) => y};
  left: ${({ x }) => x};
  background-color: ${({ color }) => color};
  border-radius: 26;
`;

const WordText = styled(MediumLargeText)`
  padding-horizontal: 18;
  padding-top: ${5 + TEXT_TOP_PADDING};
  padding-bottom: 5;
`;

const getInitialWordState = words => {
  return words.map((w, i) => {
    return {
      text: w,
      color: containerColors[i],
      index: i,
      width: null,
      height: null,
      x: null,
      y: null,
      centerX: null,
      centerY: null,
      angle: i * (360 / words.length),
    };
  });
};

export default class CircleOfWords extends Component {
  constructor(props) {
    super(props);
    this.lineEndX = new Value(0);
    this.lineEndY = new Value(0);
    this.offsetX = new Value(0);
    this.offsetY = new Value(0);

    this.state = {
      wordState: getInitialWordState(this.props.words),
      circlePositionX: null,
      circlePositionY: null,
      allPositionsSet: false,
    };

    this.handlePan = Animated.event([
      {
        nativeEvent: ({ translationX: x, translationY: y, state }) => {
          return block([
            set(this.lineEndX, add(x, this.offsetX)),
            set(this.lineEndY, add(y, this.offsetY)),
            cond(eq(state, State.END), [
              set(this.lineEndX, this.offsetX),
              set(this.lineEndY, this.offsetY),
            ]),
          ]);
        },
      },
    ]);
  }

  onCircleLayout = event => {
    const { x, y } = event.nativeEvent.layout;
    this.setState({ circlePositionX: x, circlePositionY: y }, this.onLayoutUpdate);
  };

  onWordLayout = (event, word) => {
    const { width, height } = event.nativeEvent.layout;

    const wordState = cloneDeep(this.state.wordState);
    wordState[word.index] = { ...word, width, height };
    this.setState({ wordState }, this.onLayoutUpdate);
  };

  onLayoutUpdate = () => {
    const { allPositionsSet, wordState, circlePositionX, circlePositionY } = this.state;

    if (!allPositionsSet && wordState.every(w => w.width) && circlePositionX && circlePositionY) {
      this.setState({ allPositionsSet: true });

      const clonedWordState = cloneDeep(wordState);

      clonedWordState.forEach((w, i) => {
        const { xCoord, yCoord } = getCircleCoordinatesForAngle(w.angle, RADIUS);
        const halfWidth = w.width / 2;
        const halfHeight = w.height / 2;
        const startingX = RADIUS - halfWidth;
        const startingY = -1 * halfHeight;
        clonedWordState[i] = {
          ...w,
          centerX: xCoord + RADIUS,
          centerY: yCoord,
          x: startingX + xCoord,
          y: startingY + yCoord,
        };
      });
      this.setState({ wordState: clonedWordState });
    }

    this.offsetX.setValue(circlePositionX + wordState[1].centerX);
    this.offsetY.setValue(circlePositionY + wordState[1].centerY);
  };

  render() {
    const { wordState, circlePositionX, circlePositionY } = this.state;

    return (
      <ContentContainer>
        <SvgContainer>
          <Svg height={screenHeight} width={screenWidth}>
            <AnimatedLine
              x1={circlePositionX + wordState[1].centerX}
              x2={this.lineEndX}
              y1={circlePositionY + wordState[1].centerY}
              y2={this.lineEndY}
              stroke="red"
              strokeWidth="2"
            />
          </Svg>
        </SvgContainer>
        <Circle onLayout={this.onCircleLayout}>
          {this.state.wordState.map(w => (
            <WordContainer
              onLayout={e => this.onWordLayout(e, w)}
              x={w.x || 0}
              y={w.y || 0}
              color={w.color}>
              <PanGestureHandler
                minDist={2}
                onGestureEvent={this.handlePan}
                onHandlerStateChange={this.handlePan}>
                <Animated.View>
                  <WordText fontWeight="600" color={colors.wordColor}>
                    {capitalize(w.text)}
                  </WordText>
                </Animated.View>
              </PanGestureHandler>
            </WordContainer>
          ))}
        </Circle>
      </ContentContainer>
    );
  }
}
