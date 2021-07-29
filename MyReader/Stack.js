import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from './Home'
import Chapter from './Chapter'
import List from './List'
import * as React from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';

const screens = {
    Home: {
        screen: Home,
        navigationOptions: ({navigation}) => ({
        headerRight: <Button
                    onPress={() => navigation.navigate("List")}
                    title="List "/>
        })
    },
    Chapter: {
        screen: Chapter,
    },
    List: {
        screen: List,
    }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
