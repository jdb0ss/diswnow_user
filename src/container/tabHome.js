import React, {useState,useEffect} from 'react';
import { View, StyleSheet, AppRegistry, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import GoogleMap from '../utill/googlemap.js';
import { useDispatch, connect } from 'react-redux';
import * as API from '../utill/API';
import * as Utill from '../utill';
import user, * as User from '../store/modules/user'
import ModalDropdown from 'react-native-modal-dropdown';
import { BigButtonColor, Text } from '../component/common'
import OneSignal from 'react-native-onesignal';
import { screenWidth } from '../utill/screen.js';

const TabHome = (props)=>{
    const dispatch = useDispatch();
    const _me = async() => {
        const token = await API.getLocal(API.LOCALKEY_TOKEN);
        const meRes = await API.me(token);
        const userid = meRes.userId;
        const point = meRes.point;
        const name = meRes.name;
        const phone = meRes.phone;
        const image = meRes.image;
        const reviewcount = meRes.reviewcount;
        const nickname = meRes.nickname;
        dispatch(User.updateuserid(userid));
        dispatch(User.updatepoint(point));
        dispatch(User.upadtename(name));
        dispatch(User.updatephone(phone));
        dispatch(User.updateimage(image));
        dispatch(User.updatereviewcount(reviewcount));
        dispatch(User.updatenickname(nickname));
        const pushToken = await API.getPush(API.PUSH_TOKEN);
        const ret = await API.setPushToken(token,{pushToken});
        
    }

    const [people, setPeople] = useState('');
    const [time, setTime] = useState('');
    const [tema, setTema] = useState(0);
    const [bol, setBol] = useState(true);
    const [arr, setArr] = useState(
        ['3', '5', '8', '10', '15', '20']
    );

    const {navigation, latitude, longitude, address} = props;



    useEffect(()=>{
        OneSignal.addEventListener('ids',onIds);
        _me();
        return () => {
            OneSignal.removeEventListener('ids',onIds);
        }
    },[]);
    const _reservation = async()=>{
        const token = await API.getLocal(API.LOCALKEY_TOKEN);
        const data = {
            storeTypeId : 1,
            peopleNumber : parseInt(people.text),
            minutes : parseInt(arr[parseInt(time)]),
            latitude,
            longitude, 
        }
        console.log(data);
        const res = await API.reservation(token,data);
        console.log(res);
        navigation.navigate('onWait',{
            people : people.text,
            time,
            tema : temaList[tema].id,
            address,
        })
    }

    const onIds = ((device) => {
        let token = device.userId;
        API.setPush(API.PUSH_TOKEN,token);
      })

    const [temaList, settemaList] = useState([  // 테마배열
        {   color : '#CCCCCC', isselect : false, id : '전체',},
        {   color : '#CCCCCC', isselect : false, id : '단체',},
        {   color : '#CCCCCC', isselect : false, id : '룸',},
        {   color : '#CCCCCC', isselect : false, id : '저렴한',},
        {   color : '#CCCCCC', isselect : false, id : '감성적인',},
        {   color : '#CCCCCC', isselect : false, id : '이자카야',},
    ]);

    const _toggle = async(i,newTemaList) =>{ // 색깔바뀌는 함수 밖으로 빼냄
        await _selectTema(i);                // ***tema 동기화 잘안됨!
        for(let k=0; k<6; k++){
            if(i!==k){
                newTemaList[k].color = '#CCCCCC';
                newTemaList[k].isselect = false;
            }
        }
        newTemaList[i].color = '#111111';
        newTemaList[i].isselect = true;
    }

    const _changeTemaColor = async(i) => {  // 테마선택 색깔,선택 바뀌게하는 함수
        let newTemaList = [...temaList];
        if(newTemaList[i].color === '#CCCCCC'){
          await _toggle(i,newTemaList);
        }else{
            newTemaList[i].color = '#CCCCCC';
            newTemaList[i].isselect = false;
        }
        settemaList(newTemaList);
    }

    const _selectTema = (i) =>{
        setTema(i);
    }

    const _selectTime = (rowData) =>{
        setTime(rowData);
        setBol(false);
    }

    return(
        <View style = {styles.container}>
            <GoogleMap
               isPressed = { false }
               navigation = { navigation }   
               latitudeDelta = {0.0125}
               toggle  = {()=>{navigation.navigate('Departure')}}>
            </GoogleMap>
            <View style = {styles.input}>
                <ScrollView
                    style = {styles.scrollViewContainer}
                    horizontal = {true}
                    showsVerticalScrollIndicator = {true}
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginLeft: 16
                    }}
                    >
                        <View style = {styles.item}>
                        <TouchableOpacity onPress = {()=>_changeTemaColor(0)}>
                            <View style = {styles.item}><Text  style = {{color : temaList[0].color }}> 전체 </Text></View>
                        </TouchableOpacity>
                        </View>
                        <View style = {styles.item}>
                        <TouchableOpacity onPress = {()=>_changeTemaColor(1)}>
                            <View style = {styles.item}><Text  style = {{color : temaList[1].color }}> 단체 </Text></View>
                        </TouchableOpacity>
                        </View>
                        <View style = {styles.item}>
                        <TouchableOpacity onPress = {()=>_changeTemaColor(2)}>
                            <View style = {styles.item}><Text  style = {{color : temaList[2].color }}> 룸 </Text></View>
                        </TouchableOpacity>
                        </View>
                        <View style = {styles.item}>
                        <TouchableOpacity onPress = {()=>_changeTemaColor(3)}>
                            <View style = {styles.item}><Text  style = {{color : temaList[3].color }}> 저렴한 </Text></View>
                        </TouchableOpacity>
                        </View>
                        <View style = {styles.item}>
                        <TouchableOpacity onPress = {()=>_changeTemaColor(4)}>
                            <View style = {styles.item}><Text  style = {{color : temaList[4].color }}> 감성적인 </Text></View>
                        </TouchableOpacity>
                        </View>
                        <View style = {styles.item}>
                        <TouchableOpacity onPress = {()=>_changeTemaColor(5)}>
                            <View style = {styles.item}><Text  style = {{color : temaList[5].color }}> 이자카야 </Text></View>
                        </TouchableOpacity>
                        </View>
                    </ScrollView>
                <View style={[styles.parent, {height: Utill.screen.Screen.customHomeHeight(172)}]} horizontal = {true}>
                <View style={styles.content}>
                    <View style={styles.child}>
                        <View style={styles.childchild1}><Text style = {styles.tst}>인원</Text></View>
                        <View style = {styles.childchild2}>
                            <TextInput 
                            selectionColor = '#733FFF'
                            placeholder ={'00'}
                            onChangeText={(text) => setPeople({text})}
                            value={people.text}
                            style={styles.personInput} />
                            <Text style={{fontSize : 24, marginBottom: 5}}> 명</Text>
                        </View>
                    </View>
                    <View style={styles.child}>
                        <View style={styles.childchild1}><Text style = {styles.tst}>출발 예정 시간</Text></View>
                        <View style = {styles.childchild2}>
                            <View style={styles.dropdown}>
                                {bol&&(<ModalDropdown
                                defaultValue = {0} 
                                textStyle = {{fontSize: 24, fontFamily: "NanumSquareOTFR", color: '#CCCCCC'}}
                                dropdownTextStyle = {{fontSize: 16, fontFamily: "NanumSquareOTFR", color: "#111111"}}
                                style = {{width : 33, height : 31}} 
                                options = {['3', '5', '8', '10', '15', '20']}
                                onSelect = {(idx) => _selectTime(idx)}
                                />)}
                                {!bol&&(<ModalDropdown
                                defaultValue = {arr[time]}
                                textStyle = {{fontSize: 24, fontFamily: "NanumSquareOTFR", color: "#111111"}}
                                dropdownTextStyle = {{fontSize: 16, fontFamily: "NanumSquareOTFR", color: "#111111"}}
                                style = {{width : 33, height : 31}} 
                                options = {['3', '5', '8', '10', '15', '20']}
                                onSelect = {(idx) => _selectTime(idx)}
                                />)}
                                <Image style = {{width: 8, height:4.75}} source = {{uri: "icon_rsquare_bracket_under"}}></Image>
                            </View>
                            <Text style={{fontSize : 24, marginBottom: 5}}> 분 후</Text>
                        </View>
                    </View>
                    </View>
                </View>
            <View style={{alignItems: 'center'}}>
            <BigButtonColor 
                    style={[styles.find, {marginBottom: Utill.screen.Screen.customHeight(52)}]}
                    onPress ={_reservation}
                    title = {'술집 찾기'}
            />
            </View>
            </View>
        </View>
    )
}


const mapStateToProps = (state) => {
    return {
        latitude : state.Maps._root.entries[0][1].latitude,
        longitude : state.Maps._root.entries[0][1].longitude,
        address : state.Maps._root.entries[1][1],
    }
}

export default connect(mapStateToProps)(TabHome);

const styles = StyleSheet.create({
    container : {                       // 화면전체
        flex : 1
    },
    scrollViewContainer :{
        height: 46,
        width: 471,
        marginTop: Utill.screen.Screen.customHeight(30),
        backgroundColor: "#EEEEEE",
    },
    scrollTheme: {
        height: 46,
        alignItems: 'center',
        width: 471,
        flexDirection: 'row',
        backgroundColor: "#EEEEEE",
        justifyContent: "space-around"
    },
    tst : {
        fontSize : 14,
        textAlign : 'center',
    },
    item : {                            // 테마 스크롤의 각각 아이템
        alignItems : 'center',
    },
    parent : {                          // 연두색 배경
        height: Utill.screen.Screen.customHeight(172),
        flexDirection : 'row',
        justifyContent: "center",
        alignItems: 'center'
    },
    content : {
        flexDirection: "row",
        width: Utill.screen.Screen.customWidth(262),
        justifyContent: "space-around"
    },
    child : {                           // 연두색 배경 왼쪽, 오른쪽 반반씩을 의미
        alignItems : 'flex-start',
    },
    personInput: {
        fontSize : 24,
        borderBottomWidth: 3,
        borderColor: "#733FFF",
        width: 43,
        height: 31,
        fontFamily: "NanumSquareOTFR"
    },
    childchild1 : {
        marginBottom: Utill.screen.Screen.customHeight(15)    // 인원, 출발 예정 시간 (제목임)
    },
    dropdown :{
        width: 42,
        height: 31,
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: 3,
        borderColor: "#733FFF"
    },
    childchild2 : {
        flexDirection : 'row',
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    find : {                             // 식당찾기
    },
    textinput : {                         // 00 부분

    },
})
