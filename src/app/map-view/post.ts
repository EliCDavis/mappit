export class Post {
    constructor(
        private id: string,
        private title: string,
        private content: string,
        private mapData: any
    ){}

    getId(): string{
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getContent(): string {
        return this.content;
    }

    getLat(): number {
        return this.mapData.lat;
    }

    getLon(): number {
        return this.mapData.lon;
    }

}