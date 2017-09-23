import { Post } from '../post';

export class Topology {

    constructor(
        private name: string,
        private owner: string,
        private subscribers: number,
        private posts: Array<Post>
    ) { }

    getOwner(): string {
        return this.owner;
    }

    getSubsribers(): number {
        return this.subscribers;
    }

    getPosts(): Array<Post> {
        return this.posts;
    }

}
