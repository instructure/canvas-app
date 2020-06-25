import React, {Component} from "react";

import {Heading} from "@instructure/ui-heading";
import {Text} from "@instructure/ui-text";
import {View} from "@instructure/ui-view";
import {IconCheckMarkSolid} from "@instructure/ui-icons";

import Panda from "./Panda";

class Banner extends Component {
  render() {
    return (
      <View
        as="main"
        background="primary-inverse"
        padding="large medium none"
        minHeight="100%"
        textAlign="center"
      >
        <View
          padding="small"
          display="inline-block"
          background="success"
          borderRadius="large"
          shadow="topmost"
        >
          <IconCheckMarkSolid size="medium" inline={false} />
        </View>
        <div>
          <View
            maxWidth="40rem"
            margin="0 auto"
            padding="x-large medium medium"
            display="block"
            background="light"
            borderRadius="large"
            shadow="above"
          >
            <Panda />
            <Heading level="h1" margin="none none small">
              You&apos;re all ready to go!
            </Heading>
            <Text size="large">
              Just edit{" "}
              <Text weight="bold" size="large">
                App.js
              </Text>{" "}
              to start building with Instructure UI.
            </Text>
          </View>
        </div>
      </View>
    );
  }
}

export default Banner;
