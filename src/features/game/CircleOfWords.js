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
  pointNotInsideAnyBounds,
  getAbsoluteCoordinatesWithBuffer,
} from "./game-utils";

const AnimatedLine = Animated.createAnimatedComponent(Line);

Animated.addWhitelistedNativeProps({ x1: true, x2: true, y1: true, y2: true });

const { set, cond, block, eq, add, and, call, Value } = Animated;

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
  width: 145;
`;
// TODO: decide on fixed or dynamic width
// (if using fixed can remove onLayout logic to check width)

const WordText = styled(MediumLargeText)`
  /* padding-horizontal: 18; */
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
      centreX: null,
      centreY: null,
      angle: i * (360 / words.length),
      matched: false,
    };
  });
};

export default class CircleOfWords extends Component {
  constructor(props) {
    super(props);
    this.lineEnds = this.props.words.map(w => ({ x: new Value(0), y: new Value(0) }));
    this.wordDimensions = this.props.words.map((w, i) => ({
      centreX: new Value(0),
      centreY: new Value(0),
      x1: new Value(0),
      x2: new Value(0),
      y1: new Value(0),
      y2: new Value(0),
      index: i,
    }));

    this.state = {
      wordState: getInitialWordState(this.props.words),
      circlePositionX: null,
      circlePositionY: null,
      allPositionsSet: false,
    };

    this.panHandlers = this.props.words.map((w, i) => this.getEventHandlerForWord(i));
  }

  onDragOverAnotherWord = (index, { absoluteX, absoluteY, state }) => {
    return this.wordDimensions.map(wd => {
      return cond(
        eq(pointInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), true),
        // If drag is inside another word -> SNAP TO ITS CENTRE
        [
          set(this.lineEnds[index].x, wd.centreX),
          set(this.lineEnds[index].y, wd.centreY),

          // If drag has ended inside another word -> MATCH THOSE WORDS
          cond(
            eq(state, State.END),
            call([], () => this.onMatchWords(this.wordDimensions[index], wd)),
          ),
        ],
      );
    });
  };

  onMatchWords = (originWord, destinationWord) => {
    if (originWord.index !== destinationWord.index) {
      const wordState = cloneDeep(this.state.wordState);

      wordState[originWord.index].matched = true;
      wordState[destinationWord.index].matched = true;

      this.setState({ wordState });
    }
  };

  // If drag gesture is not inside any box, reset it to original place
  onDragEndResetLinePosition = (index, { absoluteX, absoluteY, state }) => {
    return cond(
      and(
        eq(state, State.END),
        pointNotInsideAnyBounds({ x: absoluteX, y: absoluteY }, this.wordDimensions, Animated),
      ),
      [
        set(this.lineEnds[index].x, this.wordDimensions[index].centreX),
        set(this.lineEnds[index].y, this.wordDimensions[index].centreY),
      ],
    );
  };

  updateLineOnDrag = (index, { translationX, translationY }) => {
    return [
      set(this.lineEnds[index].x, add(translationX, this.wordDimensions[index].centreX)),
      set(this.lineEnds[index].y, add(translationY, this.wordDimensions[index].centreY)),
    ];
  };

  getEventHandlerForWord = index => {
    return Animated.event([
      {
        nativeEvent: event => {
          return block([
            [...this.updateLineOnDrag(index, event)],
            this.onDragEndResetLinePosition(index, event),
            [...this.onDragOverAnotherWord(index, event)],
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

  // Word/Circle positions have changed, update the state about their positions
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
          centreX: xCoord + RADIUS,
          centreY: yCoord,
          x: startingX + xCoord,
          y: startingY + yCoord,
        };
      });
      this.setState({ wordState: clonedWordState });
    }

    wordState.forEach((w, i) => {
      const { centreX, centreY, x1, x2, y1, y2 } = getAbsoluteCoordinatesWithBuffer(
        { x: circlePositionX, y: circlePositionY },
        w,
      );
      this.wordDimensions[i].centreX.setValue(centreX);
      this.wordDimensions[i].centreY.setValue(centreY);
      this.wordDimensions[i].x1.setValue(x1);
      this.wordDimensions[i].x2.setValue(x2);
      this.wordDimensions[i].y1.setValue(y1);
      this.wordDimensions[i].y2.setValue(y2);
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
                x1={circlePositionX + w.centreX}
                x2={this.lineEnds[w.index].x}
                y1={circlePositionY + w.centreY}
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
                enabled={!w.matched}
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
