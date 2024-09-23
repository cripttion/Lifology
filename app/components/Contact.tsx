import { colors } from 'app/theme';
import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ContactLinks = () => {
  // Function to open the URL
  const openLink = async (url: string) => {
    // Check if the device can open the URL
    // const supported = await Linking.canOpenURL(url);

      await Linking.openURL(url);
   
    
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => openLink('https://github.com/cripttion')}>
        <Text style={styles.linkText}>GitHub</Text>
      </TouchableOpacity>
      <Text style={styles.separator}> | </Text>
      <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/in/pulak-cripttion')}>
        <Text style={styles.linkText}>LinkedIn</Text>
      </TouchableOpacity>
      <Text style={styles.separator}> | </Text>
      <TouchableOpacity onPress={() => openLink('mailto:pulakshri@gmail.com')}>
        <Text style={styles.linkText}>Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color:colors.palette.accent100, // Change this to your preferred color
    textDecorationLine: 'underline',
  },
  separator: {
    color: 'black', // Separator color
  },
});

export default ContactLinks;
