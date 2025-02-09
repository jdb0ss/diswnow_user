import React, {useState, useEffect} from 'react';
import {TouchableHighlight, StyleSheet, View} from 'react-native';
import Text from './Text';
import * as Utill from '../../utill';
import Screen from '../../utill'
//바탕이 회색, text는 흰색 버튼
const BigButton = (props) => {

    const {disabled=false, onPress} = props;
    const [pressed, setPressed] = useState(false);
 


    const _onHide = () => {
        setPressed(true);
    }
    const _onShow = () => {
        setPressed(false);
    }


    if (disabled)  
        return (
            <View style = {[styles.buttonDisable, {width: Utill.screen.Screen.customWidth(282)}]} >
                <Text 
                    style={styles.title}
                    color = {props.color}>
                    {props.title}
                </Text>
            </View>
        )
    return (
        <TouchableHighlight
            activeOpacity={1}
            style = {[styles.buttonNormal, {width: Utill.screen.Screen.customWidth(282)}]}
            underlayColor = {Utill.color.primary2}
            onPress = {onPress}
            onHideUnderlay = {_onHide}
            onShowUnderlay = {_onShow}
            
        >
            <Text style={styles.title}>
                {props.title}
            </Text>
        </TouchableHighlight>
    )
}
export default BigButton;

const styles = StyleSheet.create({

    buttonNormal : {
        borderRadius : 25,
        height : 45,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Utill.color.primary1,
    },
    buttonDisable : {
        borderRadius : 25,
        height : 45,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Utill.color.defaultColor,
    },
    title : {
        fontSize : 18,
        color : Utill.color.white,
    },
})