import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const AVATAR_COLORS = [
	'#6C63FF', '#FF6584', '#43A047', '#FB8C00',
	'#1E88E5', '#E53935', '#8E24AA', '#00897B',
];

function getSeed(name?: string, email?: string): string {
	return name?.trim() || email?.split('@')[0] || 'user';
}

function getHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
	return Math.abs(hash);
}

function getInitials(name: string): string {
	const parts = name.trim().split(' ').filter(Boolean);
	if (parts.length === 0) return '?';
	if (parts.length === 1) return parts[0][0].toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface UserAvatarProps {
	name?: string;
	email?: string;
	size?: number;
}

export default function UserAvatar({ name, email, size = 96 }: UserAvatarProps) {
	const seed = getSeed(name, email);
	const hash = useMemo(() => getHash(seed), [seed]);

	const avatarId = (hash % 70) + 1;
	const avatarUrl = `https://i.pravatar.cc/${size * 2}?img=${avatarId}`;

	const fallbackColor = AVATAR_COLORS[hash % AVATAR_COLORS.length];
	const initials = useMemo(() => getInitials(seed), [seed]);

	const [imageError, setImageError] = React.useState(false);

	const borderRadius = size / 2;
	const fontSize = size * 0.36;

	if (imageError) {
		return (
			<View style={[styles.container, { width: size, height: size, borderRadius, backgroundColor: fallbackColor }]}>
				<Text style={[styles.initials, { fontSize }]}>{initials}</Text>
			</View>
		);
	}

	return (
		<Image
			source={{ uri: avatarUrl }}
			style={{ width: size, height: size, borderRadius }}
			onError={() => setImageError(true)}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	initials: {
		fontWeight: '700',
		color: '#FFFFFF',
	},
});
