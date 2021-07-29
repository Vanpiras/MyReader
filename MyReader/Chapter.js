import * as React from 'react';
import { View, TextInput, Text, StyleSheet, SafeAreaView, ScrollView, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HTMLParser = require('fast-html-parser');
const repo = "https://raw.githubusercontent.com/Vanpiras/MyReader/master/links.json";

export default function Chapter({ navigation }) {
    let index = 0;
    if (navigation.state.params != undefined && navigation.state.params.index) {
        index = navigation.state.params.index;
    }
    let doRetrieve = true;
    if (navigation.state.params != undefined && navigation.state.params.doRetrieve) {
        doRetrieve = navigation.state.params.doRetrieve;
    }
    return (
        <ChapterContent index={index} doRetrieve={doRetrieve} />
    );
}

class ChapterContent extends React.Component {

    state = { 
        urls: [],
        url: '',
        content: 'Loading ...', 
        title: 'Lorem Ipsum',
        index: this.props.index,
        initialScroll: 0,
    }  

    async GetUrls() {
        await fetch(repo).then((resp)=>{ return resp.json() }).then((data)=>{
            let l = data["list"][0]["chapters"];
            let arr = [];
            l.forEach(obj => arr.push(obj["url"]))
            this.setState({urls: arr});

        })
        .catch(function () { console.log("Urls fetch failed"); });
    }

    async SetContent(url) {
        await fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{
            let root = HTMLParser.parse(text);
            let req = root.querySelector('.entry-content');
            let title = root.querySelector('.entry-title');
            this.setState({title:title.text});
            let padded = req.text.replaceAll("\n", "\n\n");
            this.setState({content:padded});
            this.scrollTo(0);
        })
        .catch(function () { console.log("Chapter fetch failed"); });
    }

    async GetChapter() {
        console.log(this.state.index);
        if (this.state.urls.length === 0) {
            await this.GetUrls();
        }
        if (this.props.doRetrieve) {
            await this.retrieveChapterData();
            this.setState({url:this.state.urls[this.state.index]});
        }
        else
        {
            this.setState({url:this.state.urls[this.props.index]});
        }
        this.SetContent(this.state.url);
        await this.retrieveScrollData();
    }

    componentDidMount() {
        if (this.props.doRetrieve) {
            this.retrieveChapterData();
        }
        this.GetChapter();
    }

    scrollRef = undefined;

    scrollTo(scroll) {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo({ y: scroll });
        }
    }

    scrollToInitialPosition = () => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo({ y: this.state.initialScroll });
        }
    }


    async storeChapterData() {
        try {
            await AsyncStorage.setItem(
                this.props.prefix + 'chapter',
                this.state.index.toString()
            );

            console.log("stored chapter " + this.state.index);
        } catch (error) {
                console.log(error);0
        }
    };

    async storeScrollData(value) {
        try {
            await AsyncStorage.setItem(
                this.state.prefix + 'scroll' + this.state.index,
                value
            );
        } catch (error) {
                console.log(error);
        }
    };

    retrieveChapterData = async () => {
        try {
            const value = await AsyncStorage.getItem(this.props.prefix + 'chapter');
            if (value !== null) {
                this.setState({index:parseInt(value)});
            }
        } catch (error) {
                console.log(error);
        }
    };

    retrieveScrollData = async () => {
        try {
            const value = await AsyncStorage.getItem(this.props.prefix + 'scroll' + this.state.index);
            if (value !== null) {
                this.setState({initialScroll:parseInt(value)});
            }
        } catch (error) {
                console.log(error);
        }
    };

    NextChapter = () => {
        let i = this.state.index;
        if (this.state.index + 1 < this.state.urls.length) {
            i = i + 1;
        }
        this.setState({index:i});
        this.setState({url:this.state.urls[i]});
        this.setState({initialScroll:0});
        this.SetContent(this.state.urls[i])
    }

    render() {
        val = this.state.content;
        return ( 
        <SafeAreaView style={styles.container}>
        <ScrollView ref={(ref) => { this.scrollViewRef = ref; }}
                    onLayout={this.scrollToInitialPosition}
                    style={styles.scrollView}
                    onScroll={({ nativeEvent }) => {
                        this.storeScrollData(nativeEvent.contentOffset.y.toString());
                        this.storeChapterData();
                    }}
                    scrollEventThrottle={1000}>
            <Text style={titleStyles.container}>{this.state.title}</Text>
            <TextInput style={styles.container} multiline={true} editable={false} scrollEnabled={false}>{val}</TextInput>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.NextChapter}
                style={btnStyle.container}>
            <Text style={btnStyle.text}>Next Chapter</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {this.scrollTo(0)}}
                style={btnStyle.container}>
            <Text style={btnStyle.text}>Scroll Up</Text>
            </TouchableOpacity>
        </ScrollView>
        </SafeAreaView>
        );
    }
};

const btnStyle = StyleSheet.create({
    text : {
        fontFamily: "Arial",
        fontSize: 26,
        fontWeight: "bold",
        alignItems: 'center',
        lineHeight: 30,
        paddingHorizontal: 18,
        color: "white"
  },
    container : {
        elevation: 8,
        backgroundColor: "#366FE5",
        alignSelf: 'center',
        borderRadius: 10,
        paddingVertical: 10,
        height: 50,
        width: 200,
    },
});

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

const titleStyles = StyleSheet.create({
  container: {
        fontFamily: "Arial",
        fontSize: 32,
        fontWeight: "bold",
        backgroundColor: '#fff',
        alignSelf: 'center',
        justifyContent: 'center',
        lineHeight: 30,
        paddingHorizontal: 10,
        paddingVertical: 20,
  },
});
