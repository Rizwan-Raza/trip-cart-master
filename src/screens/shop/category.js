import {
  AdMobBanner
} from 'expo-ads-admob';
import unescape from 'lodash/unescape';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { connect } from 'react-redux';
import { ThemedView } from 'src/components';
import { padding } from 'src/components/config/spacing';
import { categoryListType } from 'src/config/category';
import { mainStack } from 'src/config/navigator';
import { fetchCategories } from 'src/modules/category/actions';
import {
  getTemplateConfigSelector,
  languageSelector
} from 'src/modules/common/selectors';
import Search from 'src/screens/home/containers/Search';
import Style1 from './category/Style1';
import Style2 from './category/Style2';
import Style3 from './category/Style3';
import Style4 from './category/Style4';







class CategoryScreen extends Component {
  constructor(props, context) {
    super(props, context);
    this.bannerAdId = Platform.OS == "ios" ? "ca-app-pub-6871330764548204/4405867144" : "ca-app-pub-6871330764548204/2183846724";
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCategories());
  }

  goProducts = item => {
    this.props.navigation.navigate(mainStack.products, {
      id: item.id,
      name: unescape(item.name),
    });
  };

  render() {
    const { t, templateConfig, language } = this.props;
    const type =
      templateConfig.getIn(['app_config', 'layout_category']) ||
      categoryListType.category1;

    return (
      <ThemedView isFullView style={styles.container}>
        <View style={styles.viewSearch}>
          <Search
            fields={{
              placeholder: {
                text: {
                  [language]: t('catalog:text_placeholder_search'),
                },
              },
            }}
          />
        </View>
        {type === categoryListType.category4 ? (
          <Style4 goProducts={this.goProducts} />
        ) : type === categoryListType.category3 ? (
          <Style3 goProducts={this.goProducts} />
        ) : type === categoryListType.category2 ? (
          <Style2 goProducts={this.goProducts} />
        ) : (
          <Style1 goProducts={this.goProducts} />
        )}
        <View style={styles.ads}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={this.bannerAdId}
            servePersonalizedAds
          />
        </View>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
  },
  viewSearch: {
    padding: padding.large,
  },
  ads: {
    margin: 16,
  }
});

const mapStateToProps = state => {
  return {
    templateConfig: getTemplateConfigSelector(state),
    language: languageSelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(CategoryScreen));
