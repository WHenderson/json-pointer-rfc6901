export class JsonPointerError extends Error {
    constructor(message: string) {
        super(message);
    }
}
Object.defineProperty(JsonPointerError.prototype, 'name', {
    enumerable: false, // this is the default
    configurable: true,
    value: JsonPointerError.name,
    writable: true
});