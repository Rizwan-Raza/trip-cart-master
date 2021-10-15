import {
  AdMobBanner
} from 'expo-ads-admob';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Header, Text, ThemedView } from 'src/components';
import { grey5 } from 'src/components/config/colors';
import { margin } from 'src/components/config/spacing';
import Container from 'src/containers/Container';
import { CartIcon, TextHeader } from 'src/containers/HeaderComponent';
import SocialIcon from 'src/containers/SocialIcon';
import { authSelector } from 'src/modules/auth/selectors';
import {
  configsSelector,
  languageSelector, wishListSelector
} from 'src/modules/common/selectors';
import HeaderMe from './containers/HeaderMe';
import InformationMe from './containers/InformationMe';
import SettingMe from './containers/SettingMe';




class MeScreen extends Component {
  constructor(props, context) {
    super(props, context);
    this.bannerAdId = Platform.OS == "ios" ? "ca-app-pub-6871330764548204/5149038959" : "ca-app-pub-6871330764548204/3041981872";
  }

  icon = name => {
    return {
      name: name,
      size: 18,
      color: grey5,
    };
  };

  handleLinkUrl = url => {
    Linking.openURL(url);
  };

  goPageOther = router => {
    this.props.navigation.navigate(router);
  };

  render() {
    const {
      t,
      configs,
      auth: { isLogin },
      language,
    } = this.props;

    return (
      <ThemedView isFullView>
        <Header
          centerComponent={<TextHeader title={t('common:text_me_screen')} />}
          rightComponent={<CartIcon />}
        />
        <ScrollView>
          <Container style={styles.viewContent}>
            <HeaderMe />
            <InformationMe isLogin={isLogin} clickPage={this.goPageOther} />
            <SettingMe
              isLogin={isLogin}
              clickPage={this.goPageOther}
              goPhone={this.handleLinkUrl}
              phonenumber={configs.get('phone')}
            />
            <View style={styles.viewSocial}>
              <SocialIcon
                light
                raised={false}
                type="facebook"
                style={styles.socialIconStyle}
                iconSize={15}
                onPress={() => this.handleLinkUrl(configs.get('facebook'))}
              />

              <SocialIcon
                light
                raised={false}
                type="instagram"
                style={styles.socialIconStyle}
                iconSize={15}
                onPress={() => this.handleLinkUrl(configs.get('instagram'))}
              />

              <SocialIcon
                light
                raised={false}
                type="pinterest"
                style={styles.socialIconStyle}
                iconSize={15}
                onPress={() => this.handleLinkUrl(configs.get('pinterest'))}
              />

              <SocialIcon
                light
                raised={false}
                type="twitter"
                style={styles.socialIconStyle}
                iconSize={15}
                onPress={() => this.handleLinkUrl(configs.get('twitter'))}
              />
            </View>
            <Text h6 colorThird>
              {typeof configs.get('copyright') === 'string'
                ? configs.get('copyright')
                : configs.getIn(['copyright', language])}
            </Text>
          </Container>
          {(global.attperm === 'authorized' || global.attperm === 'unavailable') && <AdMobBanner style={styles.ads}
          bannerSize="fullBanner"
          adUnitID={this.bannerAdId}
          servePersonalizedAds
        />}
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewContent: {
    marginTop: margin.large,
    marginBottom: margin.big,
  },
  viewSocial: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginVertical: margin.large + 4,
  },
  socialIconStyle: {
    width: 32,
    height: 32,
    margin: 0,
    marginHorizontal: margin.small / 2,
    paddingTop: 0,
    paddingBottom: 0,
  },
  ads: {
    marginTop: 16,
  }
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    wishList: wishListSelector(state),
    configs: configsSelector(state),
    language: languageSelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(MeScreen));
