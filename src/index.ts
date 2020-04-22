import jsonPointer from './json-pointer';
export default jsonPointer;

// Backwards compatible export
(jsonPointer as any).default = jsonPointer;
module.exports = jsonPointer;