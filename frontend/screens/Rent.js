import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Rent = () => {
    return (
        <View style={styles.container}>
            <Text>Rent Listing</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})

export default Rent;

