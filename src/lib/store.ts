import { get, writable, type Updater } from 'svelte/store';

export function localStore<T = string>(key: string) {
	const store = writable<T>();
	const { subscribe, set, update } = store;
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser) {
		const current = localStorage.getItem(key);
		if (current != null) {
			set(JSON.parse(current));
		}
	}

	return {
		subscribe,
		set: (data: T) => {
			isBrowser && localStorage.setItem(key, JSON.stringify(data));
			set(data);
		},
		update: (fn: Updater<T>) => {
			const updatedStore = fn(get(store));
			isBrowser && localStorage.setItem(key, JSON.stringify(updatedStore));
			update(fn);
		}
	};
}

export const sessionStore = localStore<string>('observeSessionId');
