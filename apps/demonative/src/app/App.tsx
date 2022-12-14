/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button
  // TouchableOpacity,
  // Linking,
} from 'react-native';

import { Notification } from '@dasubh/uimobile';

import { DEFAULT_NOTIFICATIONS } from './notificationData';
import { parseApiResponse } from './helpers';
import { fetchNotifications } from './api';

const dummyData = parseApiResponse(DEFAULT_NOTIFICATIONS);

export const App = () => {
  const [user, setUser] = React.useState('0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1');
  const [notifData, setNotifData] = React.useState([]);
  const [pageSize, setPageSize] = React.useState('10');

  const scrollViewRef = useRef<null | ScrollView>(null);

  const getData = async () => {
    const apiResponse = await fetchNotifications(user, parseInt(pageSize));
    console.log('\n\ntotal notifs fetched: ', apiResponse.results.length, '\n\n');
    const parsedResults = parseApiResponse(apiResponse.results);

    setNotifData([...parsedResults, ...dummyData]);
  };


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          ref={(ref) => {
            scrollViewRef.current = ref;
          }}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.section}>
            <Text>Enter your ETH address: </Text>

            <TextInput
              style={styles.input}
              onChangeText={setUser}
              value={user}
            />

            <TextInput
              style={styles.input}
              onChangeText={setPageSize}
              value={pageSize}
            />

            <Button
              title="Fetch Notifs"
              onPress={() => getData()}
            />
           
            {notifData.map((oneNotification, idx) => {
             const {cta, title, message, app, icon, image, blockchain } = oneNotification;

              return (
                <Notification
                  key={idx}
                  notificationTitle={title}
                  notificationBody={message}
                  cta={cta}
                  app={app}
                  icon={icon}
                  image={image}
                  chainName={blockchain}
                />
              );
            })}

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#ffffff',
  },
  codeBlock: {
    backgroundColor: 'rgba(55, 65, 81, 1)',
    marginVertical: 12,
    padding: 12,
    borderRadius: 4,
  },
  monospace: {
    color: '#ffffff',
    fontFamily: 'Courier New',
    marginVertical: 4,
  },
  comment: {
    color: '#cccccc',
  },
  marginBottomSm: {
    marginBottom: 6,
  },
  marginBottomMd: {
    marginBottom: 18,
  },
  marginBottomLg: {
    marginBottom: 24,
  },
  textLight: {
    fontWeight: '300',
  },
  textBold: {
    fontWeight: '500',
  },
  textCenter: {
    textAlign: 'center',
  },
  text2XS: {
    fontSize: 12,
  },
  textXS: {
    fontSize: 14,
  },
  textSm: {
    fontSize: 16,
  },
  textMd: {
    fontSize: 18,
  },
  textLg: {
    fontSize: 24,
  },
  textXL: {
    fontSize: 48,
  },
  textContainer: {
    marginVertical: 12,
  },
  textSubtle: {
    color: '#6b7280',
  },
  section: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  shadowBox: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  appTitleText: {
    paddingTop: 12,
    fontWeight: '500',
  },
  hero: {
    borderRadius: 12,
    backgroundColor: '#143055',
    padding: 36,
    marginBottom: 24,
  },
  heroTitle: {
    flex: 1,
    flexDirection: 'row',
  },
  heroTitleText: {
    color: '#ffffff',
    marginLeft: 12,
  },
  heroText: {
    color: '#ffffff',
    marginVertical: 12,
  },
  whatsNextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 8,
    width: '50%',
    marginTop: 24,
  },
  learning: {
    marginVertical: 12,
  },
  love: {
    marginTop: 12,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 320,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

export default App;
