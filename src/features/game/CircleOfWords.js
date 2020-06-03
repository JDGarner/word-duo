import React, { Component } from "react";
import { View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Svg, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import { cloneDeep, capitalize } from "lodash";
import styled from "styled-components";
import { screenHeight, screenWidth } from "../../utils/sizing-utils";
import { MediumLargeText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import {
  containerColors,
  getCircleCoordinatesForAngle,
  valueNotInsideAnyBounds,
  getAbsoluteCoordinatesWithBuffer,
  valueInsideBounds,
} from "./game-utils";

const AnimatedLine = Animated.createAnimatedComponent(Line);

Animated.addWhitelistedNativeProps({ x1: true, x2: true, y1: true, y2: true });

const { set, cond, block, eq, add, and, or, call, Value } = Animated;

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

const DIAMETER = screenWidth - 160;
const RADIUS = DIAMETER / 2;

const Circle = styled(View)`
  height: ${DIAMETER};
  width: ${DIAMETER};
  /* border-width: 1;
  border-color: red; */
  position: relative;
  border-radius: ${RADIUS};
`;

const WordContainer = styled(Animated.View)`
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
      text: w.text,
      color: containerColors[i],
      matchedColor: containerColors[i],
      index: i,
      width: null,
      height: null,
      x: null,
      y: null,
      centreX: null,
      centreY: null,
      originWordX: null,
      originWordY: null,
      matchedWordX: null,
      matchedWordY: null,
      angle: i * (360 / words.length),
      isMatched: false,
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
      x1Value: new Value(0),
      x2Value: new Value(0),
      y1Value: new Value(0),
      y2Value: new Value(0),
      index: i,
      isMatched: new Value(false),
      scaleValue: new Value(1),
    }));

    this.scaleValueIncrease = new Value(0.2);

    this.state = {
      wordState: getInitialWordState(this.props.words),
      circlePositionX: null,
      circlePositionY: null,
      allPositionsSet: false,
    };

    this.panHandlers = this.props.words.map((w, i) => this.getEventHandlerForWord(i));
  }

  onMatchWords = (originWord, destinationWord) => {
    const wordState = cloneDeep(this.state.wordState);
    const originWordState = wordState[originWord.index];
    const destinationWordState = wordState[destinationWord.index];

    originWordState.isMatched = true;
    destinationWordState.isMatched = true;
    originWordState.matchedColor = destinationWordState.color;
    originWordState.originWordX = originWordState.centreX / DIAMETER;
    originWordState.originWordY = originWordState.centreY / DIAMETER;
    originWordState.matchedWordX = destinationWordState.centreX / DIAMETER;
    originWordState.matchedWordY = destinationWordState.centreY / DIAMETER;

    if (wordState.every(w => w.isMatched)) {
      setTimeout(() => {
        this.props.onAllWordsMatched();
      }, 750);
    } else {
      originWord.isMatched.setValue(true);
      destinationWord.isMatched.setValue(true);
    }

    this.setState({ wordState });
  };

  onMatchedSomeWord = (matchedWord, index) => {
    if (
      matchedWord.index !== index &&
      !this.state.wordState[matchedWord.index].isMatched &&
      !this.state.wordState[index].isMatched
    ) {
      this.onMatchWords(this.wordDimensions[index], matchedWord);
    }
  };

  onDragOverAnotherWord = (index, { absoluteX, absoluteY, state }) => {
    return this.wordDimensions
      .filter(w => w.index !== index)
      .map(wd => {
        return cond(
          eq(this.wordDimensions[index].isMatched, false),
          cond(
            eq(valueInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), true),
            [
              // If drag is inside wd and ACTIVE -> SNAP TO ITS CENTRE
              cond(eq(state, State.ACTIVE), [
                set(this.lineEnds[index].x, wd.centreX),
                set(this.lineEnds[index].y, wd.centreY),
                set(wd.scaleValue, new Value(1.2)),
              ]),
              // If drag is inside another word and ENDED -> MATCH IT
              cond(eq(state, State.END), call([], () => this.onMatchedSomeWord(wd, index))),
            ],
            cond(eq(state, State.ACTIVE), set(wd.scaleValue, new Value(1))),
          ),
        );
      });
  };

  // If drag gesture is not inside any box, reset it to original place
  onDragEndResetLinePosition = (index, { absoluteX, absoluteY, state }) => {
    return cond(
      and(
        eq(state, State.END),
        eq(this.wordDimensions[index].isMatched, false),
        valueNotInsideAnyBounds({ x: absoluteX, y: absoluteY }, this.wordDimensions, Animated),
      ),
      [
        set(this.lineEnds[index].x, this.wordDimensions[index].centreX),
        set(this.lineEnds[index].y, this.wordDimensions[index].centreY),
      ],
    );
  };

  onDragEndResetScale = (index, { absoluteX, absoluteY, state }) => {
    const filtered = this.wordDimensions.filter(w => w.index !== index);

    return cond(
      and(
        eq(state, State.END),
        eq(this.wordDimensions[index].isMatched, false),
        valueNotInsideAnyBounds({ x: absoluteX, y: absoluteY }, filtered, Animated),
      ),
      set(this.wordDimensions[index].scaleValue, new Value(1)),
    );
  };

  updateLineOnDrag = (index, { translationX, translationY, state }) => {
    return cond(eq(state, State.ACTIVE), [
      set(this.lineEnds[index].x, add(translationX, this.wordDimensions[index].centreX)),
      set(this.lineEnds[index].y, add(translationY, this.wordDimensions[index].centreY)),
    ]);
  };

  updateScaleOnDrag = (index, { state }) => {
    return cond(
      or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
      set(this.wordDimensions[index].scaleValue, new Value(1.2)),
    );
  };

  getEventHandlerForWord = index => {
    return Animated.event([
      {
        nativeEvent: event => {
          return block([
            this.updateLineOnDrag(index, event),
            this.updateScaleOnDrag(index, event),
            this.onDragEndResetLinePosition(index, event),
            this.onDragEndResetScale(index, event),
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
      this.wordDimensions[i].x1Value.setValue(x1);
      this.wordDimensions[i].x2Value.setValue(x2);
      this.wordDimensions[i].y1Value.setValue(y1);
      this.wordDimensions[i].y2Value.setValue(y2);
    });

    this.lineEnds.forEach((l, i) => {
      l.x.setValue(this.wordDimensions[i].centreX);
      l.y.setValue(this.wordDimensions[i].centreY);
    });
  };

  render() {
    const { wordState, circlePositionX, circlePositionY } = this.state;

    return (
      <ContentContainer>
        <SvgContainer>
          <Svg height={screenHeight} width={screenWidth}>
            <Defs>
              {wordState.map(w => (
                <LinearGradient
                  id={`grad-${w.index}`}
                  x1={w.originWordX || 0}
                  y1={w.originWordY || 0}
                  x2={w.matchedWordX || 0}
                  y2={w.matchedWordY || 0}
                  key={`${w.text}=def`}>
                  <Stop offset="0" stopColor={w.color} stopOpacity="1" />
                  <Stop offset="1" stopColor={w.matchedColor} stopOpacity="1" />
                </LinearGradient>
              ))}
            </Defs>
            {wordState.map(w => (
              <AnimatedLine
                key={w.text}
                x1={circlePositionX + w.centreX}
                x2={this.lineEnds[w.index].x}
                y1={circlePositionY + w.centreY}
                y2={this.lineEnds[w.index].y}
                stroke={`url(#grad-${w.index})`}
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
              color={w.color}
              style={{ transform: [{ scale: this.wordDimensions[w.index].scaleValue }] }}>
              <PanGestureHandler
                enabled={!w.isMatched}
                minDist={0}
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
