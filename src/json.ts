export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonPrimitive =
    | null
    | boolean
    | number
    | string;
export type JsonValue =
    | JsonPrimitive
    | JsonArray
    | JsonObject;

export function isJsonValue(value: any) : value is JsonValue {
    return  (
        typeof value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        (Array.isArray(value) && value.every(item => isJsonValue(item))) ||
        (typeof value == 'object' && Object.values(value).every(item => isJsonValue(item)))
    );
}