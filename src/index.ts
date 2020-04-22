// Backwards compatible export
import jsonPointer from './json-pointer';
(jsonPointer as any).default = jsonPointer;
module.exports = jsonPointer;