/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Button, TextInput, View} from 'react-native';
import AlertViewManager from './src/index';
const App = () => {
  const [inputValue, setInputValue] = useState('');
  const firstLaunch = useRef(false);
  useEffect(() => {
    if (firstLaunch.current) {
      AlertViewManager.update({
        title: '提示',
        message: (
          <View>
            <TextInput
              placeholder="请输入"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>
        ),
        onConfirmPressed: () => {
          console.log(inputValue);
        },
      });
    } else {
      firstLaunch.current = true;
    }
  }, [inputValue]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        title="show alert"
        onPress={() => {
          AlertViewManager.show({
            title: '提示',
            message: (
              <View>
                <TextInput
                  placeholder="请输入"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              </View>
            ),
          });
        }}
      />
    </SafeAreaView>
  );
};

export default App;
