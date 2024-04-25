export enum Status {
    Active = 'ACTIVE',
    Removed = 'REMOVED'
}

export namespace Status {
    export function getStatusFromString(text: string): Status | undefined {
        for (const status of Object.values(Status)) {
            if (status === text) {
                return status as Status
            }
        }
        return undefined;
    }
}