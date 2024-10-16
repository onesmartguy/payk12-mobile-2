/**
 * @flow
 */

 import React, { useEffect, useReducer, useRef } from 'react'

 import useNetInfo from './useNetInfo'
 import signalR, { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'

//  var connectionBuilder = new signalR.HubConnectionBuilder()
//  .configureLogging("trace")
//  .withUrl(hubRoute, options)
//  .withHubProtocol(protocol);

// if (autoReconnectCheckbox.checked) {
//  connectionBuilder.withAutomaticReconnect();
// }

// connection = connectionBuilder.build();

// connection.on('Send', function (msg) {
//  addLine('message-list', msg);
// });

// connection.onclose(function (e) {
//  if (e) {
//      addLine('message-list', 'Connection closed with error: ' + e, 'red');
//  }
//  else {
//      addLine('message-list', 'Disconnected', 'green');
//  }
//  updateButtonState(false);
// });

// connection.onreconnecting(function (e) {
//  addLine('message-list', 'Connection reconnecting: ' + e, 'orange');
// });

// connection.onreconnected(function (e) {
//  addLine('message-list', 'Connection reconnected!', 'green');
// });

// connection.start()
//  .then(function () {
//      isConnected = true;
//      updateButtonState(true);
//      addLine('message-list', 'Connected successfully', 'green');
//  })
//  .catch(function (err) {
//      updateButtonState(false);
//      addLine('message-list', err, 'red');
//  });
// });

 /**
  * Create a new Hub connection.
  */
 export const makeHubConnection = (accessToken: string): HubConnection => {
   const { signalRUrl } = config
   return new HubConnectionBuilder().withUrl(signalRUrl, {
     // transport: HttpTransportType.WebSockets,
     accessTokenFactory: () => accessToken,
     logMessageContent: true
   }).configureLogging({
     log: function (logLevel, message) {
       // TODO: Remove after finish testing
       // console.log('SIGNALR: ' + new Date().toISOString() + ': ' + message)
     }
   }).build()
 }
 
 type Options = {
   retryOnError: boolean,
   retrySecondsDelay: number,
   initialData: any,
   newMethod: Function
 }
 
 function delay (timeout) {
   return new Promise(resolve => setTimeout(resolve, timeout))
 }
 
 /**
  * Initialize the connection with retries
  * @param {HubConnection} connection - The current Hub connection.
  * @param {Options} options - The options of the connection.
  */
 async function startConnection (connection: HubConnection, options: Options) {
   try {
     await connection.start()
   } catch (err) {
     if (options.retrySecondsDelay) {
       await delay(options.retrySecondsDelay)
       return startConnection(connection, options)
     } else throw err
   }
 };
 
 type RealTimeState = {
   data: any,
   error?: Error,
   loading: boolean,
   isConnected: boolean,
   accessToken?: string,
   connection?: HubConnection
 }
 
 /**
  * A generic hook to stablish a realtime connection when the device is connected to internet.
  * @param {String} methodName - The name of the hub method to define.
  * @param {*} options - The options of the realtime connection
  */
 export const useSignalR = function (methodName: string, options: Options = {
   retrySecondsDelay: 2000,
   initialData: [],
   retryOnError: true
 }): [RealTimeState, React.Dispatch<any>] {
   const netInfo = useNetInfo()
   const appState = useAppState()
   const unmounted = useRef(false)
   const connecting = useRef(false)
   const initialState = {
     data: options.initialData,
     error: null,
     loading: true,
     isConnected: netInfo.isConnected && netInfo.isInternetReachable,
     accessToken: null,
     connection: null
   }
   const reducer = (state: RealTimeState, newState: RealTimeState): RealTimeState => ({ ...state, ...newState })
   const [state, setState] = useReducer(reducer, initialState)
 
   const initializeConnection = async () => {
     if (
       state.connection.connectionState !== HubConnectionState.Connected &&
       !connecting.current
     ) {
       connecting.current = true
       try {
         await startConnection(state.connection, options)
         setState({ loading: false, connection: state.connection })
       } catch (error) {
         setState({ error })
       } finally {
         connecting.current = false
       }
     }
   }
 
   /**
    * Configure the connection
    */
   useEffect(() => {
     if (state.accessToken !== null && state.connection === null) {
       const connection = makeHubConnection(state.accessToken)
       connection.on(methodName, options.newMethod)
       connection.onclose((error) => {
         if (error && !unmounted.current) {
           setState({ error })
           if (options.retryOnError && state.isConnected) {
             initializeConnection()
           }
         }
       })
       setState({ connection })
     }
 
     /**
      * Close the connection before unmount
      */
     return () => {
       unmounted.current = true
       if (
         state.connection &&
         state.connection.connectionState === HubConnectionState.Connected
       ) {
         state.connection.stop()
       }
     }
   }, [ state.accessToken, state.connection ])
 
   /**
    * Initialize or Stop the connection
    */
   useEffect(() => {
     if (state.connection) {
       if (
         !unmounted.current &&
         state.isConnected &&
         appState === 'active'
       ) {
         initializeConnection()
       } else if (state.connection.connectionState !== HubConnectionState.Disconnected) {
         state.connection.stop()
       }
     }
   }, [
     appState,
     state.isConnected,
     state.accessToken,
     state.loading,
     state.connection
   ])
 
   /**
    * Detect app state and network changes
    */
   useEffect(() => {
     const isConnected = (
       appState === 'active' &&
       netInfo.isConnected !== false &&
       netInfo.isInternetReachable !== false
     )
     setState({
       isConnected,
       error: isConnected ? null : new Error('Network Error')
     })
   }, [netInfo, appState])
 
   return [state, setState]
 }
 
 export default useSignalR