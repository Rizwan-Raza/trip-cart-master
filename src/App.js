/**
 *
 * Main app
 *
 * App Name:          Trip Cart
 * Author:            Rnlab.io
 *
 * @since             1.0.0
 *
 * @format
 * @flow
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { AppState } from "react-native";
import OneSignal from 'react-native-onesignal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NavigationService from 'src/utils/navigation';
import AppRouter from './AppRouter';
import './config-i18n';
import configureStore from './config-store';
import { APP_ID } from './config/onesignal';
import { tokenSelector } from './modules/auth/selectors';
import { getDemoSelector } from './modules/common/selectors';
import demoConfig from './utils/demo';
import globalConfig from './utils/global';






const { store, persistor } = configureStore();
// await requestTrackingPermission();
class App extends Component {

  checkPermission = async () => {
    console.log('Requesting TrackingPerm');
    global.attperm = await requestTrackingPermission();
    console.log('Done TrackingPerm' + global.attperm);
  };

  handleAppStateChange = (nextState) => {
    if (nextState === "active") {
      if (Platform.OS === "ios") {
        // Only once app has become active
        // can we prompt app tracking permission (Apple iOS 15 requirement)
        this.checkPermission();
      }
    }
  };

  componentDidMount() {


    OneSignal.setAppId(APP_ID);

    // O N E S I G N A L   S E T U P
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });

    /* O N E S I G N A L  H A N D L E R S */
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notifReceivedEvent,
      );
      // let notif = notifReceivedEvent.getNotification();

      // const button1 = {
      //   text: "Cancel",
      //   onPress: () => { notifReceivedEvent.complete(); },
      //   style: "cancel"
      // };

      // const button2 = { text: "Complete", onPress: () => { notifReceivedEvent.complete(notif); } };

      // Alert.alert("Complete notification?", "Test", [button1, button2], { cancelable: true });
    });
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
    });
    OneSignal.setInAppMessageClickHandler(event => {
      console.log('OneSignal IAM clicked:', event);
    });
    OneSignal.addEmailSubscriptionObserver(event => {
      console.log('OneSignal: email subscription changed: ', event);
    });
    OneSignal.addSubscriptionObserver(event => {
      console.log('OneSignal: subscription changed:', event);
    });
    OneSignal.addPermissionObserver(event => {
      console.log('OneSignal: permission changed:', event);
    });


    store.subscribe(() => {
      const state = store.getState();
      demoConfig.setData(getDemoSelector(state).toJS());
      globalConfig.setToken(tokenSelector(state));
    });

    AppState.addEventListener("change", this.handleAppStateChange);

  }

  componentWillUnmount() {
    OneSignal.clearHandlers();
  }

  render() {
    return (
      <NavigationContainer
        ref={navigationRef =>
          NavigationService.setTopLevelNavigator(navigationRef)
        }>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppRouter />
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </NavigationContainer>
    );
  }
}

export default App;
