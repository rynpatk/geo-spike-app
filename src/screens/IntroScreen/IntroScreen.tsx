import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';

// Import BackgroundGeolocation + any optional interfaces
import BackgroundGeolocation from 'react-native-background-geolocation';

import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { Text } from '../../components/Text';
import { Container } from '../../components/Container';
import { colors } from '../../styles';

export default class IntroScreen extends Component {
  componentWillMount() {
    ////
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(this.onProviderChange);

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready(
      {
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        url: 'http://yourserver.com/locations',
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {
          // <-- Optional HTTP headers
          'X-FOO': 'bar',
        },
        params: {
          // <-- Optional HTTP params
          auth_token: 'maybe_your_server_authenticates_via_token_YES?',
        },
      },
      state => {
        console.log('- BackgroundGeolocation is configured and ready: ', state.enabled);

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function() {
            console.log('- Start success');
          });

          // RATKINSON CUSTOM
          BackgroundGeolocation.addGeofence({
            identifier: 'Home',
            radius: 200,
            latitude: 27.730021100000002,
            longitude: -82.6303435,
            notifyOnEntry: true,
            notifyOnExit: true,
            extras: {
              route_id: 1234,
            },
          })
            .then(success => {
              console.log('[addGeofence] success');
            })
            .catch(error => {
              console.log('[addGeofence] FAILURE: ', error);
            });

          // Listen for geofence events.
          BackgroundGeolocation.onGeofence(geofence => {
            console.log('[geofence] ', geofence.identifier, geofence.action);
          });
        }
      },
    );
  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  onLocation(location) {
    console.log('[location] -', location);
  }

  onError(error) {
    console.warn('[location] ERROR -', error);
  }

  onActivityChange(event) {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  }

  onProviderChange(provider) {
    console.log('[providerchange] -', provider.enabled, provider.status);
  }

  onMotionChange(event) {
    console.log('[motionchange] -', event.isMoving, event.location);
  }

  render() {
    return (
      <Screen backgroundColor={colors.transparent} paddingTop={60}>
        <Container fill centerContent fullWidth>
          {/* <Button
            label="Login"
            backgroundColor={colors.primary}
            color={colors.white}
            onPress={() => props.navigation.navigate('Login')}
            borderRadius={5}
          /> */}
          <Text>Geolocation Test!</Text>
        </Container>
      </Screen>
    );
  }
}
