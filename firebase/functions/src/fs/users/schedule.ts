import { functions, db } from "../../main";
// const batch = db.batch();
async function dailySched(){
    let rankings: any;
     const rankingsnapshot= await db.collection('rankings').get();
     rankingsnapshot.forEach(async function (doc) {
        rankings = doc.data();
        rankings.id = doc.id;
        await db.collection('rankings').doc(doc.id).update('dailyco2',0);
        await db.collection('rankings').doc(doc.id).update('dailypla2',0);
      });

}

async function monthSched(){
    let rankings: any;
     const rankingsnapshot= await db.collection('rankings').get();
     rankingsnapshot.forEach(async function (doc) {
        rankings = doc.data();
        rankings.id = doc.id;
        await db.collection('rankings').doc(doc.id).update('monthlyco2',0);
        await db.collection('rankings').doc(doc.id).update('monthlypla2',0);
      });

}
export const dailySchedule = functions.pubsub.schedule('every 24 hours')
    .onRun(async (context: any) => {
    console.log('this will be run every day eastern', context);
    return dailySched();
});


export const monthlySchedule = functions.pubsub.schedule('every 720 hours')
    .onRun(async (context: any) => {
    console.log('this will be run every week eastern', context);
    return monthSched();
});