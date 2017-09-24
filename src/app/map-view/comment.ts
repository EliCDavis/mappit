export class Comment {

    constructor(
        private comment: string,
        private date: Date,
        private picUrl: string,
        private userDisplay: string
    ){}

    public getComment(): string{
        return this.comment;
    }

    public getPicUrl(): string{
        return this.picUrl;
    }

    public getUserDisplay(): string{
        return this.userDisplay;
    }

    public getDate(): Date{
        return this.date;
    }

}
