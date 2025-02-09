import React ,{ useState, useEffect, useStore }from "react";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import { 
    View,
    Dimensions,
    StyleSheet,
    Image, 
    TouchableOpacity, 
    BackHandler,
} from "react-native";
import Text from '../component/common/Text'
import * as Utill from '../utill';
import { connect, useDispatch } from 'react-redux';
import { updateLocation, updateAddress } from '../store/modules/maps';


const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;

const google_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
const GOOGLE_API_KEY = 'AIzaSyAFU82_JAporZ8W7FhWdBatmP9Qr-JdOUc';

const GoogleMaps =  ({isPressed, toggle, navigation, latitudeDelta, latitude, longitude}) => {

    const LATITUDE_DELTA = latitudeDelta;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const dispatch = useDispatch();

    const [region,setRegion] = useState({
        latitude,
        longitude,
        latitudeDelta : LATITUDE_DELTA,
        longitudeDelta : LONGITUDE_DELTA,
    });

    const [address, setAddress] = useState('찾는 중...');
    const [flex, setFlex] = useState(0.9997);

    const _goBack = ()=>{
        navigation.navigate('TabHome');
    }

    const _initAddress = async (lat,lon) =>{
        const url = `${google_url}${lat},${lon}&key=${GOOGLE_API_KEY}&language=ko`
        await fetch(url)
            .then((res)=>{
                return res.json()
            })
            .then((json)=>{
                let address = JSON.stringify(json.results[0].formatted_address);
                address = address.substring(5,address.length-1);    //"대한민국"
                setAddress(address)
                dispatch(updateAddress(address))
            })
    }
    const _getAddress = async (lat,lon) =>{
        const url = `${google_url}${lat},${lon}&key=${GOOGLE_API_KEY}&language=ko`
        fetch(url)
            .then((res)=>{
                return res.json()
            })
            .then((json)=>{
                let address = JSON.stringify(json.results[0].formatted_address);
                address = address.substring(5,address.length-1);    //"대한민국"
                setAddress(address)
            })
    }

    const _getStores = async()=>{
        
    }

    const _updateLocation = ()=>{
        dispatch(updateLocation({
            latitude : region.region.latitude,      
            longitude : region.region.longitude,  
        }));
        dispatch(updateAddress(address))
        _goBack(); 
    }

    const _setFlex =()=>{
        setFlex(1);
    }

    useEffect(()=>{
        _initAddress(region.latitude,region.longitude);
        setTimeout(()=>{
            _setFlex();
        }, 10);
    }, [])
    

    return (
        <View style = {{flex : 1}}>
            <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: flex }}
            initialRegion = {region}
        
            onRegionChange = {region=>{setRegion({region})}}
            onRegionChangeComplete = {
                region=>{
                    setRegion({region})
                    _getAddress(region.latitude,region.longitude)   
                    _getStores();
                }}
            showsUserLocation = {isPressed}
            showsMyLocationButton = {isPressed}
            onPress = {toggle}
            scrollEnabled = {isPressed}
            loadingEnabled
            zoomEnabled = {isPressed}
            followsUserLocation = {isPressed}
            >
                {!isPressed&&<Marker
                     coordinate={{
                        latitude : latitude,
                        longitude : longitude
                    }}
                    image = {{uri : 'icon_departure'}}></Marker>}

            </MapView>
            {isPressed? (
                <View style = {styles.backFixed}>
                    <TouchableOpacity 
                        onPress = {_goBack}>
                        <Image source = {
                            {uri: 'icon_back_button'}
                        }
                        style = {styles.backimg} />
                    </TouchableOpacity>
                </View>

            )
            :null
            }
            {isPressed&&
                <View style={styles.markerFixed}>
                    <Image style = {styles.marker} source = {
                        {uri: 'icon_departure'}
                    }></Image>
                </View>
            }
            <View style = {styles.address}>
                <Text style ={{fontSize:13,padding:10, color:'#555555'}}>출발지 : {address}</Text>
            </View>
            {isPressed? (
                <TouchableOpacity
                onPress = {_updateLocation}>
            <View style = {styles.departure}>
                <Text style = {styles.departureText}>
                    출발지로 설정
                </Text>
            </View>
            </TouchableOpacity>
            ): null}
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        latitude : state.Maps._root.entries[0][1].latitude,
        longitude : state.Maps._root.entries[0][1].longitude,
    }
}

export default connect(mapStateToProps)(GoogleMaps);

const styles = StyleSheet.create({
    markerFixed: {
        left: '50%',
        marginLeft: -20,
        marginTop: -64,
        position: 'absolute',
        top: '48%'
      },
      marker: {
        height: 40,
        width: 40
      },
      backFixed : {
        width : 40,
        height : 40,
        left : 25,
        marginLeft: -12,
        marginTop: -12,
        position: 'absolute',
        top : 50,
      },
      backimg : {
        width : 15,
        height : 20,
      },
      back :{
          height : 80,
          width : 80,
      },
      address : {
        justifyContent : 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0,height: 1},
        shadowOpacity: 0.16,
        shadowRadius: 1.00,
        elevation: 3,
        backgroundColor: "white",
        },
      departure : {
        height : Utill.screen.bottomTabHeight,
        backgroundColor : '#000',
        alignItems : 'center',
        justifyContent : 'center'
    },
    departureText : {
        fontSize : 20,
        color : 'white',
    }
});