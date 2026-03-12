import "@testing-library/jest-dom";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock window.location.reload
Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: jest.fn() },
});