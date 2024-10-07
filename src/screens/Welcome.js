import { StyleSheet, 
        Text, 
        View, 
        StatusBar, 
        Image, 
        Dimensions, 
        TextInput,
        ToastAndroid
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import LoginButton from '../components/buttons/LoginButton';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../api/ColorPallete';

const screen = { width: Dimensions.get("window").width, height: Dimensions.get("window").height }
const scale = 1.5

const Welcome = ({ navigation }) => {

    const [fontLoaded] = useFonts({ opensansRegular: require('../../assets/fonts/OpenSans-Regular.ttf'), opensansBold: require('../../assets/fonts/OpenSans-Bold.ttf'), });
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    if (!fontLoaded) { return null };

    async function validateUser(){
        if(email==''){
            ToastAndroid.show('メールを確認してください', ToastAndroid.SHORT);
        }else if(password == ''){
            ToastAndroid.show('パスワードを確認してください', ToastAndroid.SHORT)
        }
        const response =  await fetch(`https://logi-attendance.new-challenge.jp/api/calendar/check?email=${email}&password=${password}`);
        const res = await response.json();
        console.log('parsed response', res);
        if(res.uid != ''){
            AsyncStorage.setItem('uid', res.uid);
            setEmail('');
            setPassword('');
            navigation.push('list');
        }
        // setIsLoading(false);
    }

    return (
        <View style={theme.container}>
            <View style={theme.content} >
                <Image style={theme.illustration} source={require('../../assets/illustration.png')} />
                <Text style={[theme.title, { fontFamily: 'opensansBold' }]}>Logiアラーム</Text>
                <Text style={[theme.text, { fontFamily: 'opensansRegular' }]}>目覚まし時計で時間を管理する</Text>
                
                <TextInput
                    keyboardType="email-address"
                    style={[theme.email]}
                    placeholder="メールアドレス" 
                    value = {email}
                    onChangeText={e=>{setEmail(e)}}
                />
                <TextInput
                    style={[theme.password]}
                    placeholder="パスワード"
                    value = {password}
                    onChangeText={e=>{setPassword(e)}}
                    secureTextEntry={true}
                />
                <LoginButton title={'ログイン'} onPress={() => validateUser()} />
            </View>
            <StatusBar style="auto" />
            <Text style={[theme.lettermark, { bottom: 85 }]}>Logiチーム</Text>
            <Spinner
                visible={isLoading}
                textContent={'読み込み中...'}
                overlayColor={colors.gray}
                color={colors.blue}
                textStyle={theme.spinnerTextStyle}
            />
        </View>
    )
}

const theme = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.gray, justifyContent: 'center', alignItems: 'center' },
    lettermark: { fontSize: 12, color: colors.darkgray, position: 'absolute' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    illustration: { width: 275 / scale, height: 150 / scale, },
    title: { fontSize: 32, textAlign: 'center', margin: 20, color: colors.black},
    text: { fontSize: 16, marginBottom: 50, textAlign: 'center', color: colors.darkgray},
    email:{
        fontSize: 15, 
        textAlign: 'center', 
        marginBottom: 10, 
        borderBottomWidth:1, 
        borderBottomColor: colors.darkgray,
        height: 45,
        width: 200,
    },
    password: {
        fontSize: 20, 
        marginBottom: 50, 
        textAlign: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: colors.darkgray,
        height:45,
        width: 200,
    },
    spinnerTextStyle: {
        color: colors.darkgray
    },
})

export default Welcome;