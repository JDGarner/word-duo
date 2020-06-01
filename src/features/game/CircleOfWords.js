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
import {
  containerColors,
  getCircleCoordinatesForAngle,
  pointInsideBounds,
  pointOutsideBounds,
  pointInsideAnyBounds,
} from "./game-utils";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { BUFFER_AMOUNT } from "./game-constants";

const AnimatedLine = Animated.createAnimatedComponent(Line);

Animated.addWhitelistedNativeProps({ x1: true, x2: true, y1: true, y2: true });

const { set, cond, block, eq, neq, add, and, Value } = Animated;
const TOP_BAR_HEIGHT = getStatusBarHeight();

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
    this.lineEnds = this.props.words.map(w => ({ x: new Value(0), y: new Value(0) }));
    this.wordDimensions = this.props.words.map(w => ({
      centreX: new Value(0),
      centreY: new Value(0),
      x1: new Value(0),
      x2: new Value(0),
      y1: new Value(0),
      y2: new Value(0),
    }));

    this.state = {
      wordState: getInitialWordState(this.props.words),
      circlePositionX: null,
      circlePositionY: null,
      allPositionsSet: false,
    };

    this.panHandlers = this.props.words.map((w, i) => this.getEventHandlerForWord(i));
  }

  getInsideWordBoundsConditions = (index, absoluteX, absoluteY) => {
    return this.wordDimensions.map(wd => {
      return cond(eq(pointInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), true), [
        set(this.lineEnds[index].x, wd.centreX),
        set(this.lineEnds[index].y, wd.centreY),
      ]);
    });
  };

  // getOutsideWordBoundsConditions = (index, absoluteX, absoluteY, state) => {
  //   return this.wordDimensions.map(wd => {
  //     return cond(
  //       and(
  //         eq(state, State.END),
  //         neq(pointInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), true),
  //       ),
  //       [
  //         set(this.lineEnds[index].x, this.wordDimensions[index].centreX),
  //         set(this.lineEnds[index].y, this.wordDimensions[index].centreY),
  //       ],
  //     );
  //   });
  // };

  getOutsideWordBoundsCondition = (index, absoluteX, absoluteY, state) => {
    return cond(
      and(
        eq(state, State.END),
        neq(
          pointInsideAnyBounds({ x: absoluteX, y: absoluteY }, this.wordDimensions, Animated),
          true,
        ),
      ),
      [
        set(this.lineEnds[index].x, this.wordDimensions[index].centreX),
        set(this.lineEnds[index].y, this.wordDimensions[index].centreY),
      ],
    );
  };

  getEventHandlerForWord = index => {
    return Animated.event([
      {
        nativeEvent: ({ translationX, translationY, state, absoluteX, absoluteY }) => {
          return block([
            set(this.lineEnds[index].x, add(translationX, this.wordDimensions[index].centreX)),
            set(this.lineEnds[index].y, add(translationY, this.wordDimensions[index].centreY)),
            [...this.getInsideWordBoundsConditions(index, absoluteX, absoluteY)],
            // [...this.getOutsideWordBoundsConditions(index, absoluteX, absoluteY, state)],
            this.getOutsideWordBoundsCondition(index, absoluteX, absoluteY, state),
          ]);
        },
      },
    ]);
  };

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

    wordState.forEach((w, i) => {
      this.wordDimensions[i].centreX.setValue(circlePositionX + w.centerX);
      this.wordDimensions[i].centreY.setValue(circlePositionY + w.centerY);
      this.wordDimensions[i].x1.setValue(circlePositionX + w.x - BUFFER_AMOUNT);
      this.wordDimensions[i].x2.setValue(circlePositionX + w.x + w.width + BUFFER_AMOUNT);
      this.wordDimensions[i].y1.setValue(circlePositionY + w.y + TOP_BAR_HEIGHT - BUFFER_AMOUNT);
      this.wordDimensions[i].y2.setValue(
        circlePositionY + w.y + w.height + TOP_BAR_HEIGHT + BUFFER_AMOUNT,
      );
    });
  };

  render() {
    const { wordState, circlePositionX, circlePositionY } = this.state;

    return (
      <ContentContainer>
        <SvgContainer>
          <Svg height={screenHeight} width={screenWidth}>
            {wordState.map(w => (
              <AnimatedLine
                x1={circlePositionX + w.centerX}
                x2={this.lineEnds[w.index].x}
                y1={circlePositionY + w.centerY}
                y2={this.lineEnds[w.index].y}
                stroke={w.color}
                strokeWidth="7"
              />
            ))}
          </Svg>
        </SvgContainer>
        <Circle onLayout={this.onCircleLayout}>
          {wordState.map(w => (
            <WordContainer
              onLayout={e => this.onWordLayout(e, w)}
              x={w.x || 0}
              y={w.y || 0}
              color={w.color}>
              <PanGestureHandler
                minDist={2}
                onGestureEvent={this.panHandlers[w.index]}
                onHandlerStateChange={this.panHandlers[w.index]}>
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
