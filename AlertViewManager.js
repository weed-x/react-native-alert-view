import React from 'react';
import RootSiblings from 'react-native-root-siblings';
import AlertView from './AlertView';

export default class AlertViewManager {
  constructor() {
    this.props = [];
    this.alerts = [];
  }

  setCurrent(props) {
    if (!props) {
      return;
    }
    let currentAlert = new RootSiblings(<AlertView {...props} />);
    this.alerts.push(currentAlert);
  }

  create(props) {
    this.setCurrent(props);
    this.props.push(props);
  }

  update = (title, message, options, onConfirmPressed, onCancelPressed) => {
    const props = {
      title,
      message,
      ...options,
      onCancelPressed: onCancelPressed || this.hide,
      onConfirmPressed: onConfirmPressed || this.hide,
      show: true,
      onHide: () => {
        this.alerts.pop().destroy();
        const p = this.props.pop();
        if (!p) {
          return;
        }
        this.setCurrent(this.props[this.props.length] - 1);
      },
    };
    this.props[this.props.length - 1] = props;
    this.alerts[this.alerts.length - 1].update(<AlertView {...props} />);
  };

  show = (title, message, options, onConfirmPressed, onCancelPressed) => {
    const props = {
      title,
      message,
      ...options,
      onCancelPressed: onCancelPressed || this.hide,
      onConfirmPressed: onConfirmPressed || this.hide,
      show: true,
      onHide: () => {
        this.hide();
      },
    };
    this.create(props);
  };

  hide = () => {
    const props = this.props.pop();
    if (!props) {
      return;
    }
    this.alerts.pop().destroy();
    this.setCurrent(this.props[this.props.length] - 1);
  };
}
