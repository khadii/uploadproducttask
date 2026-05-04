import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  titleColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  style,
  backgroundColor = '#2196F3',
  titleColor = '#fff',
}) => {
  const insets = useSafeAreaInsets();
  
  // Calculate top padding based on platform and safe area
  const topPadding = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor,
          paddingTop: topPadding,
          height: 60 + topPadding,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {showBack && (
          <TouchableOpacity 
            onPress={onBackPress} 
            style={styles.leftButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="arrow-back" size={24} color={titleColor} />
          </TouchableOpacity>
        )}
        
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        
        {rightIcon ? (
          <TouchableOpacity 
            onPress={onRightPress} 
            style={styles.rightButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name={rightIcon} size={24} color={titleColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2196F3',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  leftButton: {
    padding: 8,
    width: 40,
    zIndex: 1,
  },
  rightButton: {
    padding: 8,
    width: 40,
    zIndex: 1,
  },
  placeholder: {
    width: 40,
  },
});

export default Header;