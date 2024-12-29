import FakeTimers from "@sinonjs/fake-timers";
let clock: FakeTimers.InstalledClock;

export function mockDateAdvancingTime(dateString = "2025-06-22 12:23 UTC") {
	// vi.setSystemTime does not advance time
	clock = FakeTimers.install({
		now: new Date(dateString).getTime(),
		toFake: ["Date"],
		shouldAdvanceTime: true,
	});
}

export function restoreDateAdvancingTime() {
	clock.uninstall();
}
