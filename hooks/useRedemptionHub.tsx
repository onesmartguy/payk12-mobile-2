import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import { useState, useEffect} from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useHandler } from 'react-native-reanimated';

const redemptionHubUrl = "https://api.staging.payk12.com/hub/events/redemption";

export function useRedemptionHub({userId, eventId}: {userId: number, eventId?: number[]}, dep: any[]) {
  const [connection, setConnection] = useState<null | HubConnection>(null);
  const [ticketRedeemedEvent, setTicketRedeemedEvent] = useState(null);
  const [receiveMessageEvent, setReceiveMessageEvent] = useState(null);
  const [ticketSharedEvent, setTicketSharedEvent] = useState(null);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
    .withUrl(redemptionHubUrl)
    .withAutomaticReconnect()
    .build();

    setConnection(connect);
    
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(async () => {
          if(userId){

            await connection.send("SendMessage", "userId", `${userId}`);
            await connection.send("AddToGroup", `${userId}`);
            connection.on("ReceiveMessage", (message) => {
              console.log(message)
              setReceiveMessageEvent(message)
            });
            connection.on("TicketRedeemed", (message) => {
              console.log(message)
              setTicketRedeemedEvent(message)
            });
            connection.on("TicketShared", (message) => {
              console.log(message)
              setTicketSharedEvent(message)
            });
          }
        })
        .catch((error) => console.log(error));
    }
    return () => {
      connection?.stop().then(() => {
        connection?.off("ReceiveMessage");
        connection?.off("TicketRedeemed");
        connection?.off("TicketShared");
      });
    }
  }, [connection, ...dep]);

  return {eventHub: connection, receiveMessageEvent, ticketRedeemedEvent, ticketSharedEvent}
}
