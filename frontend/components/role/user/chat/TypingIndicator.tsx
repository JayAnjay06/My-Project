import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export const TypingIndicator: React.FC = () => {
    return (
        <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.messageHeader}>
                <Text style={[styles.senderName, styles.aiName]}>
                    AI Mangrove
                </Text>
            </View>
            <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#228B22" />
                <Text style={styles.typingText}>AI sedang mengetik...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageBubble: {
        marginVertical: 6,
        padding: 12,
        borderRadius: 16,
        maxWidth: "85%",
        alignSelf: "flex-start",
        backgroundColor: "white",
        borderBottomLeftRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    aiBubble: {
        alignSelf: "flex-start",
        backgroundColor: "white",
        borderBottomLeftRadius: 4,
    },
    aiName: {
        color: "#228B22",
    },
    messageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    senderName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#228B22",
    },
    typingIndicator: {
        flexDirection: "row",
        alignItems: "center",
    },
    typingText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
    },
});