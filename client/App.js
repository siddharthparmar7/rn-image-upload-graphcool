import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { PROJECT_ID } from 'react-native-dotenv';

const options = {
  title: 'Select Avatar'
};

export default class App extends Component {
  pickImage = () => {
    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let uri = response.uri;
        if (Platform.OS === 'ios') uri.replace('file://', '');

        RNFetchBlob.fetch(
          'POST',
          `https://api.graph.cool/file/v1/${PROJECT_ID}`,
          {},
          [
            {
              name: 'data',
              filename: 'image',
              data: RNFetchBlob.wrap(uri)
            }
          ]
        )
          .then(res => {
            let status = res.info().status;
            console.log(status);
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <TouchableOpacity onPress={() => this.pickImage()}>
          <Text>Pick an Image</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
