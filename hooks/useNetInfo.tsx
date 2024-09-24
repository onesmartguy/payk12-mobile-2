/**
 * @flow
 */

 import { useEffect, useState } from 'react'
 import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'

 type NetInfoState = {
   type: any,
   isConnected: boolean,
   isInternetReachable: boolean,
   details: any
 }
 
 const inititalState: NetInfoState = {
   type: NetInfoStateType.unknown,
   isConnected: false,
   isInternetReachable: false,
   details: null
 }
 
 /**
  * A React Hook which updates when the connection state changes.
  *
  * @returns The connection state.
  */
 export default function (): NetInfoState {
   const [netInfo, setNetInfo] = useState<NetInfoState>(inititalState as any)
 
   function onChange (newState: NetInfoState) {
     setNetInfo(newState)
   }
 
   useEffect(() => {
     NetInfo.fetch().then(setNetInfo as any)
     const sub = NetInfo.addEventListener(onChange as any)
 
     return () => {
        sub();
       (NetInfo as any).removeEventListener('connectionChange', onChange)
     }
   }, [])
 
   return netInfo
 }