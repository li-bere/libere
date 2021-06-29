const { functions, db } = require('./../../main');

const errorReporter = require('./../../utils/error-reporter');


async function calculateAverage(data: any, id: any) {

    const shopProfileRef = db.collection(`shops`)
    .doc(data.shopID);


    return db.runTransaction(function(transaction: any) {
        return transaction.get(shopProfileRef).then(function(vpDoc: any) {
            if (!vpDoc.exists) {
                return errorReporter.reportError('Profile not found',{profileId: data.shopkeeperID, ratingId: id}); 
            }
            const shopProfileData = vpDoc.data();
            console.log(shopProfileData);
            if(shopProfileData.totalRatings === undefined || typeof shopProfileData.totalRatings !== 'number'){
                shopProfileData.totalRatings = 0;
            }
            if(shopProfileData.sumOfRatings === undefined || typeof shopProfileData.sumOfRatings !== 'number'){
                shopProfileData.sumOfRatings = 0;
            }
            if(shopProfileData.rating === undefined || typeof shopProfileData.rating !== 'number'){
                shopProfileData.rating = 0;
    
            }
            console.log('shopProfileData.totalRatings', shopProfileData.totalRatings);
            console.log('shopProfileData.rating', shopProfileData.rating);
    
            const newTotalNumberOfRating = shopProfileData.totalRatings + 1;
            const newSumOfRatings = shopProfileData.sumOfRatings + data.rateValue;
            console.log('newSumOfRatings', newSumOfRatings);
            let newRating = (newSumOfRatings/newTotalNumberOfRating);
            newRating = Math.round(newRating * 1e1) / 1e1;
            console.log('newTotalNumberOfRating', newTotalNumberOfRating);
            console.log('newRating', newRating);
            transaction.update(shopProfileRef, { totalRatings: newTotalNumberOfRating, sumOfRatings: newSumOfRatings, rating: newRating });
            console.log('this is new rating', newRating);
        });
    })


}

export const onCreate = functions.firestore
.document("/shop-ratings/{id}").onCreate((snap: any, context: any) => {
    console.log('rating document created', snap.data());
    console.log('rating document context', context);
    return calculateAverage(snap.data(), context.id);
})
