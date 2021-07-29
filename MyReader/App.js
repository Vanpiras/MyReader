import * as React from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import Navigator from './Stack';

export default class App extends React.Component {  
    url = "https://raw.githubusercontent.com/Vanpiras/MyReader/master/links.json";

    render() {
        return (
            <Navigator />
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
