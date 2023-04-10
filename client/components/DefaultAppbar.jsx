import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';

export const DefaultAppBar = ({ title, backActionCallback=null, showTitle=true }) => {

  return (
    <React.Fragment>
      <StatusBar key={title} />
      <Appbar.Header statusBarHeight={30} style={{ paddingBottom: 0 }}>
        {showTitle && <Appbar.Content title={title} />}
        {backActionCallback && <Appbar.BackAction onPress={backActionCallback} />}
      </Appbar.Header>
    </React.Fragment>
  )
}