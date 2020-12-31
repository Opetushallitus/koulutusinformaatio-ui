export type Translateable = { fi?: string; sv?: string; en?: string };
export type Koodi = { koodiUri: string; nimi: Translateable };

// Utils
export type TODOType = any; // NOTE: Just a temporary type for documenting not-yet-typed stuff until everything is typed
export type ValueOf<T> = T[keyof T];
