export interface HostEventSource<E extends FullEventMap> {
	addEventListener<K extends keyof E>(type: K, listener: (evt: E[K]) => any, options?: boolean | AddEventListenerOptions): void;
	removeEventListener<K extends keyof E>(type: K, listener: (evt: E[K]) => any, options?: boolean | EventListenerOptions): void;
}

export type EventMap = Record<string, any | undefined>;
export type FullEventMap = Record<string, any>;
export type EvtListener<T = undefined> = T extends undefined ? () => void : (evt: T) => void;
export type Unsubscriber = () => void;
export type ListenerMap<T extends Record<string, any>> = {
	[event in keyof T]: EvtListener<T[event]>[];
};
