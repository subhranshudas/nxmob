// @ts-nocheck
import * as moment from 'moment';
import * as React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Linking, Image, TouchableWithoutFeedback
} from 'react-native';

import YouTube from 'react-native-youtube';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import device from 'react-native-device-detection';

import { IPFSIcon } from '../ipfsicon';
import { ParseText } from '../parsetext';
import GLOBALS from '../globals';
import { extractTimeStamp } from './utils';
import { MediaHelper as DownloadHelper } from '../mediaHelpers';

import config from '../config';
import chainDetails from './chainDetails';


// ================= Define types
export type chainNameType = "ETH_TEST_KOVAN" | "POLYGON_TEST_MUMBAI" | "ETH_MAINNET" | "POLYGON_MAINNET" | "THE_GRAPH" | undefined;

export type NotificationProps = {
  notificationTitle: string;
  notificationBody: string;
  app: string;
  icon: string;
  image: string;
  cta?: string;
  url?: string;
  chainName: chainNameType;
};


export const Notification : React.FC<NotificationProps> = ({
  notificationTitle = '',
  notificationBody = '',
  cta = '',
  app = '',
  icon = '',
  image = '',
  url = '',
  chainName
}) => {
  const videoPlayerRef = React.useRef(null);
  const ctaEnabled = Boolean(cta);

  const {
    originalBody: parsedBody,
    timeStamp
} = extractTimeStamp(notificationBody || '');


  // store the image to be displayed in this state variable
  const [ isVisible, setIsVisible ] = React.useState(false);

  const ChainIcon = chainDetails[chainName] ? chainDetails[chainName].Icon : null;

  // Finally mark if the device is a tablet or a phone
  let contentInnerStyle = {};
  let contentImgStyle = {};
  let contentMsgImgStyle = {};

  let contentVidStyle = {};
  let contentMsgVidStyle = {};

  let bgVidStyle = {};
  let contentYoutubeStyle = {
    marginBottom: 12
  }
  let contentBodyStyle = {};
  let containMode = 'contain';

  if (device.isTablet) {
    // Change the style to better suit tablet
    contentInnerStyle = {
      flexDirection: 'row',
      alignItems: 'center',
    };

    contentImgStyle = {
      width: '25%',
      aspectRatio: 1,
      borderRadius: 10,
      paddingRight: 20,
    };

    contentMsgImgStyle = {
      margin: 20,
      marginRight: 5,
      borderRadius: 10,
      borderWidth: 0,
    };

    contentYoutubeStyle = {
      width: '25%',
      aspectRatio: 1,
      borderRadius: 10,
      paddingRight: 20,
      margin: 20,
      marginRight: 10
    }

    contentVidStyle = {
      width: '25%',
      aspectRatio: 1,
      margin: 20,
      marginRight: 10
    }

    contentBodyStyle = {
      flex: 1,
    };

    contentMsgVidStyle = {
      width: '100%',
    }
    
    bgVidStyle = {
      borderRadius: 10,
    }

    containMode = 'cover';
  }

  const ctaStyles = {
    borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
    backgroundColor: GLOBALS.COLORS.GRADIENT_SECONDARY,
    borderWidth: 1,
    borderRadius: GLOBALS.ADJUSTMENTS.FEED_ITEM_RADIUS
  };

  if(ctaEnabled){
    ctaStyles['borderColor'] = GLOBALS.COLORS.GRADIENT_SECONDARY;
    ctaStyles['borderWidth'] = 1; // this is 1 in web
    ctaStyles['borderRadius'] = GLOBALS.ADJUSTMENTS.FEED_ITEM_RADIUS;
  }

  // to check valid url
  const validURL = (str: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  const onPress = (url:string) => {
    // TODO: fixTS
    // eslint-disable-next-line no-constant-condition
    if (validURL(url) || 1) {
      // console.log("OPENING URL ", url);
      // Bypassing the check so that custom app domains can be opened
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => onPress(cta)}
      disabled={!ctaEnabled}>
      <View style={[styles.inner, ctaStyles]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.appLink]}
            disabled={!url}
            onPress={() => onPress(url)}
          >
            <View style={[styles.appicon]}>
              <IPFSIcon icon={icon} />
            </View>
            <Text style={styles.apptext} numberOfLines={1}>
              {app}
            </Text>          
          </TouchableOpacity>

          {chainDetails[chainName] ? (
            <View style={styles.networkIcon} numberOfLines={1}>
              <ChainIcon />
            </View>
          ) : null}  
        </View>

        <View style={styles.content}>
          <View style={[ contentInnerStyle]}>
            {image ?
              // if its an image then render this
              (!DownloadHelper.isMediaSupportedVideo(image) ? (
                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation();
                    setIsVisible(true);
                  }}
                  style={[styles.contentImg, contentImgStyle]}>
                  <Image
                    style={[styles.image, contentMsgImgStyle]}
                    source={{uri: image}}
                    resizeMode={containMode}
                  />
                </TouchableOpacity>
              ) : // if its a youtube url, RENDER THIS
              DownloadHelper.isMediaYoutube(image) ? (
                <YouTube
                    videoId={DownloadHelper.getYoutubeID(image)}
                    apiKey={config.YOUTUBE_API_KEY}
                    play={false}
                    fullscreen={false}
                    loop={false}
                    controls={1}
                    style={[styles.backgroundVideo, contentYoutubeStyle]}
                    />
              ) : (
                <View style={[styles.contentVid, contentVidStyle]}>
                  <View style={[styles.msgVid, contentMsgVidStyle]}>
                    <Video
                      resizeMode={containMode}
                      source={{uri: image}} // Can be a URL or a local file.
                      ref={videoPlayerRef} // Store reference
                      style={[styles.backgroundVideo, bgVidStyle]}
                      controls
                    />
                  </View>
                </View>
              // TODO: fixTS
              // eslint-disable-next-line react/jsx-no-useless-fragment
              )) : <></>}
            <View style={[styles.contentBody, contentBodyStyle]}>
              {!notificationTitle ? null : (
                <Text style={[styles.msgSub]}>{notificationTitle}</Text>
              )}
              <View style={styles.msg}>
                {/* The entire content of the main component */}
                <ParseText
                  title={
                    parsedBody
                    .replace(/\\n/g, '\n')
                    .replace(/\//g, '') || ""
                  }
                  fontSize={13}
                />
                {/* The entire content of the main component */}
              </View>

              {!timeStamp ? null : (
                <View style={styles.timestampOuter}>
                  <Text style={styles.timestamp}>
                    {moment
                      .utc(parseInt(timeStamp) * 1000)
                      .local()
                      .format('DD MMM YYYY | hh:mm A')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        {/* when an image is clicked on make it fulll screen */}
        <Modal animationIn="fadeIn"  animationOut="fadeOut" isVisible={isVisible}>
          <TouchableWithoutFeedback onPress={()=> setIsVisible(false)}>
              <Image
              style={styles.overlayImage}
              source={{uri: image}}
              />
          </TouchableWithoutFeedback>
        </Modal>
        {/* when an image is clicked on make it fulll screen */}
      </View>
    </TouchableOpacity>
  );
};

// ================= Define styled components
// / Styling
const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    top: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    marginVertical: 15,
    marginHorizontal: 20
  },
  inner: {
    margin: 1,
    overflow: 'hidden',
    borderRadius: GLOBALS.ADJUSTMENTS.FEED_ITEM_RADIUS,
  },
  header: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: GLOBALS.COLORS.SLIGHTER_GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
  },
  appInfo: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  appLink: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  appicon: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 24,
    aspectRatio: 1,
    marginRight: 5,
    overflow: 'hidden',
    backgroundColor: GLOBALS.COLORS.SLIGHT_GRAY,
  },
  apptext: {
    marginRight: 10,
    marginLeft: 5,
    fontSize: 14,
    color: GLOBALS.COLORS.BLACK,
    fontWeight: '400',
  },
  networkIcon: {
    fontSize: 9,
    color: 'blue',
    fontWeight: '300',
    height: 18,
    width: 18
  },
  appsecret: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  content: {
    backgroundColor: GLOBALS.COLORS.WHITE,
    padding: 12, // as per Web
    paddingBottom: 0
  },
  contentLoader: {
    margin: 20,
  },
  contentVid: {
    width: '100%',
    marginBottom: 12
  },
  msgVid: {
    borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
    backgroundColor: GLOBALS.COLORS.SLIGHTER_GRAY,
    borderBottomWidth: 1,
  },
  contentImg: {
    width: '100%',
    aspectRatio: 2,
  },
  msgImg: {
    borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
    backgroundColor: GLOBALS.COLORS.SLIGHTER_GRAY,
    borderBottomWidth: 1,
    resizeMode: 'contain',
  },
  contentBody: {
    paddingHorizontal: 0,
  },
  msgSub: {
    fontSize: 18,
    fontWeight: '400',
    color: GLOBALS.COLORS.BLACK,
    paddingVertical: 0,
  },
  msg: {
    paddingTop: 5,
    paddingBottom: 15,
  },
  timestampOuter: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 15,
    marginRight: -20,
    overflow: 'hidden',
  },
  timestamp: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#808080',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    marginBottom: 12 // same as web
  },
  overlayImage: {
    flex: 1,
    resizeMode: 'contain',
    borderRadius: 20,
    overflow: 'hidden',
  }
});
