import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography, radius } from '../constants/theme';
import { User } from '../data/mockData';

interface AvatarProps {
  user: User;
  size?: number;
  showBorder?: boolean;
}

export function Avatar({ user, size = 40, showBorder = false }: AvatarProps) {
  const initials = user.pseudo.slice(0, 2).toUpperCase();

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.bgSurface,
    borderWidth: showBorder ? 2 : 0,
    borderColor: showBorder ? colors.lime : 'transparent',
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (user.avatar) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: user.avatar }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, { backgroundColor: colors.bgSurface }]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

interface AvatarGroupProps {
  users: User[];
  size?: number;
  max?: number;
}

export function AvatarGroup({ users, size = 32, max = 3 }: AvatarGroupProps) {
  const displayed = users.slice(0, max);
  const overlap = size * 0.3;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {displayed.map((user, index) => (
        <View
          key={user.id}
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            zIndex: displayed.length - index,
          }}
        >
          <Avatar user={user} size={size} showBorder />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  initials: {
    color: colors.textSecondary,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
  },
});
