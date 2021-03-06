import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, ScrollView} from 'react-native';

import {Header, Text, ThemedView, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
import {Row} from 'src/containers/Gird';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import {padding} from 'src/components/config/spacing';

class ProductAttribute extends Component {
  renderAttribute(attribute) {
    return (
      <ThemeConsumer>
        {({theme}) => (
          <Row
            key={attribute.get('id')}
            style={[styles.row, {borderColor: theme.colors.border}]}>
            <View style={styles.colLeft}>
              <Text medium>{attribute.get('name')}</Text>
            </View>
            <View style={[styles.colRight, {borderColor: theme.colors.border}]}>
              <Text colorSecondary>{attribute.get('options').join(', ')}</Text>
            </View>
          </Row>
        )}
      </ThemeConsumer>
    );
  }

  render() {
    const {t, route} = this.props;
    const attributes = route?.params?.attributes ?? [];
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader name="x" size={24} />}
          centerComponent={
            <TextHeader title={t('common:text_product_attribute')} />
          }
        />
        <ScrollView>
          <Container>
            {attributes.map(attribute => this.renderAttribute(attribute))}
          </Container>
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 1,
  },
  colLeft: {
    flex: 1,
    paddingVertical: padding.large,
    paddingRight: padding.large,
  },
  colRight: {
    flex: 3,
    paddingVertical: padding.large,
    paddingLeft: padding.large,
    borderLeftWidth: 1,
  },
});

ProductAttribute.propTypes = {};

export default withTranslation()(ProductAttribute);
