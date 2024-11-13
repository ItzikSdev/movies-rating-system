export type TMovie = {
    id: number, 
    description: string
}
export type TVotes = {
    generatedTime: string, 
    itemCount: number, 
    itemId: number
}
export type TRows = {
    id: number;
    description: string;
    itemId: number | null;
    generatedTime: string | null;
    movieVotes: TVotes[]
    totalVotesWIthHistory: number
    lastUpdateTime: [{id: number, totalVotes: number, generatedTime: string}]
    topTwoVotes: number[]
    latestVoteTimeFormatted: string
}

