import { Comment } from './comment';
import { User } from './user';
export class Post {
    
    constructor(
        private id: string,
        private title: string,
        private content: string,
        private mapData: any,
        private user: User,
        private date: Date,
        private topo: string,
        private comments: Array<Comment>
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

    getDate(): Date {
        return this.date;
    }

    getPoster(): User {
        return this.user;
    }

    getTopoName(): string {
        return this.topo;
    }

    getComments(): Array<Comment> {
        return this.comments;
    }

}