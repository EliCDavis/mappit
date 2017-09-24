import { User } from '../user';
import { Post } from '../post';

export class Topology {

    constructor(
        private name: string,
        private owner: User,
        private date: Date,
        private subscribers: number,
        private posts: Array<Post>,
        private description: string
    ) { }

    getDate(): Date {
        return this.date;
    }

    getName(): string {
        return this.name;
    }

    getOwner(): User {
        return this.owner;
    }

    getSubsribers(): number {
        return this.subscribers;
    }

    getPosts(): Array<Post> {
        return this.posts;
    }

    getDescription(): string {
        return this.description;
    }

}
