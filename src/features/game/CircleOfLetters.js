import React, { Component } from "react";
import { View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  set,
  cond,
  block,
  eq,
  add,
  and,
  not,
  call,
  interpolate,
  Extrapolate,
  Value,
  Clock,
  debug,
} from "react-native-reanimated";
import { Svg, Line } from "react-native-svg";
import { cloneDeep } from "lodash";
import styled from "styled-components";
import { screenHeight, screenWidth } from "../../utils/sizing-utils";
import { LargeText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import {
  getCircleCoordinatesForAngle,
  getAbsoluteCoordinatesWithBuffer,
  valueInsideBounds,
} from "./game-utils";
import { SHOW_ELEMENTS_TIMEOUT } from "./game-constants";
import LetterChain from "./LetterChain";

const AnimatedLine = Animated.createAnimatedComponent(Line);

Animated.addWhitelistedNativeProps({ x1: true, x2: true, y1: true, y2: true });

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const SvgContainer = styled(Animated.View)`
  top: 0;
  left: 0;
  position: absolute;
`;

const OUTER_DIAMETER = screenWidth - 50;
const LETTER_BUFFER = 30;

// TODO: hit slop needs to be higher for when there are less letters
// TODO: font size needs to be smaller for more letters
// TODO: fix letter size formula
const getDimensions = numOfLetters => {
  // const letterSize = (OUTER_DIAMETER / numOfLetters) * 1.4;
  const letterSize = 90;
  const letterBuffer = letterSize + LETTER_BUFFER;
  const innerDiameter = OUTER_DIAMETER - letterBuffer;

  return {
    letterSize,
    letterBuffer,
    innerDiameter,
    innerRadius: innerDiameter / 2,
  };
};

const LetterChainContainer = styled(View)`
  margin-bottom: ${({ letterBuffer }) => letterBuffer / 2 + 20};
`;

const GameOverlay = styled(View)`
  position: absolute;
  height: ${OUTER_DIAMETER};
  width: ${OUTER_DIAMETER};
  border-radius: ${OUTER_DIAMETER / 2};
  background-color: ${colors.gameOverlayBackground};
`;

const Circle = styled(View)`
  position: relative;
  height: ${({ diameter }) => diameter};
  width: ${({ diameter }) => diameter};
  border-radius: ${({ radius }) => radius};
  /* border-width: 1;
  border-color: red; */
  margin-bottom: ${({ letterBuffer }) => letterBuffer / 2};
`;

const WordContainer = styled(Animated.View)`
  position: absolute;
  top: ${({ y }) => y};
  left: ${({ x }) => x};
  border-radius: ${({ letterSize }) => letterSize / 2};
  width: ${({ letterSize }) => letterSize};
  height: ${({ letterSize }) => letterSize};
  align-items: center;
  justify-content: center;
`;

const WordText = styled(LargeText)`
  padding-top: ${TEXT_TOP_PADDING};
`;

const getInitialWordState = letters => {
  return letters.map((w, i) => {
    return {
      text: w,
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
    };
  });
};

const NULL_VALUE = 999;

export default class CircleOfLetters extends Component {
  constructor(props) {
    super(props);
    this.lineEnds = this.props.letters.map(w => ({ x: new Value(0), y: new Value(0) }));
    this.gameElementsOpacity = new Value(0);
    this.showGameElementsTimer = null;

    this.wordDimensions = this.props.letters.map((w, i) => ({
      centreX: new Value(0),
      centreY: new Value(0),
      x1Value: new Value(0),
      x2Value: new Value(0),
      y1Value: new Value(0),
      y2Value: new Value(0),
      index: i,
      isConnected: new Value(false),
    }));

    this.clock = new Clock();

    this.originIndexValue = new Value(NULL_VALUE);
    this.currentIndexValue = new Value(NULL_VALUE);
    this.previousIndexValue = new Value(NULL_VALUE);
    this.letterChainValues = [];

    const { letterSize, letterBuffer, innerDiameter, innerRadius } = getDimensions(
      this.props.letters.length,
    );

    this.state = {
      wordState: getInitialWordState(this.props.letters),
      circlePositionX: null,
      circlePositionY: null,
      allPositionsSet: false,
      letterSize,
      letterBuffer,
      innerDiameter,
      innerRadius,
      letterChain: [],
      incorrectAnimationToggle: false,
    };

    this.gestureHandler = Animated.event([
      {
        nativeEvent: event => {
          return block([
            this.onDragBegin(event),
            this.updateLinePositionOnDrag(event),
            this.onDragOverAnotherWord(event),
            this.onDragEnd(event),
          ]);
        },
      },
    ]);

    this.wordBackgroundColors = this.wordDimensions.map(wd => {
      return cond(wd.isConnected, Animated.color(188, 133, 163, 1), Animated.color(0, 0, 0, 0));
    });

    // this.wordBackgroundColors = this.wordDimensions.map(wd => {
    //   return interpolate(wd.isConnected, {
    //     inputRange: [0, 1],
    //     outputRange: [Animated.color(0, 0, 0, 0), Animated.color(188, 133, 163, 1)],
    //     extrapolate: Extrapolate.CLAMP,
    //   });
    // });
  }

  // Find the line end that matches current index value, update it's position
  setLineEndPositionOnDrag = (indexValue, translationX, translationY) => {
    return this.lineEnds.map((lineEnd, i) => {
      return cond(
        eq(indexValue, i),
        this.updateLineEndFromOrigin(translationX, translationY, lineEnd),
      );
    });
  };

  // Update line end position from index that matches origin value
  updateLineEndFromOrigin = (translationX, translationY, lineEnd) => {
    return this.wordDimensions.map((w, i) => {
      return cond(eq(this.originIndexValue, i), [
        set(lineEnd.x, add(translationX, this.wordDimensions[i].centreX)),
        set(lineEnd.y, add(translationY, this.wordDimensions[i].centreY)),
      ]);
    });
  };

  // Set line end position directly to word centre
  setLineEndPositionOnSnap = (centreX, centreY) => {
    return this.lineEnds.map((lineEnd, i) => {
      return cond(eq(this.currentIndexValue, i), [
        set(lineEnd.x, centreX),
        set(lineEnd.y, centreY),
      ]);
    });
  };

  resetToPreviousLink = (translationX, translationY) => {
    const resetCurrent = this.wordDimensions.map((wd, i) => {
      return cond(eq(this.currentIndexValue, i), [
        set(wd.isConnected, new Value(false)),
        set(this.lineEnds[i].x, wd.centreX),
        set(this.lineEnds[i].y, wd.centreY),
      ]);
    });

    return [
      ...resetCurrent,
      [...this.setLineEndPositionOnDrag(this.previousIndexValue, translationX, translationY)],
    ];
  };

  allNodesConnected = () => {
    return and.apply(null, this.wordDimensions.map(w => w.isConnected));
  };

  someNodeNotConnected = () => {
    return not(this.allNodesConnected());
  };

  // If ALL letter nodes are connected -> call onSubmitAnswer
  // Else -> reset all line end positions
  onDragEnd = ({ state }) => {
    const resetLineEndsX = this.lineEnds.map((lineEnd, i) => {
      return set(lineEnd.x, this.wordDimensions[i].centreX);
    });

    const resetLineEndsY = this.lineEnds.map((lineEnd, i) => {
      return set(lineEnd.y, this.wordDimensions[i].centreY);
    });

    const resetIsConnected = this.wordDimensions.map(wd => {
      return set(wd.isConnected, new Value(false));
    });

    const resetStates = [
      ...resetLineEndsX,
      ...resetLineEndsY,
      ...resetIsConnected,
      set(this.originIndexValue, new Value(NULL_VALUE)),
      set(this.currentIndexValue, new Value(NULL_VALUE)),
      set(this.previousIndexValue, new Value(NULL_VALUE)),
    ];

    return cond(
      eq(state, State.END),
      cond(
        this.allNodesConnected(),
        [call([], () => this.onSubmitAnswer()), [...resetStates]],
        [...resetStates, call([], () => this.onSubmitIncorrectAnswer())],
      ),
    );
  };

  // If the drag goes into another word
  //   If it is not connected
  //     Update currentIndex lineEnd to centre of that word
  //     Add it to the letter chain
  //   If it is connected AND is the previous index in the chain
  //     Reset current index line end position
  //     Set current index to previous
  //     Set previous index to the one before previous (NULL if there isn't one)
  onDragOverAnotherWord = ({ absoluteX, absoluteY, translationX, translationY, state }) => {
    const onDragOverConds = this.wordDimensions.map(wd => {
      return cond(valueInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), [
        call([this.previousIndexValue], this.logPreviousIndex),
        cond(
          not(wd.isConnected),
          [
            [...this.setLineEndPositionOnSnap(wd.centreX, wd.centreY)],
            set(this.previousIndexValue, this.currentIndexValue),
            set(this.currentIndexValue, new Value(wd.index)),
            set(wd.isConnected, new Value(true)),
            call([], () => this.onAddToLetterChain(wd.index)),
          ],
          // When dragging over the previous index -> reset to previous state
          cond(eq(wd.index, this.previousIndexValue), [
            [...this.resetToPreviousLink(translationX, translationY)],
            // Set current to previous, previous to the one before
            debug("1, Current: ", this.currentIndexValue),
            debug("1, Previous: ", this.previousIndexValue),
            set(this.currentIndexValue, this.previousIndexValue),
            // set(this.previousIndexValue, this.getIndexBeforePrevious()),
            call([], this.updatePreviousIndex),
            debug("2, Current: ", this.currentIndexValue),
            debug("2, Previous: ", this.previousIndexValue),
            call([], this.popFromLetterChain),
          ]),
        ),
      ]);
    });

    return cond(and(eq(state, State.ACTIVE), this.someNodeNotConnected()), onDragOverConds);
  };

  updatePreviousIndex = () => {
    this.previousIndexValue.setValue(this.getIndexBeforePrevious());
  };

  getIndexBeforePrevious = () => {
    const { letterChain } = this.state;

    if (letterChain.length > 2) {
      console.log(">>> index before prev: ", letterChain[letterChain.length - 3]);
      return new Value(letterChain[letterChain.length - 3]);
    }

    console.log(">>> no index before previous: ", 999);
    return new Value(NULL_VALUE);
  };

  logPreviousIndex = ([prevIndex]) => {
    // console.log(">>> previous index: ", prevIndex);
  };

  updateLinePositionOnDrag = ({ translationX, translationY, state }) => {
    return cond(
      and(eq(state, State.ACTIVE), this.someNodeNotConnected()),
      this.setLineEndPositionOnDrag(this.currentIndexValue, translationX, translationY),
    );
  };

  // Check what letter node the gesture is inside, set that index as origin and current
  onDragBegin = ({ absoluteX, absoluteY, state }) => {
    const setOriginIndex = this.wordDimensions.map(wd => {
      return cond(valueInsideBounds({ x: absoluteX, y: absoluteY }, wd, Animated), [
        set(this.originIndexValue, new Value(wd.index)),
        set(this.currentIndexValue, new Value(wd.index)),
        set(wd.isConnected, new Value(true)),
        call([], () => this.onInitLetterChain(wd.index)),
      ]);
    });

    return cond(eq(state, State.BEGAN), setOriginIndex);
  };

  onSubmitAnswer = () => {
    const answer = this.state.letterChain.map(index => this.props.letters[index]).join("");

    if (answer.toLowerCase() === this.props.correctAnswer.toLowerCase()) {
      this.props.onCorrectAnswer();
      // TODO: do some correct answer animation
      this.setState({
        letterChain: [],
      });
    } else {
      this.onSubmitIncorrectAnswer();
    }
  };

  onSubmitIncorrectAnswer = () => {
    this.setState({
      incorrectAnimationToggle: !this.state.incorrectAnimationToggle,
    });
  };

  onIncorrectAnimationFinished = () => {
    this.onResetLetterChain();
  };

  onInitLetterChain = index => {
    this.setState({ letterChain: [index] });
  };

  onAddToLetterChain = index => {
    this.setState({
      letterChain: [...this.state.letterChain, index],
    });
  };

  popFromLetterChain = () => {
    const letterChain = [...this.state.letterChain];
    letterChain.pop();

    this.setState({ letterChain });
  };

  onResetLetterChain = () => {
    this.setState({ letterChain: [] });
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
    const {
      allPositionsSet,
      wordState,
      circlePositionX,
      circlePositionY,
      innerRadius,
    } = this.state;

    if (!allPositionsSet && wordState.every(w => w.width)) {
      this.setState({ allPositionsSet: true });

      const clonedWordState = cloneDeep(wordState);

      clonedWordState.forEach((w, i) => {
        const { xCoord, yCoord } = getCircleCoordinatesForAngle(w.angle, innerRadius);
        const halfWidth = w.width / 2;
        const halfHeight = w.height / 2;
        const startingX = innerRadius - halfWidth;
        const startingY = -1 * halfHeight;
        clonedWordState[i] = {
          ...w,
          centreX: xCoord + innerRadius,
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

    // Start timer to show line svgs (reset timer if another layout update is triggered)
    if (this.showGameElementsTimer) {
      clearTimeout(this.showGameElementsTimer);
    }

    // If this timer fires, assume layout has finished
    this.showGameElementsTimer = setTimeout(() => {
      this.gameElementsOpacity.setValue(new Value(1));
      this.props.onLayoutFinished();
    }, SHOW_ELEMENTS_TIMEOUT);
  };

  render() {
    const {
      wordState,
      circlePositionX,
      circlePositionY,
      letterSize,
      letterBuffer,
      innerDiameter,
      innerRadius,
      letterChain,
      incorrectAnimationToggle,
    } = this.state;

    const currentLetters = letterChain.map(index => this.props.letters[index]).join("");

    return (
      <ContentContainer>
        <GameOverlay />
        <LetterChainContainer letterBuffer={letterBuffer}>
          <LetterChain
            letters={currentLetters}
            incorrectAnimationToggle={incorrectAnimationToggle}
            onIncorrectAnimationFinished={this.onIncorrectAnimationFinished}
          />
        </LetterChainContainer>
        <SvgContainer style={{ opacity: this.gameElementsOpacity }}>
          <Svg height={screenHeight} width={screenWidth}>
            {wordState.map((w, i) => (
              <AnimatedLine
                key={`${w.text}-${i}`}
                x1={circlePositionX + w.centreX}
                x2={this.lineEnds[w.index].x}
                y1={circlePositionY + w.centreY}
                y2={this.lineEnds[w.index].y}
                stroke={colors.selectedColor}
                strokeWidth="10"
              />
            ))}
          </Svg>
        </SvgContainer>
        <Circle
          onLayout={this.onCircleLayout}
          diameter={innerDiameter}
          radius={innerRadius}
          letterBuffer={letterBuffer}>
          <PanGestureHandler
            minDist={0}
            onGestureEvent={this.gestureHandler}
            onHandlerStateChange={this.gestureHandler}>
            <Animated.View style={{ flex: 1, opacity: this.gameElementsOpacity }}>
              {wordState.map(w => {
                const containerStyle = [{ backgroundColor: this.wordBackgroundColors[w.index] }];

                return (
                  <WordContainer
                    onLayout={e => this.onWordLayout(e, w)}
                    letterSize={letterSize}
                    x={w.x || 0}
                    y={w.y || 0}
                    style={containerStyle}>
                    <Animated.View>
                      <WordText fontWeight="600" color={colors.wordColor}>
                        {w.text}
                      </WordText>
                    </Animated.View>
                  </WordContainer>
                );
              })}
            </Animated.View>
          </PanGestureHandler>
        </Circle>
      </ContentContainer>
    );
  }
}
