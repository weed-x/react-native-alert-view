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

  update = options => {
    if (this.alerts.length <= 0) {
      console.error('alert instance is not existed');
      return;
    }
    const props = {
      ...options,
      onCancelPressed: options.onCancelPressed || this.hide,
      onConfirmPressed: options.onConfirmPressed || this.hide,
      show: true,
      onHide: () => {
        this.alerts.pop().destroy();
        const p = this.props.pop();
        if (!p) {
          return;
        }
        this.setCurrent(this.props[this.props.length - 1]);
      },
    };
    this.props[this.props.length - 1] = props;
    this.alerts[this.alerts.length - 1].update(<AlertView {...props} />);
  };

  show = options => {
    const props = {
      ...options,
      onCancelPressed: options.onCancelPressed || this.hide,
      onConfirmPressed: options.onConfirmPressed || this.hide,
      show: true,
      onHide: () => {
        this.hide();
      },
    };
    this.setCurrent(props);
    this.props.push(props);
  };

  hide = () => {
    const props = this.props.pop();
    if (!props) {
      return;
    }
    this.alerts.pop().destroy();
    this.setCurrent(this.props[this.props.length - 1]);
  };
}
