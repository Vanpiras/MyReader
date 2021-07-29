import * as React from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function List({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <View style={{ flex: 0, alignItems: 'center', justifyContent: 'center' }}>
        <Button
        onPress={() => navigation.navigate("Chapter", {index: 0, doRetrieve: false})}
        title="test"
        />
        </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
        fontFamily: "Arial",
        fontSize: 23,
        backgroundColor: '#fff',
        alignSelf: 'center',
        justifyContent: 'center',
        lineHeight: 30,
        paddingHorizontal: 20,
  },
});
