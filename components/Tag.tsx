import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
  // Define status configurations
  const statusConfig: Record<string, { backgroundColor: string; textColor: string; displayText: string }> = {
    active: {
      backgroundColor: '#4caf50',
      textColor: '#fff',
      displayText: 'Available'
    },
    sold_out: {
      backgroundColor: '#ff9800',
      textColor: '#fff',
      displayText: 'Sold Out'
    },
    draft: {
      backgroundColor: '#e0e0e0',
      textColor: '#666',
      displayText: 'Draft'
    }
  };

  // Default to draft if status not found
  const config = statusConfig[text] || statusConfig.draft;

  return (
    <View style={[styles.tag, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Tag;