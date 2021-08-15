import { EventSrc } from '../src/main';

interface ObjectArg {
	str: string;
	num: number;
	bool: boolean;
}

interface TestEvents {
	TEST_EVENT: undefined;
	TEST_EVENT_WITH_SIMPLE_ARG: string;
	TEST_EVENT_WITH_OBJECT_ARG: ObjectArg;
}

describe('Main test suite', () => {
	it('Should construct properly', () => {
		const evtSrc = new EventSrc<TestEvents>(['TEST_EVENT']);

		expect(evtSrc).toBeDefined();
	});

	it('Should attach and detatch event listeners properly', () => {
		const evtSrc = new EventSrc<TestEvents>(['TEST_EVENT']);
		const listener = jest.fn(() => {});

		const unsub = evtSrc.on('TEST_EVENT', listener);
		unsub();

		evtSrc.dispatch('TEST_EVENT');

		expect(listener).not.toHaveBeenCalled();
	});

	it('Should dispatch events properly', () => {
		const evtSrc = new EventSrc<TestEvents>(['TEST_EVENT']);
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT', listener);

		evtSrc.dispatch('TEST_EVENT');

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it('Should dispatch events with arguments properly', () => {
		const evtSrc = new EventSrc<TestEvents>(['TEST_EVENT_WITH_SIMPLE_ARG']);
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT_WITH_SIMPLE_ARG', listener);

		evtSrc.dispatch('TEST_EVENT_WITH_SIMPLE_ARG', 'test');

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith('test');
	});

	it('Should not dispatch events with wrong # of arguments', () => {
		const evtSrc = new EventSrc<TestEvents>(['TEST_EVENT_WITH_SIMPLE_ARG']);
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT_WITH_SIMPLE_ARG', listener);

		expect(() => {
			// @ts-expect-error
			evtSrc.dispatch('TEST_EVENT_WITH_SIMPLE_ARG', 'test', 'hi');
		}).toThrow();
		expect(listener).not.toHaveBeenCalled();
	});

	it('Should dispatch events with complex argumnets properly', () => {
		const evtSrc = new EventSrc<TestEvents>(['TEST_EVENT_WITH_OBJECT_ARG']);
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT_WITH_OBJECT_ARG', listener);

		evtSrc.dispatch('TEST_EVENT_WITH_OBJECT_ARG', { str: 'test', num: 1, bool: true });

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith({ str: 'test', num: 1, bool: true });
	});
});
