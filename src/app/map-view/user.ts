export class User {
    constructor(
        private uid: string,
        private displayName: string,
        private picUrl: string
    ) { }

    public getName(): string {
        return this.displayName;
    }

    public getPicUrl(): string {
        return this.picUrl;
    }
}
