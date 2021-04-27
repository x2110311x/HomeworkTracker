module.exports = 
/**
 * @description Retrive all of a user's tags. If they're not signed in, returns "Unauthorized"
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} router - Our router instance of Express.js
 */
function getTags(admin, router) {
    router.get('/getTags', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    let responseData = [];
                    return admin.firestore().collection('Users').doc(request.decodedClaims.uid).collection('tags').get()
                    .then(snapshot => {
                        snapshot.forEach((item) => {
                            responseData.push(item.data());
                        });
                        return response.status(200).send(responseData);
                    });
                } catch (error) {
                    console.error("Error retrieving tags: ", error);
                    response.status(500).send("Error retrieving tags: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}