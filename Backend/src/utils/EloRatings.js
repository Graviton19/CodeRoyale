const EloCalculator = (RatingA,RatingB,winner)=>{
    const ExpectedA = (1 / (1 +10**((RatingB - RatingA)/400)));
    const ExpectedB = (1 / (1+10**((RatingA - RatingB)/400)));
    const K = 40;
    let ScoreA,ScoreB
    if(winner == "user1")
    {
       ScoreA = 1;
       ScoreB = 0;
    }
    else
    {
        ScoreA = 0;
        ScoreB = 1;
    }
    const NewRatingA = RatingA + K*( ScoreA - ExpectedA);
    const NewRatingB = RatingB + K*( ScoreB - ExpectedB);
    return {NewRatingA,NewRatingB}
}

export {EloCalculator}