export class Post {
    constructor(
        private id: string,
        private title: string,
        private content: string,
        private mapData: any
    ){}

    getTitle(): string {
        return this.title;
    }
}
