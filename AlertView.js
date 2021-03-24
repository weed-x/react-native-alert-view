import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Animated,
  Dimensions,
} from 'react-native';
import AnimatedOverlay from 'react-native-animated-overlay';
import propTypes from 'prop-types';

const {width: screenWidth} = Dimensions.get('window');
const ALERT_OPENING = 'alert_opening';
const ALERT_OPENED = 'alert_opened';
const ALERT_CLOSING = 'alert_closing';
const ALERT_CLOSED = 'alert_closed';
const DEFAULT_ANIMATION_DURATION = 180;
const HARDWARE_BACK_PRESS_EVENT = 'hardwareBackPress';

export default class AlertView extends Component {
  state = {
    alertState: ALERT_CLOSED,
    scale: new Animated.Value(0),
    canclePressed: false,
    confirmPressed: false,
  };
  componentDidMount() {
    if (this.props.show) {
      this.show();
    }
    BackHandler.addEventListener(
      HARDWARE_BACK_PRESS_EVENT,
      this.hardwareBackPressHandler,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(HARDWARE_BACK_PRESS_EVENT);
    this.hide();
  }

  onOverlayPress = () => {
    if (this.state.alertState === ALERT_OPENED) {
      this.hide();
    }
  };

  setAlertState(toValue) {
    const isClosed = this.state.alertState === ALERT_CLOSED;
    let alertState = isClosed ? ALERT_OPENING : ALERT_CLOSING;
    this.setState({alertState});
    Animated.spring(this.state.scale, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      const isClosing = this.state.alertState === ALERT_CLOSING;
      alertState = isClosing ? ALERT_CLOSED : ALERT_OPENED;
      this.setState({alertState});
    });
  }

  hardwareBackPressHandler = () => {
    let {hideOnHardwareBackPress, onHide} = this.props;
    if (hideOnHardwareBackPress && this.props.show) {
      if (onHide) {
        onHide();
      } else {
        this.hide();
      }
      return true;
    }
    return false;
  };

  show = () => {
    if ([ALERT_OPENING, ALERT_OPENED].includes(this.state.alertState)) {
      return;
    }
    this.setState({show: true});
    this.setAlertState(1);
  };

  hide = () => {
    if ([ALERT_CLOSING, ALERT_CLOSED].includes(this.state.alertState)) {
      return;
    }
    this.setState({show: false});
    this.setAlertState(0);
  };

  renderContent = () => {
    const {
      title,
      message,
      singleClick,
      cancelText,
      confirmText,
      titleStyle,
      contentStyle,
      contentContainerStyle,
      cancelStyle,
      confirmStyle,
      onCancelPressed,
      onConfirmPressed,
    } = this.props;
    const underlayStyle = {
      backgroundColor: '#f3f3f3',
    };
    const messageElement = React.isValidElement(message) ? (
      message
    ) : typeof message === 'string' ? (
      message === '' ? null : (
        <Text style={[styles.alertMessage, contentStyle]}>{message}</Text>
      )
    ) : null;
    return (
      <>
        {!!title && (
          <Text style={[styles.alertTitle, titleStyle]}>{title}</Text>
        )}
        {!!messageElement && (
          <View style={[styles.messageWrapper, contentContainerStyle]}>
            {messageElement}
          </View>
        )}
        <View style={styles.handleView}>
          {!singleClick && (
            <TouchableOpacity
              style={[
                styles.cancelWrapper,
                this.state.canclePressed && underlayStyle,
              ]}
              activeOpacity={1}
              onPress={onCancelPressed}
              onPressIn={() => {
                this.setState({canclePressed: true});
              }}
              onPressOut={() => {
                this.setState({canclePressed: false});
              }}>
              <Text style={[styles.cancelText, cancelStyle]}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.cancelWrapper,
              this.state.confirmPressed && underlayStyle,
            ]}
            activeOpacity={1}
            onPress={onConfirmPressed}
            onPressIn={() => {
              this.setState({confirmPressed: true});
            }}
            onPressOut={() => {
              this.setState({confirmPressed: false});
            }}>
            <Text style={[styles.confirmText, confirmStyle]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  render() {
    const {
      animationDuration,
      overlayOpacity,
      hideOnHardwareBackPress,
    } = this.props;
    const {alertState, scale} = this.state;
    let overlayShow = false;
    let pointerEvents = 'none';
    if ([ALERT_OPENED, ALERT_OPENING].includes(alertState)) {
      overlayShow = true;
      pointerEvents = 'auto';
    }

    return (
      <View style={styles.container}>
        <AnimatedOverlay
          onPress={
            hideOnHardwareBackPress ? this.hardwareBackPressHandler : () => {}
          }
          overlayShow={overlayShow}
          duration={animationDuration}
          opacity={overlayOpacity}
          pointerEvents={pointerEvents}
          useNativeDirver
        />
        {overlayShow && (
          <Animated.View
            style={[
              styles.alertStyle,
              {
                transform: [
                  {
                    scale,
                  },
                ],
              },
            ]}>
            {this.renderContent()}
          </Animated.View>
        )}
      </View>
    );
  }
}

AlertView.propTypes = {
  show: propTypes.bool,
  animationDuration: propTypes.number,
  overlayOpacity: propTypes.number,
  title: propTypes.string,
  singleClick: propTypes.bool,
  message: propTypes.oneOfType([propTypes.string, propTypes.element]),
  cancelText: propTypes.string,
  confirmText: propTypes.string,
  hideOnHardwareBackPress: propTypes.bool,
  onHide: propTypes.func,
  onCancelPressed: propTypes.func,
  onConfirmPressed: propTypes.func,
  titleStyle: propTypes.object,
  contentStyle: propTypes.object,
  contentContainerStyle: propTypes.object,
  cancelStyle: propTypes.object,
  confirmStyle: propTypes.object,
};

AlertView.defaultProps = {
  show: false,
  animationDuration: DEFAULT_ANIMATION_DURATION,
  overlayOpacity: 0.3,
  singleClick: false,
  cancelText: '取消',
  confirmText: '确定',
  hideOnHardwareBackPress: true,
  onHide: null,
  title: '',
  message: '',
  onCancelPressed: () => {},
  onConfirmPressed: () => {},
  titleStyle: {},
  contentStyle: {},
  contentContainerStyle: {},
  cancelStyle: {},
  confirmStyle: {},
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  alertStyle: {
    backgroundColor: '#fff',
    width: screenWidth - 2 * 47,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: 20,
    borderRadius: 4,
  },
  alertTitle: {
    color: '#494949',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  messageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  alertMessage: {
    color: '#494949',
    fontSize: 15,
    textAlign: 'center',
  },
  handleView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#dedede',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 45,
  },
  cancelWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRightColor: '#dedede',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  cancelText: {
    color: '#999999',
    fontSize: 15,
  },
  confirmText: {
    color: '#4a5b7a',
    fontSize: 15,
  },
  verticalLineStyle: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#dedede',
  },
});
