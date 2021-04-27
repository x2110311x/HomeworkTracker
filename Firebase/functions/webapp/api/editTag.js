module.exports = 
/**
 * @description Post request to edit a tag in the database. If they're not signed in, returns "Unauthorized"
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} router - Our router instance of Express.js
 */
function editTagAPI(admin, router) {
    router.post("/editTag", (request, response) => {
        if (request.signedin) {
            var user = request.decodedClaims;
            var full_name = request.body.full_name;
            var short_name = request.body.short_name;
            var color = request.body.color;
            var date_updated = admin.firestore.Timestamp.now();
            var tagId = request.body.tagId;
            console.log(tagId);
            console.log(request.body);

            var data = {
                date_updated: date_updated,
            };
            if (full_name != undefined){
                data['full_name'] = full_name;
            }
            if (short_name != undefined){
                data['short_name'] = short_name;
            }
            if (color != undefined){
                data['color'] = color;
            }

            var docPath = `/Users/${user.uid}/tags/${tagId}`;
            const writeResult = admin.firestore().doc(docPath).update(data).then(() => {
                    response.status(200).send("Tag successfully updated");
                    console.log("Tag has been added,", writeResult.id);
                }).catch((error) => {
                    console.error(`Error modifying tag: ${error}`);
                    response.status(500).send(`Error modifying tag: ${error}`);
                });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}