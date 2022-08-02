import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

export interface NotificationProps {
  title: string
}

export function Notification(props: NotificationProps) {
  return (
    <View>
      <Text style={styles.msg}>Welcome to notification component! Message from App: {props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  msg: {
    color: 'green',
    fontSize: 20,
    margin: 10,
    padding: 10,
    borderColor: 'orange',
    borderWidth: 2
  }
})