module.exports = 
/**
 * @description Retrive data about a course by name. If they're not signed in, returns "Unauthorized"
 * @param {firebase-admin} admin - Firebase admin instance 
 * @param {express} router - Our router instance of Express.js
 */
function getCourseByName(admin, router) {
    router.get('/getCourseByName', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    var coursename = request.query.full_name;
                    var category = request.query.category;
                    return admin.firestore().collection('Courses').doc(category).collection('courses')
                    .where('full_name', '==', coursename).get()
                    .then((snapshot) => {
                        if(snapshot.empty){
                            return response.status(404).send('No matching documents');
                        } else {
                            return response.status(200).send(snapshot.docs[0].data());
                        }
                    });
                } catch (error) {
                    console.error("Error retrieving courses: ", error);
                    response.status(500).send("Error retrieving courses: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}