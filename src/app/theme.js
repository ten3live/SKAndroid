import React from "react";
import { View } from "react-native";
//export const API = `http://10.81.224.254:3001/node/`;


 //export const API = `http://127.0.0.1:3001/node/`;
 //export const API = `http://10.0.3.2:3001/node/`;
//export const API = `http://10.0.2.2:3001/node/`;
export const API = 'https://skworld.org/node/';

export const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREY: '#898989',
  THEME: '#B23AFC',
  PRIMARY: '#1f1f1f',
  INFO: '#1232FF',
  ERROR: '#FE2472',
  WARNING: '#FF9C09',
  SUCCESS: '#45DF31',
  TRANSPARENT: 'transparent',
  INPUT: '#808080',
  PLACEHOLDER: '#9FA5AA',
  NAVBAR: '#F9F9F9',
  BLOCK: '#808080',
  MUTED: '#9FA5AA',
  NEUTRAL: 'rgba(255,255,255, 0.65)',
  FACEBOOK: '#3B5998',
  TWITTER: '#5BC0DE',
  DRIBBBLE: '#EA4C89',
  ICON: '#000000',
};

const AppProvider=(children)=>{
    return<View>{children}</View>
}
export default AppProvider