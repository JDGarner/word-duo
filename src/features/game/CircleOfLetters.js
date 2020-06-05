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

const {
  set,
  cond,
  block,
  eq,
  add,
  and,
  or,
  call,
  timing,
  interpolate,
  Extrapolate,
  Value,
  clockRunning,
  startClock,
  stopClock,
  debug,
  Clock,
} = Animated;

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
const LETTER_SIZE = 70;

const OVERLAY_BUFFER = LETTER_SIZE + 20;
const OVERLAY_SIZE = DIAMETER + OVERLAY_BUFFER;

const GameOverlay = styled(View)`
  position: absolute;
  height: ${OVERLAY_SIZE};
  width: ${OVERLAY_SIZE};
  border-radius: ${OVERLAY_SIZE / 2};
  background-color: ${colors.gameOverlayBackground};
`;

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
  border-radius: ${LETTER_SIZE / 2};
  width: ${LETTER_SIZE};
  height: ${LETTER_SIZE};
  align-items: center;
  justify-content: center;
`;
// TODO: decide on fixed or dynamic width
// (if using fixed can remove onLayout logic to check width)

const WordText = styled(MediumLargeText)`
  padding-top: ${TEXT_TOP_PADDING};
`;

const getInitialWordState = letters => {
  return letters.map((w, i) => {
    return {
      text: w,
      // bgColor: containerColors[i],
      // matchedColor: containerColors[i],
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
      angle: i * (360 / letters.length),
      isMatched: false,
    };
  });
};

export default class CircleOfWords extends Component {
  constructor(props) {
    super(props);
    this.lineEnds = this.props.letters.map(w => ({ x: new Value(0), y: new Value(0) }));
    this.wordDimensions = this.props.letters.map((w, i) => ({
      centreX: new Value(0),
      centreY: new Value(0),
      x1Value: new Value(0),
      x2Value: new Value(0),
      y1Value: new Value(0),
      y2Value: new Value(0),
      index: i,
      isMatched: new Value(false),
      isHighlighted: new Value(0),
      isConnected: new Value(false),
    }));

    this.originIndexValue = new Value(0);
    this.currentIndexValue = new Value(0);

    this.state = {
      wordState: getInitialWordState(this.props.letters),
      circlePositionX: null,
      circlePositionY: null,
      allPositionsSet: false,
    };

    this.panHandlers = this.props.letters.map((w, i) => this.getEventHandlerForWord(i));

    this.wordBackgroundColors = this.wordDimensions.map(wd => {
      return interpolate(wd.isHighlighted, {
        inputRange: [0, 1],
        outputRange: [Animated.color(0, 0, 0, 0), Animated.color(188, 133, 163, 1)],
        extrapolate: Extrapolate.CLAMP,
      });
    });

    // this.clock = new Clock();
    // animation = new Value(0);
    // transX = runTiming(this.clock, this.progress, this.animation);
  }

  // Find the line end that matches current index value, update it's position
  setLineEndValue = (translationX, translationY) => {
    return this.lineEnds.map((lineEnd, i) => {
      return cond(
        eq(this.currentIndexValue, new Value(i)),
        this.updateLineEndFromOrigin(translationX, translationY, lineEnd),
      );
    });
  };

  // Update line end position from index that matches origin value
  updateLineEndFromOrigin = (translationX, translationY, lineEnd) => {
    return this.wordDimensions.map((w, i) => {
      return cond(eq(this.originIndexValue, new Value(i)), [
        set(lineEnd.x, add(translationX, this.wordDimensions[i].centreX)),
        set(lineEnd.y, add(translationY, this.wordDimensions[i].centreY)),
      ]);
    });
  };

  onMatchWords = (originWord, destinationWord) => {
    const wordState = cloneDeep(this.state.wordState);
    const originWordState = wordState[originWord.index];
    const destinationWordState = wordState[destinationWord.index];

    originWordState.isMatched = true;
    destinationWordState.isMatched = true;
    // originWordState.matchedColor = destinationWordState.bgColor;
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
    // if (
    //   matchedWord.index !== index &&
    //   !this.state.wordState[matchedWord.index].isMatched &&
    //   !this.state.wordState[index].isMatched
    // ) {
    //   this.onMatchWords(this.wordDimensions[index], matchedWord);
    // }
  };

  setCurrentLetterInChain = index => {
    this.currentLetterIndexInChain = index;
  };

  // onDragOverAnotherWord = (index, { absoluteX, absoluteY, state }) => {
  //   return this.wordDimensions
  //     .filter(w => w.index !== index)
  //     .map(wd => {
  //       return cond(
  //         eq(this.wordDimensions[index].isMatched, false),
  //         cond(
  //           eq(valueInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), true),
  //           [
  //             // If drag is inside wd and ACTIVE -> SNAP TO ITS CENTRE
  //             cond(eq(state, State.ACTIVE), [
  //               set(this.lineEnds[index].x, wd.centreX),
  //               set(this.lineEnds[index].y, wd.centreY),
  //               set(wd.isHighlighted, new Value(1)),
  //               set(wd.isConnected, new Value(true)),
  //               set(this.currentIndexValue, new Value(wd.index)),
  //             ]),
  //             // If drag is inside another word and ENDED -> MATCH IT
  //             cond(eq(state, State.END), [call([], () => this.onMatchedSomeWord(wd, index))]),
  //           ],
  //           // cond(eq(state, State.ACTIVE), set(wd.isHighlighted, new Value(0))),
  //         ),
  //       );
  //     });
  // };

  // If drag gesture is not inside any box, reset it to original place
  onDragEndResetLine = (index, { absoluteX, absoluteY, state }) => {
    const filtered = this.wordDimensions.filter(w => w.index !== index);

    return cond(
      and(
        eq(state, State.END),
        eq(this.wordDimensions[index].isMatched, false),
        valueNotInsideAnyBounds({ x: absoluteX, y: absoluteY }, filtered, Animated),
      ),
      [
        set(this.lineEnds[index].x, this.wordDimensions[index].centreX),
        set(this.lineEnds[index].y, this.wordDimensions[index].centreY),
        set(this.wordDimensions[index].isHighlighted, new Value(0)),
        set(this.currentIndexValue, new Value(0)),
      ],
    );
  };

  // updateHighlightedOnDrag = (index, { state }) => {
  //   return cond(
  //     or(eq(state, State.BEGAN), eq(state, State.ACTIVE)),
  //     set(this.wordDimensions[index].isHighlighted, new Value(1)),
  //   );
  // };

  // If the drag goes into another word AND
  //   then update currentIndex to that word
  onDragOverAnotherWord = ({ absoluteX, absoluteY, state }) => {
    const onDragOverConds = this.wordDimensions.map(wd => {
      return cond(valueInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), [
        cond(eq(state, State.ACTIVE), [set(this.currentIndexValue, new Value(wd.index))]),
      ]);
    });

    return cond(eq(state, State.ACTIVE), onDragOverConds);
  };

  updateLinePositionOnDrag = ({ translationX, translationY, state }) => {
    return cond(eq(state, State.ACTIVE), this.setLineEndValue(translationX, translationY));
  };

  beginChain = (index, { state }) => {
    return cond(eq(state, State.BEGAN), [
      set(this.originIndexValue, new Value(index)),
      set(this.currentIndexValue, new Value(index)),
    ]);
  };

  getEventHandlerForWord = index => {
    return Animated.event([
      {
        nativeEvent: event => {
          return block([
            this.beginChain(index, event),
            this.updateLinePositionOnDrag(event),
            this.onDragOverAnotherWord(event),
            // this.updateHighlightedOnDrag(index, event),
            // this.onDragEndResetLine(index, event),
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
        <GameOverlay />
        <SvgContainer>
          <Svg height={screenHeight} width={screenWidth}>
            {wordState.map((w, i) => (
              <AnimatedLine
                key={`${w.text}-${i}`}
                x1={circlePositionX + w.centreX}
                x2={this.lineEnds[w.index].x}
                y1={circlePositionY + w.centreY}
                y2={this.lineEnds[w.index].y}
                stroke={colors.selectedColor}
                strokeWidth="7"
              />
            ))}
          </Svg>
        </SvgContainer>
        <Circle onLayout={this.onCircleLayout}>
          {wordState.map(w => {
            const containerStyle = [{ backgroundColor: this.wordBackgroundColors[w.index] }];

            return (
              <WordContainer
                onLayout={e => this.onWordLayout(e, w)}
                x={w.x || 0}
                y={w.y || 0}
                style={containerStyle}>
                <PanGestureHandler
                  enabled={!w.isMatched}
                  minDist={0}
                  onGestureEvent={this.panHandlers[w.index]}
                  onHandlerStateChange={this.panHandlers[w.index]}>
                  <Animated.View>
                    <WordText fontWeight="600" color={colors.wordColor}>
                      {w.text}
                    </WordText>
                  </Animated.View>
                </PanGestureHandler>
              </WordContainer>
            );
          })}
        </Circle>
      </ContentContainer>
    );
  }
}
