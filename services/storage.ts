import { auth } from '@/constants/firebase';
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
    type UploadTask,
} from 'firebase/storage';

const storage = getStorage();

function currentUserId(): string {
	const uid = auth.currentUser?.uid;
	if (!uid) throw new Error('User not authenticated');
	return uid;
}

async function uriToBlob(uri: string): Promise<Blob> {
	const response = await fetch(uri);
	return response.blob();
}

export const StorageService = {
	async uploadProductImage(
		productId: string,
		imageUri: string,
		index: number,
		onProgress?: (progress: number) => void
	): Promise<string> {
		const blob = await uriToBlob(imageUri);
		const extension = imageUri.split('.').pop() ?? 'jpg';
		const storageRef = ref(storage, `products/${productId}/image_${index}.${extension}`);

		return new Promise((resolve, reject) => {
			const uploadTask: UploadTask = uploadBytesResumable(storageRef, blob);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					onProgress?.(Math.round(progress));
				},
				(error) => reject(error),
				async () => {
					const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
					resolve(downloadUrl);
				}
			);
		});
	},

	async uploadProductImages(
		productId: string,
		imageUris: string[],
		onProgress?: (progress: number) => void
	): Promise<string[]> {
		const urls: string[] = [];
		for (let i = 0; i < imageUris.length; i++) {
			const url = await StorageService.uploadProductImage(
				productId,
				imageUris[i],
				i,
				(progress) => {
					const overall = ((i / imageUris.length) + (progress / 100 / imageUris.length)) * 100;
					onProgress?.(Math.round(overall));
				}
			);
			urls.push(url);
		}
		return urls;
	},

	async uploadAvatar(
		imageUri: string,
		onProgress?: (progress: number) => void
	): Promise<string> {
		const uid = currentUserId();
		const blob = await uriToBlob(imageUri);
		const extension = imageUri.split('.').pop() ?? 'jpg';
		const storageRef = ref(storage, `avatars/${uid}/avatar.${extension}`);

		return new Promise((resolve, reject) => {
			const uploadTask: UploadTask = uploadBytesResumable(storageRef, blob);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					onProgress?.(Math.round(progress));
				},
				(error) => reject(error),
				async () => {
					const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
					resolve(downloadUrl);
				}
			);
		});
	},

	async uploadReviewImage(
		reviewId: string,
		imageUri: string,
		index: number
	): Promise<string> {
		const uid = currentUserId();
		const blob = await uriToBlob(imageUri);
		const extension = imageUri.split('.').pop() ?? 'jpg';
		const storageRef = ref(storage, `reviews/${uid}/${reviewId}/image_${index}.${extension}`);
		const snapshot = await uploadBytesResumable(storageRef, blob);
		return getDownloadURL(snapshot.ref);
	},

	async deleteByUrl(url: string): Promise<void> {
		const storageRef = ref(storage, url);
		await deleteObject(storageRef);
	},
};
